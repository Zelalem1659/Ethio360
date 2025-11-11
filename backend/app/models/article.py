from app import db
from datetime import datetime
from enum import Enum

class ArticleStatus(Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"

class ArticleCategory(Enum):
    POLITICS = "politics"
    BUSINESS = "business"
    TECHNOLOGY = "technology"
    SPORTS = "sports"
    ENTERTAINMENT = "entertainment"
    HEALTH = "health"
    EDUCATION = "education"
    CULTURE = "culture"
    INTERNATIONAL = "international"
    LOCAL = "local"

class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(250), unique=True, nullable=False)
    content = db.Column(db.Text, nullable=False)
    excerpt = db.Column(db.Text)
    featured_image = db.Column(db.String(255))
    category = db.Column(db.Enum(ArticleCategory), nullable=False)
    status = db.Column(db.Enum(ArticleStatus), default=ArticleStatus.DRAFT)
    is_featured = db.Column(db.Boolean, default=False)
    is_breaking = db.Column(db.Boolean, default=False)
    is_premium = db.Column(db.Boolean, default=False)  # Premium content for subscribers
    
    # SEO fields
    meta_title = db.Column(db.String(200))
    meta_description = db.Column(db.String(300))
    tags = db.Column(db.String(500))  # Comma-separated tags
    
    # Author and timestamps
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    published_at = db.Column(db.DateTime)
    
    # Analytics
    view_count = db.Column(db.Integer, default=0)
    like_count = db.Column(db.Integer, default=0)
    share_count = db.Column(db.Integer, default=0)
    
    def to_dict(self, include_content=False):
        data = {
            'id': self.id,
            'title': self.title,
            'slug': self.slug,
            'excerpt': self.excerpt,
            'featured_image': self.featured_image,
            'category': self.category.value,
            'status': self.status.value,
            'is_featured': self.is_featured,
            'is_breaking': self.is_breaking,
            'is_premium': self.is_premium,
            'meta_title': self.meta_title,
            'meta_description': self.meta_description,
            'tags': self.tags.split(',') if self.tags else [],
            'author': {
                'id': self.author.id,
                'name': f"{self.author.first_name} {self.author.last_name}",
                'username': self.author.username,
                'avatar_url': self.author.avatar_url
            },
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'published_at': self.published_at.isoformat() if self.published_at else None,
            'view_count': self.view_count,
            'like_count': self.like_count,
            'share_count': self.share_count
        }
        
        if include_content:
            data['content'] = self.content
            
        return data

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    article_id = db.Column(db.Integer, db.ForeignKey('article.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('comment.id'))  # For replies
    is_approved = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    article = db.relationship('Article', backref='comments')
    user = db.relationship('User', backref='comments')
    replies = db.relationship('Comment', backref=db.backref('parent', remote_side=[id]))
    
    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'user': {
                'id': self.user.id,
                'name': f"{self.user.first_name} {self.user.last_name}",
                'avatar_url': self.user.avatar_url
            },
            'created_at': self.created_at.isoformat(),
            'replies_count': len(self.replies)
        }