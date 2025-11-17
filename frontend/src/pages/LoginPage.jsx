import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Crown } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    }
    
    setLoading(false);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    
    // Demo admin password: admin123
    if (adminPassword === 'admin123') {
      // Set admin user in localStorage for demo purposes
      const adminUser = {
        id: 1,
        email: 'admin@ethio360.com',
        name: 'Admin User',
        role: 'admin'
      };
      
      localStorage.setItem('access_token', 'demo-admin-token');
      localStorage.setItem('user', JSON.stringify(adminUser));
      
      // Navigate to admin dashboard
      navigate('/admin');
      window.location.reload(); // Reload to update auth context
    } else {
      alert('Incorrect admin password. Default password is: admin123');
    }
  };

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
      
      <div className="relative z-10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-gray-100">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
            Sign in to Ethio360
          </h2>
          <p className="mt-2 text-gray-600">
            Access your account to read premium content
          </p>
        </div>
        
        <form className="card p-8" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter your password"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-red-600 hover:text-red-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </form>

        {/* Admin Access Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-2">
              <Crown className="text-yellow-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Admin Access</h3>
            <p className="text-sm text-gray-600">Enter admin password to access the admin panel</p>
          </div>
          
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <input
                id="adminPassword"
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="input-field"
                placeholder="Enter admin password"
              />
              <p className="text-xs text-gray-500 mt-1">Demo password: <code className="bg-gray-100 px-1 rounded">admin123</code></p>
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full bg-yellow-600 hover:bg-yellow-700"
            >
              Access Admin Panel
            </button>
          </form>
        </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;