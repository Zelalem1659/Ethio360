from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, jwt_required_optional
from app import db
from app.models.user import User, Donation
import stripe
from datetime import datetime

donations_bp = Blueprint('donations', __name__)

@donations_bp.route('/create-payment-intent', methods=['POST'])
@jwt_required_optional
def create_donation_payment_intent():
    try:
        data = request.get_json()
        amount = data.get('amount')
        currency = data.get('currency', 'usd')
        is_recurring = data.get('is_recurring', False)
        recurring_interval = data.get('recurring_interval', 'monthly')
        donor_name = data.get('donor_name')
        donor_email = data.get('donor_email')
        message = data.get('message', '')
        
        if not amount or amount <= 0:
            return jsonify({'error': 'Invalid donation amount'}), 400
        
        # For anonymous donations, require name and email
        user_id = get_jwt_identity()
        if not user_id and (not donor_name or not donor_email):
            return jsonify({'error': 'Name and email are required for anonymous donations'}), 400
        
        stripe.api_key = current_app.config['STRIPE_SECRET_KEY']
        
        if is_recurring:
            # Create recurring donation subscription
            price = stripe.Price.create(
                unit_amount=int(amount * 100),  # Convert to cents
                currency=currency,
                recurring={'interval': recurring_interval},
                product_data={'name': f'Monthly Donation to Ethio360'}
            )
            
            customer_data = {
                'name': donor_name,
                'email': donor_email
            }
            
            if user_id:
                user = User.query.get(user_id)
                if user:
                    customer_data['name'] = f"{user.first_name} {user.last_name}"
                    customer_data['email'] = user.email
            
            customer = stripe.Customer.create(**customer_data)
            
            subscription = stripe.Subscription.create(
                customer=customer.id,
                items=[{'price': price.id}],
                payment_behavior='default_incomplete',
                expand=['latest_invoice.payment_intent'],
                metadata={
                    'user_id': user_id if user_id else '',
                    'donor_name': donor_name,
                    'donor_email': donor_email,
                    'message': message,
                    'type': 'donation',
                    'is_recurring': 'true'
                }
            )
            
            return jsonify({
                'subscription_id': subscription.id,
                'client_secret': subscription.latest_invoice.payment_intent.client_secret
            }), 200
        else:
            # One-time donation
            intent = stripe.PaymentIntent.create(
                amount=int(amount * 100),  # Convert to cents
                currency=currency,
                metadata={
                    'user_id': user_id if user_id else '',
                    'donor_name': donor_name,
                    'donor_email': donor_email,
                    'message': message,
                    'type': 'donation',
                    'is_recurring': 'false'
                }
            )
            
            return jsonify({
                'client_secret': intent.client_secret,
                'payment_intent_id': intent.id
            }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to create donation payment intent'}), 500

@donations_bp.route('/confirm', methods=['POST'])
@jwt_required_optional
def confirm_donation():
    try:
        data = request.get_json()
        payment_intent_id = data.get('payment_intent_id')
        subscription_id = data.get('subscription_id')
        
        stripe.api_key = current_app.config['STRIPE_SECRET_KEY']
        
        user_id = get_jwt_identity()
        
        if payment_intent_id:
            # One-time donation
            payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            metadata = payment_intent.metadata
            
            donation = Donation(
                user_id=user_id,
                amount=payment_intent.amount / 100,  # Convert from cents
                currency=payment_intent.currency.upper(),
                stripe_payment_intent_id=payment_intent_id,
                status='completed',
                is_recurring=False,
                donor_name=metadata.get('donor_name'),
                donor_email=metadata.get('donor_email'),
                message=metadata.get('message')
            )
            
        elif subscription_id:
            # Recurring donation
            subscription = stripe.Subscription.retrieve(subscription_id)
            metadata = subscription.metadata
            
            # Get the amount from the subscription
            amount = subscription.items.data[0].price.unit_amount / 100
            currency = subscription.items.data[0].price.currency.upper()
            interval = subscription.items.data[0].price.recurring.interval
            
            donation = Donation(
                user_id=user_id,
                amount=amount,
                currency=currency,
                status='completed',
                is_recurring=True,
                recurring_interval=interval,
                donor_name=metadata.get('donor_name'),
                donor_email=metadata.get('donor_email'),
                message=metadata.get('message')
            )
        else:
            return jsonify({'error': 'Payment intent ID or subscription ID required'}), 400
        
        db.session.add(donation)
        db.session.commit()
        
        return jsonify({
            'message': 'Donation confirmed successfully',
            'donation': donation.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to confirm donation'}), 500

@donations_bp.route('/history', methods=['GET'])
@jwt_required()
def get_donation_history():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        donations = user.donations.order_by(Donation.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'donations': [donation.to_dict() for donation in donations.items],
            'total': donations.total,
            'pages': donations.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get donation history'}), 500

@donations_bp.route('/recent', methods=['GET'])
def get_recent_donations():
    try:
        limit = request.args.get('limit', 10, type=int)
        
        # Get recent donations (only show donor names, not personal info)
        donations = Donation.query.filter_by(status='completed').order_by(
            Donation.created_at.desc()
        ).limit(limit).all()
        
        # Return sanitized donation info for public display
        recent_donations = []
        for donation in donations:
            recent_donations.append({
                'amount': donation.amount,
                'currency': donation.currency,
                'donor_name': donation.donor_name or 'Anonymous',
                'message': donation.message,
                'created_at': donation.created_at.isoformat(),
                'is_recurring': donation.is_recurring
            })
        
        return jsonify({'recent_donations': recent_donations}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get recent donations'}), 500

@donations_bp.route('/stats', methods=['GET'])
def get_donation_stats():
    try:
        # Get total donations
        total_donations = db.session.query(db.func.sum(Donation.amount)).filter_by(
            status='completed'
        ).scalar() or 0
        
        # Get total number of donors
        total_donors = db.session.query(db.func.count(db.func.distinct(
            db.case([(Donation.user_id.isnot(None), Donation.user_id)], 
                   else_=Donation.donor_email)
        ))).filter_by(status='completed').scalar() or 0
        
        # Get monthly goal (you can make this configurable)
        monthly_goal = 10000  # $10,000 monthly goal
        
        # Get current month donations
        from datetime import datetime
        current_month = datetime.now().month
        current_year = datetime.now().year
        
        monthly_total = db.session.query(db.func.sum(Donation.amount)).filter(
            Donation.status == 'completed',
            db.extract('month', Donation.created_at) == current_month,
            db.extract('year', Donation.created_at) == current_year
        ).scalar() or 0
        
        return jsonify({
            'total_donations': total_donations,
            'total_donors': total_donors,
            'monthly_goal': monthly_goal,
            'monthly_total': monthly_total,
            'monthly_progress': (monthly_total / monthly_goal) * 100 if monthly_goal > 0 else 0
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get donation stats'}), 500