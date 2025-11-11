from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from datetime import datetime

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/dashboard/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in ['admin', 'editor']:
            return jsonify({'error': 'Access denied'}), 403
        
        # Basic stats - you can expand this
        stats = {
            'total_users': User.query.count(),
            'total_articles': 0,  # Will be implemented when Article model is available
            'total_subscriptions': 0,
            'total_donations': 0
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch dashboard stats'}), 500