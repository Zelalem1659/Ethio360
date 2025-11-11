from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.article import Article, ArticleCategory, ArticleStatus, Comment
from app.models.user import User
from datetime import datetime
from sqlalchemy import or_, desc

articles_bp = Blueprint('articles', __name__)

@articles_bp.route('/', methods=['GET'])
def get_articles():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        category = request.args.get('category')
        search = request.args.get('search')
        
        query = Article.query.filter_by(status=ArticleStatus.PUBLISHED)
        
        if category:
            try:
                category_enum = ArticleCategory(category.lower())
                query = query.filter_by(category=category_enum)
            except ValueError:
                return jsonify({'error': 'Invalid category'}), 400
        
        if search:
            query = query.filter(
                or_(
                    Article.title.contains(search),
                    Article.content.contains(search),
                    Article.excerpt.contains(search)
                )
            )
        
        query = query.order_by(desc(Article.published_at))
        
        articles = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'articles': [article.to_dict() for article in articles.items],
            'total': articles.total,
            'pages': articles.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch articles'}), 500

@articles_bp.route('/featured', methods=['GET'])
def get_featured_articles():
    try:
        articles = Article.query.filter_by(
            status=ArticleStatus.PUBLISHED,
            is_featured=True
        ).order_by(desc(Article.published_at)).limit(5).all()
        
        return jsonify([article.to_dict() for article in articles]), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch featured articles'}), 500

@articles_bp.route('/breaking', methods=['GET'])
def get_breaking_news():
    try:
        articles = Article.query.filter_by(
            status=ArticleStatus.PUBLISHED,
            is_breaking=True
        ).order_by(desc(Article.published_at)).limit(3).all()
        
        return jsonify([article.to_dict() for article in articles]), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch breaking news'}), 500

@articles_bp.route('/<slug>', methods=['GET'])
def get_article(slug):
    try:
        article = Article.query.filter_by(slug=slug, status=ArticleStatus.PUBLISHED).first()
        
        if not article:
            return jsonify({'error': 'Article not found'}), 404
        
        # Increment view count
        article.view_count = (article.view_count or 0) + 1
        db.session.commit()
        
        return jsonify(article.to_dict(include_content=True)), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch article'}), 500

@articles_bp.route('/category/<category>', methods=['GET'])
def get_articles_by_category(category):
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        try:
            category_enum = ArticleCategory(category.lower())
        except ValueError:
            return jsonify({'error': 'Invalid category'}), 400
        
        articles = Article.query.filter_by(
            status=ArticleStatus.PUBLISHED,
            category=category_enum
        ).order_by(desc(Article.published_at)).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'articles': [article.to_dict() for article in articles.items],
            'total': articles.total,
            'pages': articles.pages,
            'current_page': page,
            'category': category
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch articles'}), 500