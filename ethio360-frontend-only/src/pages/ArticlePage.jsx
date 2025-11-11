import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ArticlePage = () => {
  const { slug } = useParams();
  const { canAccessPremium } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/articles`);
        const data = await response.json();
        
        // Find the article by slug
        const foundArticle = data.articles.find(article => article.slug === slug);
        
        if (foundArticle) {
          setArticle(foundArticle);
        } else {
          setError('Article not found');
        }
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Ethiopian Flag Color Watermark Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br from-green-400 via-green-300 to-green-200"></div>
          <div className="absolute top-1/3 left-0 w-full h-1/3 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-br from-red-400 via-red-300 to-red-200"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Ethiopian Flag Color Watermark Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br from-green-400 via-green-300 to-green-200"></div>
          <div className="absolute top-1/3 left-0 w-full h-1/3 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-br from-red-400 via-red-300 to-red-200"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <Link 
              to="/" 
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Ethiopian Flag Color Watermark Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br from-green-400 via-green-300 to-green-200"></div>
          <div className="absolute top-1/3 left-0 w-full h-1/3 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-br from-red-400 via-red-300 to-red-200"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
            <Link 
              to="/" 
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check if user can access premium content
  if (article.is_premium && !canAccessPremium()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Article header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Link to={`/category/${article.category}`} className="hover:text-green-600">
                {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
              </Link>
              <span>•</span>
              <span>{new Date(article.published_at).toLocaleDateString()}</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>
            <p className="text-xl text-gray-600 mb-6">{article.excerpt}</p>
            
            {/* Author info */}
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={article.author.avatar_url} 
                alt={article.author.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-900">{article.author.name}</p>
                <p className="text-sm text-gray-500">@{article.author.username}</p>
              </div>
            </div>
          </div>

          {/* Premium content message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Content</h3>
            <p className="text-gray-600 mb-4">
              This article is available to premium subscribers only. Subscribe to access exclusive Ethiopian news and analysis.
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                to="/subscription" 
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Subscribe Now
              </Link>
              <Link 
                to="/login" 
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Ethiopian Flag Color Watermark Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br from-green-400 via-green-300 to-green-200"></div>
        <div className="absolute top-1/3 left-0 w-full h-1/3 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-br from-red-400 via-red-300 to-red-200"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-green-600">Home</Link>
          <span>›</span>
          <Link to={`/category/${article.category}`} className="hover:text-green-600">
            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
          </Link>
          <span>›</span>
          <span className="text-gray-700">{article.title}</span>
        </div>

        {/* Article header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link to={`/category/${article.category}`} className="hover:text-green-600">
              {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
            </Link>
            <span>•</span>
            <span>{new Date(article.published_at).toLocaleDateString()}</span>
            {article.is_breaking && (
              <>
                <span>•</span>
                <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                  BREAKING
                </span>
              </>
            )}
            {article.is_premium && (
              <>
                <span>•</span>
                <span className="bg-yellow-600 text-white px-2 py-1 rounded text-xs font-semibold">
                  PREMIUM
                </span>
              </>
            )}
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">{article.excerpt}</p>
          
          {/* Author info */}
          <div className="flex items-center gap-3 mb-6">
            <img 
              src={article.author.avatar_url} 
              alt={article.author.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-900">{article.author.name}</p>
              <p className="text-sm text-gray-500">@{article.author.username}</p>
            </div>
          </div>

          {/* Article stats */}
          <div className="flex items-center gap-6 text-sm text-gray-500 pb-6 border-b">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {article.view_count.toLocaleString()} views
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {article.like_count.toLocaleString()} likes
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              {article.share_count.toLocaleString()} shares
            </span>
          </div>
        </div>

        {/* Featured image */}
        {article.featured_image && (
          <div className="mb-8">
            <img 
              src={article.featured_image} 
              alt={article.title}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Article content */}
        <div className="prose prose-lg max-w-none mb-8">
          <div 
            className="text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share buttons */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Share this article</h3>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
              Twitter
            </button>
            <button className="flex items-center gap-2 bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
            <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              WhatsApp
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;