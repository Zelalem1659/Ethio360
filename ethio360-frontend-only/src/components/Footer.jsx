import React from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Globe,
  Heart,
  ArrowRight
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Ethiopian flag background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"></div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img 
                  src="/images/ethio360-logo.svg" 
                  alt="Ethio360 Logo" 
                  className="h-10 w-auto"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div style={{ display: 'none' }} className="text-2xl font-bold ethiopian-flag-text">
                  Ethio360°
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Ethiopia's premier news platform delivering comprehensive coverage of politics, 
                business, technology, sports, and culture. Your trusted source for authentic 
                Ethiopian news and global perspectives.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Globe size={16} />
                <span>🇪🇹 Proudly Ethiopian</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <nav className="space-y-2">
                <Link to="/" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Home
                </Link>
                <Link to="/category/politics" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Politics
                </Link>
                <Link to="/category/business" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Business
                </Link>
                <Link to="/category/technology" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Technology
                </Link>
                <Link to="/category/sports" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Sports
                </Link>
                <Link to="/category/culture" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Culture
                </Link>
              </nav>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Services</h3>
              <nav className="space-y-2">
                <Link to="/subscription" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Premium Membership
                </Link>
                <Link to="/donate" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Support Us
                </Link>
                <Link to="/newsletter" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Newsletter
                </Link>
                <Link to="/mobile-app" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Mobile App
                </Link>
                <Link to="/advertise" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Advertise With Us
                </Link>
                <Link to="/contact" className="block text-gray-300 hover:text-white transition-colors text-sm">
                  Contact Us
                </Link>
              </nav>
            </div>

            {/* Contact & Newsletter */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Stay Connected</h3>
              
              {/* Contact Info */}
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <MapPin size={16} />
                  <span>Washington DC, USA</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail size={16} />
                  <a href="mailto:info@ethio360.com" className="hover:text-white transition-colors">
                    info@ethio360.com
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={16} />
                  <span>+1 571 733 4232</span>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="space-y-3">
                <p className="text-sm text-gray-300">
                  Get daily news updates delivered to your inbox
                </p>
                <form className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  />
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <ArrowRight size={16} />
                  </button>
                </form>
              </div>

              {/* Social Media */}
              <div className="space-y-3">
                <p className="text-sm text-gray-300">Follow us on social media</p>
                <div className="flex space-x-3">
                  <a 
                    href="https://facebook.com/ethio360" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-blue-600 p-2 rounded-lg transition-colors"
                  >
                    <Facebook size={18} />
                  </a>
                  <a 
                    href="https://twitter.com/ethio360" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-blue-400 p-2 rounded-lg transition-colors"
                  >
                    <Twitter size={18} />
                  </a>
                  <a 
                    href="https://instagram.com/ethio360" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-pink-600 p-2 rounded-lg transition-colors"
                  >
                    <Instagram size={18} />
                  </a>
                  <a 
                    href="https://youtube.com/ethio360" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-red-600 p-2 rounded-lg transition-colors"
                  >
                    <Youtube size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="border-t border-gray-800">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <Link 
                  to="/donate" 
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  <Heart size={18} />
                  <span className="font-medium">Support Ethiopian Journalism</span>
                </Link>
                <div className="text-sm text-gray-300">
                  Help us keep Ethiopian news independent and free
                </div>
              </div>
              <div className="text-sm text-gray-400">
                🇪🇹 Made with love in Ethiopia
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-sm text-gray-400">
              <div>
                © {currentYear} Ethio360. All rights reserved.
              </div>
              <div className="flex items-center space-x-6">
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <Link to="/sitemap" className="hover:text-white transition-colors">
                  Sitemap
                </Link>
                <div className="flex items-center space-x-2">
                  <span>🌍</span>
                  <select className="bg-transparent border-none text-gray-400 text-sm focus:outline-none">
                    <option value="en">English</option>
                    <option value="am">አማርኛ</option>
                    <option value="or">Afaan Oromoo</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;