import os
import re
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
from sample_data import SAMPLE_ARTICLES, BREAKING_NEWS, FEATURED_ARTICLES, BREAKING_NEWS_TICKER, BLOGGER_POSTS

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-change-in-production')
    
    # Enable CORS for frontend
    allowed_origins = [
        'http://localhost:3000', 
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
        'http://localhost:3004',
        'http://localhost:3005',
        'http://localhost:3006',
        'http://localhost:3007',
        'http://localhost:3008',
        'http://localhost:3009',
        'http://localhost:3010',
        'http://localhost:3011',
        'http://localhost:3012',
        'http://localhost:3013',
        'http://localhost:3014',
        'https://ethio360.vercel.app',
        'https://ethio360-*.vercel.app'  # Allow Vercel preview deployments
    ]
    CORS(app, origins=allowed_origins)
    
    @app.route('/')
    def index():
        return jsonify({
            'message': 'Welcome to Ethio 360 API',
            'version': '1.0.0',
            'status': 'running'
        })
    
    @app.route('/api/articles')
    def get_articles():
        """Get all articles with optional filtering"""
        category = request.args.get('category')
        is_featured = request.args.get('featured')
        is_breaking = request.args.get('breaking')
        
        articles = SAMPLE_ARTICLES.copy()
        
        # Filter by category
        if category:
            articles = [a for a in articles if a['category'] == category]
        
        # Filter by featured
        if is_featured:
            articles = [a for a in articles if a['is_featured'] == (is_featured.lower() == 'true')]
        
        # Filter by breaking
        if is_breaking:
            articles = [a for a in articles if a['is_breaking'] == (is_breaking.lower() == 'true')]
        
        return jsonify({
            'articles': articles,
            'total': len(articles)
        })
    
    @app.route('/api/articles/<int:article_id>')
    def get_article(article_id):
        """Get a specific article by ID"""
        article = next((a for a in SAMPLE_ARTICLES if a['id'] == article_id), None)
        if not article:
            return jsonify({'error': 'Article not found'}), 404
        return jsonify(article)
    
    @app.route('/api/articles/slug/<slug>')
    def get_article_by_slug(slug):
        """Get a specific article by slug"""
        article = next((a for a in SAMPLE_ARTICLES if a['slug'] == slug), None)
        if not article:
            return jsonify({'error': 'Article not found'}), 404
        return jsonify(article)
    
    @app.route('/api/breaking-news')
    def get_breaking_news():
        """Get breaking news items"""
        breaking_articles = [a for a in SAMPLE_ARTICLES if a['is_breaking']]
        return jsonify({
            'breaking_news': breaking_articles,
            'total': len(breaking_articles)
        })
    
    @app.route('/api/featured-articles')
    def get_featured_articles():
        """Get featured articles"""
        featured_articles = [a for a in SAMPLE_ARTICLES if a['is_featured']]
        return jsonify({
            'featured_articles': featured_articles,
            'total': len(featured_articles)
        })
    
    @app.route('/api/categories')
    def get_categories():
        """Get all available categories"""
        categories = list(set(a['category'] for a in SAMPLE_ARTICLES))
        return jsonify({
            'categories': categories
        })
    
    @app.route('/api/search')
    def search_articles():
        """Search articles by title or content"""
        query = request.args.get('q', '').lower()
        if not query:
            return jsonify({'articles': [], 'total': 0})
        
        matching_articles = []
        for article in SAMPLE_ARTICLES:
            if (query in article['title'].lower() or 
                query in article['excerpt'].lower() or
                query in article['content'].lower()):
                matching_articles.append(article)
        
        return jsonify({
            'articles': matching_articles,
            'total': len(matching_articles),
            'query': query
        })
    
    @app.route('/api/stats')
    def get_stats():
        """Get basic site statistics"""
        total_articles = len(SAMPLE_ARTICLES)
        total_views = sum(a['view_count'] for a in SAMPLE_ARTICLES)
        categories = len(set(a['category'] for a in SAMPLE_ARTICLES))
        
        return jsonify({
            'total_articles': total_articles,
            'total_views': total_views,
            'total_categories': categories,
            'breaking_news_count': len([a for a in SAMPLE_ARTICLES if a['is_breaking']]),
            'featured_articles_count': len([a for a in SAMPLE_ARTICLES if a['is_featured']])
        })
    
    # Breaking News Ticker Management Routes
    @app.route('/api/breaking-news-ticker', methods=['GET'])
    def get_breaking_news_ticker():
        """Get active breaking news ticker messages"""
        active_messages = [msg for msg in BREAKING_NEWS_TICKER if msg['is_active']]
        # Sort by priority (lower number = higher priority)
        active_messages.sort(key=lambda x: x['priority'])
        return jsonify({
            'messages': active_messages,
            'total': len(active_messages)
        })
    
    @app.route('/api/breaking-news-ticker', methods=['POST'])
    def create_breaking_news_ticker():
        """Create a new breaking news ticker message"""
        data = request.get_json()
        
        if not data or not data.get('message'):
            return jsonify({'error': 'Message is required'}), 400
        
        # Generate new ID
        new_id = max([msg['id'] for msg in BREAKING_NEWS_TICKER], default=0) + 1
        
        new_message = {
            'id': new_id,
            'message': data['message'],
            'created_at': datetime.utcnow().isoformat() + 'Z',
            'is_active': data.get('is_active', True),
            'priority': data.get('priority', 1)
        }
        
        BREAKING_NEWS_TICKER.append(new_message)
        
        return jsonify({
            'message': 'Breaking news ticker created successfully',
            'data': new_message
        }), 201
    
    @app.route('/api/breaking-news-ticker/<int:ticker_id>', methods=['PUT'])
    def update_breaking_news_ticker(ticker_id):
        """Update an existing breaking news ticker message"""
        data = request.get_json()
        
        # Find the message
        message = next((msg for msg in BREAKING_NEWS_TICKER if msg['id'] == ticker_id), None)
        if not message:
            return jsonify({'error': 'Breaking news ticker not found'}), 404
        
        # Update fields
        if 'message' in data:
            message['message'] = data['message']
        if 'is_active' in data:
            message['is_active'] = data['is_active']
        if 'priority' in data:
            message['priority'] = data['priority']
        
        return jsonify({
            'message': 'Breaking news ticker updated successfully',
            'data': message
        })
    
    @app.route('/api/breaking-news-ticker/<int:ticker_id>', methods=['DELETE'])
    def delete_breaking_news_ticker(ticker_id):
        """Delete a breaking news ticker message"""
        global BREAKING_NEWS_TICKER
        
        # Find the message
        message = next((msg for msg in BREAKING_NEWS_TICKER if msg['id'] == ticker_id), None)
        if not message:
            return jsonify({'error': 'Breaking news ticker not found'}), 404
        
        # Remove the message
        BREAKING_NEWS_TICKER = [msg for msg in BREAKING_NEWS_TICKER if msg['id'] != ticker_id]
        
        return jsonify({
            'message': 'Breaking news ticker deleted successfully'
        })
    
    @app.route('/api/admin/breaking-news-ticker', methods=['GET'])
    def admin_get_all_breaking_news_ticker():
        """Get all breaking news ticker messages (including inactive ones) for admin"""
        all_messages = sorted(BREAKING_NEWS_TICKER, key=lambda x: x['priority'])
        return jsonify({
            'messages': all_messages,
            'total': len(all_messages)
        })
    
    # Blogger Posts API Endpoints
    @app.route('/api/bloggers', methods=['GET'])
    def get_blogger_posts():
        """Get all published blogger posts"""
        published_posts = [post for post in BLOGGER_POSTS if post['is_published']]
        # Sort by published date (newest first)
        published_posts.sort(key=lambda x: x['published_at'], reverse=True)
        
        return jsonify({
            'posts': published_posts,
            'total': len(published_posts)
        })
    
    @app.route('/api/bloggers/<slug>', methods=['GET'])
    def get_blogger_post(slug):
        """Get a specific blogger post by slug"""
        post = next((post for post in BLOGGER_POSTS if post['slug'] == slug and post['is_published']), None)
        if not post:
            return jsonify({'error': 'Blogger post not found'}), 404
        
        # Increment view count (in a real app, you'd want to track unique views)
        post['views'] += 1
        
        return jsonify(post)
    
    @app.route('/api/admin/bloggers', methods=['GET'])
    def admin_get_all_blogger_posts():
        """Get all blogger posts (including unpublished ones) for admin"""
        all_posts = sorted(BLOGGER_POSTS, key=lambda x: x['updated_at'], reverse=True)
        return jsonify({
            'posts': all_posts,
            'total': len(all_posts)
        })
    
    @app.route('/api/admin/bloggers', methods=['POST'])
    def admin_create_blogger_post():
        """Create a new blogger post"""
        data = request.get_json()
        
        if not data or not data.get('title') or not data.get('content'):
            return jsonify({'error': 'Title and content are required'}), 400
        
        # Generate slug from title (simple version)
        import re
        slug = re.sub(r'[^a-zA-Z0-9\s-]', '', data['title'].lower())
        slug = re.sub(r'\s+', '-', slug.strip())
        
        # Check if slug already exists
        existing_post = next((post for post in BLOGGER_POSTS if post['slug'] == slug), None)
        if existing_post:
            slug = f"{slug}-{len(BLOGGER_POSTS) + 1}"
        
        # Get next ID
        next_id = max([post['id'] for post in BLOGGER_POSTS], default=0) + 1
        
        from datetime import datetime
        current_time = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
        
        new_post = {
            'id': next_id,
            'title': data['title'],
            'slug': slug,
            'excerpt': data.get('excerpt', ''),
            'content': data['content'],
            'image': data.get('image', ''),
            'author': {
                'id': 1,
                'name': "Admin",
                'username': "admin",
                'bio': "Ethio360 Administrator",
                'avatar_url': "/avatars/admin.jpg"
            },
            'category': data.get('category', 'general'),
            'tags': data.get('tags', []),
            'published_at': current_time if data.get('is_published', False) else None,
            'updated_at': current_time,
            'is_published': data.get('is_published', False),
            'views': 0,
            'likes': 0,
            'comments_count': 0
        }
        
        BLOGGER_POSTS.append(new_post)
        
        return jsonify({
            'message': 'Blogger post created successfully',
            'post': new_post
        }), 201
    
    @app.route('/api/admin/bloggers/<int:post_id>', methods=['PUT'])
    def admin_update_blogger_post(post_id):
        """Update an existing blogger post"""
        data = request.get_json()
        
        # Find the post
        post = next((post for post in BLOGGER_POSTS if post['id'] == post_id), None)
        if not post:
            return jsonify({'error': 'Blogger post not found'}), 404
        
        from datetime import datetime
        current_time = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
        
        # Update fields
        if 'title' in data:
            post['title'] = data['title']
        if 'excerpt' in data:
            post['excerpt'] = data['excerpt']
        if 'content' in data:
            post['content'] = data['content']
        if 'image' in data:
            post['image'] = data['image']
        if 'category' in data:
            post['category'] = data['category']
        if 'tags' in data:
            post['tags'] = data['tags']
        if 'is_published' in data:
            post['is_published'] = data['is_published']
            if data['is_published'] and not post['published_at']:
                post['published_at'] = current_time
        
        post['updated_at'] = current_time
        
        return jsonify({
            'message': 'Blogger post updated successfully',
            'post': post
        })
    
    @app.route('/api/admin/bloggers/<int:post_id>', methods=['DELETE'])
    def admin_delete_blogger_post(post_id):
        """Delete a blogger post"""
        global BLOGGER_POSTS
        
        # Find the post
        post = next((post for post in BLOGGER_POSTS if post['id'] == post_id), None)
        if not post:
            return jsonify({'error': 'Blogger post not found'}), 404
        
        # Remove the post
        BLOGGER_POSTS = [post for post in BLOGGER_POSTS if post['id'] != post_id]
        
        return jsonify({
            'message': 'Blogger post deleted successfully'
        })

    # ==================== DONATION ENDPOINTS ====================
    
    @app.route('/api/donation/stripe', methods=['POST'])
    def process_stripe_donation():
        """Process donation via Stripe (Credit/Debit Card)"""
        try:
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['amount', 'cardNumber', 'expiryDate', 'cvv']
            for field in required_fields:
                if field not in data:
                    return jsonify({'error': f'Missing required field: {field}'}), 400
            
            amount = float(data['amount'])
            if amount < 1:
                return jsonify({'error': 'Minimum donation amount is $1'}), 400
            
            # In production, you would integrate with Stripe API here
            # For now, we'll simulate a successful payment
            
            # Simulated Stripe integration
            # import stripe
            # stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')
            # 
            # payment_intent = stripe.PaymentIntent.create(
            #     amount=int(amount * 100),  # Convert to cents
            #     currency='usd',
            #     payment_method_types=['card'],
            #     description=f"Donation to Ethio360 - {data.get('message', '')}"
            # )
            
            # Simulate successful payment
            transaction_id = f"txn_{datetime.now().strftime('%Y%m%d%H%M%S')}"
            
            # Log donation (in production, save to database)
            donation_record = {
                'transaction_id': transaction_id,
                'amount': amount,
                'currency': 'usd',
                'payment_method': 'stripe',
                'recurring': data.get('recurring', False),
                'donor_name': data.get('fullName', 'Anonymous'),
                'donor_email': data.get('email'),
                'message': data.get('message'),
                'timestamp': datetime.now().isoformat(),
                'status': 'completed'
            }
            
            print(f"💰 Donation received: ${amount} from {donation_record['donor_name']}")
            
            return jsonify({
                'success': True,
                'transaction_id': transaction_id,
                'amount': amount,
                'message': 'Thank you for your generous donation!'
            }), 200
            
        except ValueError as e:
            return jsonify({'error': 'Invalid amount format'}), 400
        except Exception as e:
            print(f"Stripe donation error: {str(e)}")
            return jsonify({'error': 'Payment processing failed. Please try again.'}), 500
    
    @app.route('/api/donation/paypal', methods=['POST'])
    def process_paypal_donation():
        """Initialize PayPal donation"""
        try:
            data = request.get_json()
            
            # Validate required fields
            if 'amount' not in data:
                return jsonify({'error': 'Missing required field: amount'}), 400
            
            amount = float(data['amount'])
            if amount < 1:
                return jsonify({'error': 'Minimum donation amount is $1'}), 400
            
            # In production, you would integrate with PayPal API here
            # For now, we'll simulate the PayPal flow
            
            # Simulated PayPal integration
            # from paypalrestsdk import Payment
            # 
            # payment = Payment({
            #     "intent": "sale",
            #     "payer": {"payment_method": "paypal"},
            #     "redirect_urls": {
            #         "return_url": "http://localhost:3000/donation/success",
            #         "cancel_url": "http://localhost:3000/donation/cancel"
            #     },
            #     "transactions": [{
            #         "amount": {
            #             "total": str(amount),
            #             "currency": "USD"
            #         },
            #         "description": f"Donation to Ethio360"
            #     }]
            # })
            # 
            # if payment.create():
            #     for link in payment.links:
            #         if link.rel == "approval_url":
            #             approval_url = link.href
            
            # Simulate PayPal approval URL
            transaction_id = f"pp_{datetime.now().strftime('%Y%m%d%H%M%S')}"
            approval_url = f"https://www.sandbox.paypal.com/checkoutnow?token={transaction_id}"
            
            # Log donation intent (in production, save to database)
            donation_record = {
                'transaction_id': transaction_id,
                'amount': amount,
                'currency': 'usd',
                'payment_method': 'paypal',
                'recurring': data.get('recurring', False),
                'donor_name': data.get('fullName', 'Anonymous'),
                'donor_email': data.get('email'),
                'message': data.get('message'),
                'timestamp': datetime.now().isoformat(),
                'status': 'pending'
            }
            
            print(f"💰 PayPal donation initialized: ${amount} from {donation_record['donor_name']}")
            
            return jsonify({
                'success': True,
                'transaction_id': transaction_id,
                'approvalUrl': approval_url,
                'amount': amount
            }), 200
            
        except ValueError as e:
            return jsonify({'error': 'Invalid amount format'}), 400
        except Exception as e:
            print(f"PayPal donation error: {str(e)}")
            return jsonify({'error': 'Payment initialization failed. Please try again.'}), 500
    
    @app.route('/api/donation/verify/<transaction_id>', methods=['GET'])
    def verify_donation(transaction_id):
        """Verify donation status (useful for PayPal callback)"""
        try:
            # In production, query database for transaction status
            # For now, return success for demo
            return jsonify({
                'success': True,
                'transaction_id': transaction_id,
                'status': 'completed',
                'message': 'Donation verified successfully'
            }), 200
        except Exception as e:
            print(f"Donation verification error: {str(e)}")
            return jsonify({'error': 'Verification failed'}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    print("🚀 Starting Ethio 360 Backend Server...")
    print("📰 Sample Ethiopian news data loaded!")
    port = int(os.environ.get('PORT', 5000))
    print(f"🌐 API available at: http://localhost:{port}")
    print("🔗 Frontend should connect from: http://localhost:3000")
    app.run(debug=False, host='0.0.0.0', port=port)