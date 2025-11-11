import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/articles');
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleArticleClick = (article) => {
    navigate(`/article/${article.id}`, { state: { article } });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error: {error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Hero Section with slide-down animation */}
        <div className="bg-gradient-to-r from-blue-600 via-gray-600 to-blue-700 text-white animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-slide-down">Ethio 360</h1>
              <p className="text-xl md:text-2xl font-light mb-6 animate-slide-up delay-200">
                የኢትዮጵያ ሰፊ ዜና ምንጭ
              </p>
              <p className="text-lg md:text-xl opacity-90 animate-fade-in delay-400">
                Ethiopia's Comprehensive News Source
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Featured Article */}
          {articles.length > 0 && (
            <div className="mb-16 animate-slide-up delay-600">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center animate-fade-in">
                ዋና ዜና / Breaking News
              </h2>
              <div 
                className="relative bg-white rounded-xl shadow-xl overflow-hidden cursor-pointer transform hover:scale-105 hover:shadow-2xl transition-all duration-500 animate-float"
                onClick={() => handleArticleClick(articles[0])}
              >
                {articles[0].image && (
                  <div className="h-64 md:h-96 bg-gray-200 overflow-hidden">
                    <img 
                      src={articles[0].image} 
                      alt={articles[0].title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold mr-3 animate-pulse">
                      BREAKING
                    </span>
                    <span className="animate-fade-in delay-300">{formatDate(articles[0].published_at)}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-300">
                    {articles[0].title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {articles[0].excerpt}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Articles Grid */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center animate-slide-up delay-800">
              የቅርብ ጊዜ ዜናዎች / Latest News
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.slice(1).map((article, index) => (
                <div 
                  key={article.id}
                  className={`bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 hover:shadow-xl transition-all duration-500 animate-slide-up`}
                  style={{animationDelay: `${1000 + index * 200}ms`}}
                  onClick={() => handleArticleClick(article)}
                >
                  {article.image && (
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold mr-2 text-white transition-transform duration-300 hover:scale-110 ${
                        article.category === 'politics' ? 'bg-blue-600 animate-pulse' :
                        article.category === 'business' ? 'bg-green-600 animate-bounce' :
                        article.category === 'culture' ? 'bg-purple-600 animate-pulse' :
                        article.category === 'technology' ? 'bg-indigo-600 animate-bounce' :
                        'bg-gray-600'
                      }`}>
                        {article.category}
                      </span>
                      <span className="animate-fade-in">{formatDate(article.published_at)}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors duration-300">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
};

export default HomePage;
