import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

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
        setArticles(data);
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
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br from-green-400 via-green-300 to-green-200"></div>
        <div className="absolute top-1/3 left-0 w-full h-1/3 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-br from-red-400 via-red-300 to-red-200"></div>
      </div>

      <div className="relative z-10">
        <div className="bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Ethio 360</h1>
              <p className="text-xl md:text-2xl font-light mb-6">Ethiopian News</p>
              <p className="text-lg md:text-xl opacity-90">Breaking News</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {articles.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Breaking News</h2>
              <div 
                className="relative bg-white/70 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden cursor-pointer"
                onClick={() => handleArticleClick(articles[0])}
              >
                <div className="p-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{articles[0].title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{articles[0].excerpt}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Latest News</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.slice(1).map((article) => (
                <div 
                  key={article.id}
                  className="bg-white/70 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden cursor-pointer"
                  onClick={() => handleArticleClick(article)}
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{article.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{article.excerpt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
