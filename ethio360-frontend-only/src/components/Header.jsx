import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Search,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Crown,
  Heart,
  Bell,
  Globe
} from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [breakingNews, setBreakingNews] = useState('');
  const { user, isAuthenticated, logout, canAccessPremium } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch breaking news on component mount
  useEffect(() => {
    const fetchBreakingNews = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/breaking-news-ticker');
        if (response.ok) {
          const data = await response.json();
          if (data.messages && data.messages.length > 0) {
            // Use the highest priority (lowest number) active message
            setBreakingNews(data.messages[0].message);
          } else {
            // Fallback message if no breaking news
            setBreakingNews('📰 Welcome to Ethio360 - Your trusted source for Ethiopian news and updates');
          }
        }
      } catch (error) {
        console.error('Failed to fetch breaking news:', error);
        // Fallback message on error
        setBreakingNews('📰 Welcome to Ethio360 - Your trusted source for Ethiopian news and updates');
      }
    };

    fetchBreakingNews();
    
    // Refresh breaking news every 60 seconds
    const interval = setInterval(fetchBreakingNews, 60000);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    { name: 'Politics', amharic: 'ፖለቲካ', path: '/category/politics' },
    { name: 'Business', amharic: 'ቢዝነስ', path: '/category/business' },
    { name: 'Technology', amharic: 'ቴክኖሎጂ', path: '/category/technology' },
    { name: 'Sports', amharic: 'ስፖርት', path: '/category/sports' },
    { name: 'Culture', amharic: 'ባህል', path: '/category/culture' },
    { name: 'International', amharic: 'ዓለም አቀፍ', path: '/category/international' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-lg relative z-50">
      {/* Breaking News Bar */}
      <div className="bg-blue-600 text-white py-1">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm">
            <span className="breaking-badge">BREAKING</span>
            <div className="flex-1 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap">
                <span className="mx-4">
                  {breakingNews}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img 
              src="/images/ethio360-logo.svg" 
              alt="Ethio360 Logo" 
              className="h-14 w-auto transition-transform group-hover:scale-105"
              onError={(e) => {
                // Fallback to text logo if image fails to load
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div style={{ display: 'none' }} className="text-3xl font-bold ethiopian-flag-text">
              Ethio360°
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`nav-link ${isActivePath('/') ? 'nav-link-active' : ''} flex flex-col items-center`}
            >
              <span className="text-sm">Home</span>
              <span className="text-xs text-gray-500 font-amharic">መነሻ</span>
            </Link>
            <Link 
              to="/about" 
              className={`nav-link ${isActivePath('/about') ? 'nav-link-active' : ''} flex flex-col items-center`}
            >
              <span className="text-sm">About</span>
              <span className="text-xs text-gray-500 font-amharic">ስለ እኛ</span>
            </Link>
            <Link 
              to="/news" 
              className={`nav-link ${isActivePath('/news') ? 'nav-link-active' : ''} flex flex-col items-center`}
            >
              <span className="text-sm">News</span>
              <span className="text-xs text-gray-500 font-amharic">ዜና</span>
            </Link>
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className={`nav-link ${isActivePath(category.path) ? 'nav-link-active' : ''} flex flex-col items-center`}
              >
                <span className="text-sm">{category.name}</span>
                <span className="text-xs text-gray-500 font-amharic">{category.amharic}</span>
              </Link>
            ))}
            
            {/* Temporary Admin Link for Development */}
            <Link 
              to="/admin" 
              className={`nav-link ${isActivePath('/admin') ? 'nav-link-active' : ''} flex flex-col items-center`}
            >
              <span className="text-sm">Admin</span>
              <span className="text-xs text-gray-500 font-amharic">አስተዳደር</span>
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pr-10 w-64"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            {isAuthenticated && (
              <button className="relative p-2 text-gray-600 hover:text-red-600 transition-colors">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
            )}

            {/* Language Selector */}
            <button className="hidden md:flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors">
              <Globe size={18} />
              <span className="text-sm">EN</span>
            </button>

            {/* Donate Button */}
            <Link
              to="/donate"
              className="hidden md:flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Heart size={18} />
              <span>Donate</span>
            </Link>

            {/* Authentication */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.first_name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user?.first_name?.[0]}{user?.last_name?.[0]}
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-medium">
                    {user?.first_name}
                  </span>
                  {canAccessPremium() && (
                    <Crown size={16} className="text-yellow-500" />
                  )}
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/subscription"
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Crown size={16} />
                      <span>Subscription</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </Link>
                    <Link
                      to="/admin"
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings size={16} />
                      <span>Admin Panel</span>
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors w-full text-left text-red-600"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pr-10 w-full"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              <Link
                to="/"
                className="block py-2 text-gray-700 hover:text-red-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex flex-col">
                  <span>Home</span>
                  <span className="text-xs text-gray-500">መነሻ</span>
                </div>
              </Link>
              <Link
                to="/about"
                className="block py-2 text-gray-700 hover:text-red-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex flex-col">
                  <span>About</span>
                  <span className="text-xs text-gray-500">ስለ እኛ</span>
                </div>
              </Link>
              <Link
                to="/news"
                className="block py-2 text-gray-700 hover:text-red-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex flex-col">
                  <span>News</span>
                  <span className="text-xs text-gray-500">ዜና</span>
                </div>
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={category.path}
                  className="block py-2 text-gray-700 hover:text-red-600 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex flex-col">
                    <span>{category.name}</span>
                    <span className="text-xs text-gray-500">{category.amharic}</span>
                  </div>
                </Link>
              ))}
              <Link
                to="/donate"
                className="flex items-center space-x-2 py-2 text-green-600 hover:text-green-700 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart size={18} />
                <span>Donate</span>
                <span className="text-xs text-gray-500 ml-1">ለግስ</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;