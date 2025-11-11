import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, Eye, Heart, Share2, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ArticleCard = ({ article, size = 'default' }) => {
  const { canAccessPremium } = useAuth();
  
  const isAccessible = !article.is_premium || canAccessPremium();
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const cardClasses = {
    default: 'article-card h-full',
    large: 'article-card h-96',
    small: 'article-card h-64'
  };

  const imageClasses = {
    default: 'w-full h-48 object-cover',
    large: 'w-full h-64 object-cover',
    small: 'w-full h-32 object-cover'
  };

  return (
    <div className={cardClasses[size]}>
      {/* Article Image */}
      <div className="relative">
        <img
          src={article.featured_image || '/placeholder-news.jpg'}
          alt={article.title}
          className={imageClasses[size]}
          onError={(e) => {
            e.target.src = '/placeholder-news.jpg';
          }}
        />
        
        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {article.is_breaking && (
            <span className="breaking-badge">
              BREAKING
            </span>
          )}
          {article.is_premium && (
            <span className="premium-badge flex items-center space-x-1">
              <Lock size={12} />
              <span>PREMIUM</span>
            </span>
          )}
        </div>

        {/* Category badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
            {article.category.toUpperCase()}
          </span>
        </div>

        {/* Premium overlay */}
        {article.is_premium && !canAccessPremium() && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <Lock size={32} className="mx-auto mb-2 opacity-80" />
              <p className="text-sm font-medium">Premium Content</p>
            </div>
          </div>
        )}
      </div>

      {/* Article Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <Link 
          to={isAccessible ? `/article/${article.slug}` : '/subscription'}
          className="block mb-2"
        >
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-red-600 transition-colors leading-tight">
            {article.title}
          </h3>
        </Link>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-gray-600 text-sm line-clamp-3 mb-3 flex-1">
            {article.excerpt}
          </p>
        )}

        {/* Author and Date */}
        <div className="flex items-center space-x-3 text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <User size={12} />
            <span>{article.author?.name || 'Ethio360 Staff'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={12} />
            <span>{formatDate(article.published_at || article.created_at)}</span>
          </div>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
              >
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Stats and Actions */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye size={12} />
              <span>{article.view_count || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart size={12} />
              <span>{article.like_count || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Share2 size={12} />
              <span>{article.share_count || 0}</span>
            </div>
          </div>

          {/* Read More Link */}
          <Link
            to={isAccessible ? `/article/${article.slug}` : '/subscription'}
            className="text-red-600 hover:text-red-700 text-xs font-medium transition-colors"
          >
            {isAccessible ? 'Read More' : 'Upgrade to Read'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;