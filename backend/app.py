import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
from sample_data import SAMPLE_ARTICLES, BREAKING_NEWS, FEATURED_ARTICLES, BREAKING_NEWS_TICKER

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-change-in-production')
    
    # Enable CORS for frontend
    CORS(app, origins=['http://localhost:3000', 'http://localhost:3001'])
    
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
    
    return app

if __name__ == '__main__':
    app = create_app()
    print("🚀 Starting Ethio 360 Backend Server...")
    print("📰 Sample Ethiopian news data loaded!")
    print("🌐 API available at: http://localhost:5000")
    print("🔗 Frontend should connect from: http://localhost:3000")
    app.run(debug=True, host='0.0.0.0', port=5000)