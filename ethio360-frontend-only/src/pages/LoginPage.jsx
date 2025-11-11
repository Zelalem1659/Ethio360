import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;