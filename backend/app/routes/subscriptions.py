from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User, Subscription, SubscriptionType
import stripe
from datetime import datetime, timedelta

subscriptions_bp = Blueprint('subscriptions', __name__)

# Subscription plans configuration
SUBSCRIPTION_PLANS = {
    'basic': {
        'name': 'Basic Membership',
        'price': 9.99,
        'currency': 'usd',
        'interval': 'month',
        'features': [
            'Ad-free reading experience',
            'Access to premium articles',
            'Mobile app access',
            'Email newsletter'
        ]
    },
    'premium': {
        'name': 'Premium Membership',
        'price': 19.99,
        'currency': 'usd',
        'interval': 'month',
        'features': [
            'All Basic features',
            'Exclusive premium content',
            'Early access to breaking news',
            'Live event streaming',
            'Comment and discussion privileges',
            'Download articles for offline reading'
        ]
    },
    'lifetime': {
        'name': 'Lifetime Membership',
        'price': 299.99,
        'currency': 'usd',
        'interval': 'one_time',
        'features': [
            'All Premium features for life',
            'VIP support',
            'Exclusive member events',
            'Behind-the-scenes content',
            'Direct access to editorial team'
        ]
    }
}

@subscriptions_bp.route('/plans', methods=['GET'])
def get_subscription_plans():
    return jsonify({'plans': SUBSCRIPTION_PLANS}), 200

@subscriptions_bp.route('/current', methods=['GET'])
@jwt_required()
def get_current_subscription():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        subscription = user.subscription
        if not subscription:
            return jsonify({'subscription': None}), 200
        
        return jsonify({'subscription': subscription.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get subscription'}), 500

@subscriptions_bp.route('/create-payment-intent', methods=['POST'])
@jwt_required()
def create_payment_intent():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        plan_type = data.get('plan_type')
        
        if plan_type not in SUBSCRIPTION_PLANS:
            return jsonify({'error': 'Invalid subscription plan'}), 400
        
        stripe.api_key = current_app.config['STRIPE_SECRET_KEY']
        plan = SUBSCRIPTION_PLANS[plan_type]
        
        if plan['interval'] == 'one_time':
            # One-time payment for lifetime membership
            intent = stripe.PaymentIntent.create(
                amount=int(plan['price'] * 100),  # Convert to cents
                currency=plan['currency'],
                metadata={
                    'user_id': user_id,
                    'plan_type': plan_type,
                    'type': 'subscription'
                }
            )
        else:
            # Create recurring subscription
            price = stripe.Price.create(
                unit_amount=int(plan['price'] * 100),
                currency=plan['currency'],
                recurring={'interval': plan['interval']},
                product_data={'name': plan['name']}
            )
            
            subscription = stripe.Subscription.create(
                customer=stripe.Customer.create(
                    email=user.email,
                    name=f"{user.first_name} {user.last_name}"
                ).id,
                items=[{'price': price.id}],
                payment_behavior='default_incomplete',
                expand=['latest_invoice.payment_intent'],
                metadata={
                    'user_id': user_id,
                    'plan_type': plan_type
                }
            )
            
            return jsonify({
                'subscription_id': subscription.id,
                'client_secret': subscription.latest_invoice.payment_intent.client_secret
            }), 200
        
        return jsonify({
            'client_secret': intent.client_secret,
            'payment_intent_id': intent.id
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to create payment intent'}), 500

@subscriptions_bp.route('/confirm-payment', methods=['POST'])
@jwt_required()
def confirm_payment():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        payment_intent_id = data.get('payment_intent_id')
        subscription_id = data.get('subscription_id')
        plan_type = data.get('plan_type')
        
        stripe.api_key = current_app.config['STRIPE_SECRET_KEY']
        
        # Update user subscription in database
        subscription = user.subscription
        if not subscription:
            subscription = Subscription(user_id=user_id)
            db.session.add(subscription)
        
        subscription.subscription_type = SubscriptionType(plan_type.upper())
        subscription.status = 'active'
        
        if subscription_id:
            subscription.stripe_subscription_id = subscription_id
            stripe_sub = stripe.Subscription.retrieve(subscription_id)
            subscription.current_period_start = datetime.fromtimestamp(stripe_sub.current_period_start)
            subscription.current_period_end = datetime.fromtimestamp(stripe_sub.current_period_end)
        else:
            # Lifetime subscription
            subscription.current_period_start = datetime.utcnow()
            subscription.current_period_end = None  # No expiry for lifetime
        
        subscription.updated_at = datetime.utcnow()
        
        # Update user role based on subscription
        if plan_type in ['basic', 'premium', 'lifetime']:
            user.role = UserRole.PREMIUM
        
        db.session.commit()
        
        return jsonify({
            'message': 'Subscription activated successfully',
            'subscription': subscription.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to confirm payment'}), 500

@subscriptions_bp.route('/cancel', methods=['POST'])
@jwt_required()
def cancel_subscription():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.subscription:
            return jsonify({'error': 'No active subscription found'}), 404
        
        subscription = user.subscription
        
        if subscription.stripe_subscription_id:
            stripe.api_key = current_app.config['STRIPE_SECRET_KEY']
            stripe.Subscription.delete(subscription.stripe_subscription_id)
        
        subscription.status = 'canceled'
        subscription.updated_at = datetime.utcnow()
        
        # Downgrade user role
        user.role = UserRole.USER
        
        db.session.commit()
        
        return jsonify({'message': 'Subscription canceled successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to cancel subscription'}), 500

@subscriptions_bp.route('/webhook', methods=['POST'])
def stripe_webhook():
    try:
        payload = request.get_data()
        sig_header = request.headers.get('Stripe-Signature')
        
        stripe.api_key = current_app.config['STRIPE_SECRET_KEY']
        endpoint_secret = current_app.config.get('STRIPE_WEBHOOK_SECRET')
        
        if endpoint_secret:
            event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
        else:
            event = stripe.Event.construct_from(request.get_json(), stripe.api_key)
        
        # Handle subscription events
        if event['type'] == 'invoice.payment_succeeded':
            subscription_id = event['data']['object']['subscription']
            if subscription_id:
                subscription = Subscription.query.filter_by(
                    stripe_subscription_id=subscription_id
                ).first()
                if subscription:
                    subscription.status = 'active'
                    db.session.commit()
        
        elif event['type'] == 'invoice.payment_failed':
            subscription_id = event['data']['object']['subscription']
            if subscription_id:
                subscription = Subscription.query.filter_by(
                    stripe_subscription_id=subscription_id
                ).first()
                if subscription:
                    subscription.status = 'past_due'
                    db.session.commit()
        
        return jsonify({'status': 'success'}), 200
        
    except Exception as e:
        return jsonify({'error': 'Webhook failed'}), 400