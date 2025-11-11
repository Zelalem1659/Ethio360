import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, Eye, Heart, Share2, Lock, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const FeaturedArticle = ({ article }) => {
  const { canAccessPremium } = useAuth();
  
  if (!article) return null;
  
  const isAccessible = !article.is_premium || canAccessPremium();
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
        {/* Image Section */}
        <div className="relative">
          <img
            src={article.featured_image || '/placeholder-news.jpg'}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/placeholder-news.jpg';
            }}
          />
          
          {/* Overlay badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {article.is_breaking && (
              <span className="breaking-badge text-sm px-3 py-1">
                🔴 BREAKING NEWS
              </span>
            )}
            {article.is_featured && (
              <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                ⭐ FEATURED
              </span>
            )}
            {article.is_premium && (
              <span className="premium-badge flex items-center space-x-1 text-sm px-3 py-1">
                <Lock size={14} />
                <span>PREMIUM</span>
              </span>
            )}
          </div>

          {/* Category badge */}
          <div className="absolute top-4 right-4">
            <span className="bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
              {article.category.toUpperCase()}
            </span>
          </div>

          {/* Premium overlay */}
          {article.is_premium && !canAccessPremium() && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <div className="text-center text-white p-6">
                <Lock size={48} className="mx-auto mb-4 opacity-80" />
                <h3 className="text-xl font-bold mb-2">Premium Content</h3>
                <p className="text-sm opacity-90 mb-4">
                  Upgrade to premium to access this exclusive article
                </p>
                <Link 
                  to="/subscription"
                  className="bg-white text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Upgrade Now
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-8 flex flex-col justify-center">
          <div className="space-y-6">
            {/* Meta Information */}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <User size={16} />
                <span className="font-medium">{article.author?.name || 'Ethio360 Staff'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>{formatDate(article.published_at || article.created_at)}</span>
              </div>
            </div>

            {/* Title */}
            <Link 
              to={isAccessible ? `/article/${article.slug}` : '/subscription'}
              className="block"
            >
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight hover:text-red-600 transition-colors">
                {article.title}
              </h1>
            </Link>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-lg text-gray-600 leading-relaxed">
                {article.excerpt}
              </p>
            )}

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.tags.slice(0, 4).map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Stats and CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Eye size={16} />
                  <span>{article.view_count || 0} views</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart size={16} />
                  <span>{article.like_count || 0} likes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Share2 size={16} />
                  <span>{article.share_count || 0} shares</span>
                </div>
              </div>

              <Link
                to={isAccessible ? `/article/${article.slug}` : '/subscription'}
                className="btn-primary"
              >
                {isAccessible ? 'Read Full Article' : 'Upgrade to Read'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedArticle;