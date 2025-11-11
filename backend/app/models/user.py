from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from enum import Enum

class UserRole(Enum):
    USER = "user"
    PREMIUM = "premium"
    ADMIN = "admin"
    EDITOR = "editor"

class SubscriptionType(Enum):
    FREE = "free"
    BASIC = "basic"
    PREMIUM = "premium"
    LIFETIME = "lifetime"

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum(UserRole), default=UserRole.USER)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # Profile information
    bio = db.Column(db.Text)
    avatar_url = db.Column(db.String(255))
    phone = db.Column(db.String(20))
    location = db.Column(db.String(100))
    
    # Relationships
    subscription = db.relationship('Subscription', backref='user', uselist=False)
    donations = db.relationship('Donation', backref='user', lazy='dynamic')
    articles = db.relationship('Article', backref='author', lazy='dynamic')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'role': self.role.value,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'bio': self.bio,
            'avatar_url': self.avatar_url,
            'phone': self.phone,
            'location': self.location
        }

class Subscription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    subscription_type = db.Column(db.Enum(SubscriptionType), nullable=False)
    stripe_subscription_id = db.Column(db.String(100))
    status = db.Column(db.String(20), default='active')  # active, canceled, past_due
    current_period_start = db.Column(db.DateTime, default=datetime.utcnow)
    current_period_end = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def is_active(self):
        return self.status == 'active' and (
            self.current_period_end is None or 
            self.current_period_end > datetime.utcnow()
        )
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'subscription_type': self.subscription_type.value,
            'status': self.status,
            'current_period_start': self.current_period_start.isoformat(),
            'current_period_end': self.current_period_end.isoformat() if self.current_period_end else None,
            'is_active': self.is_active()
        }

class Donation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)  # Anonymous donations allowed
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), default='USD')
    stripe_payment_intent_id = db.Column(db.String(100))
    status = db.Column(db.String(20), default='pending')  # pending, completed, failed
    is_recurring = db.Column(db.Boolean, default=False)
    recurring_interval = db.Column(db.String(10))  # monthly, yearly
    donor_name = db.Column(db.String(100))  # For anonymous donations
    donor_email = db.Column(db.String(120))  # For anonymous donations
    message = db.Column(db.Text)  # Optional message from donor
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'amount': self.amount,
            'currency': self.currency,
            'status': self.status,
            'is_recurring': self.is_recurring,
            'donor_name': self.donor_name or (self.user.first_name + ' ' + self.user.last_name if self.user else 'Anonymous'),
            'message': self.message,
            'created_at': self.created_at.isoformat()
        }