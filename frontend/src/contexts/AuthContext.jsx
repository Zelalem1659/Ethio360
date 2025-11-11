import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await authAPI.getProfile();
      setUser(response.data.user);
      setSubscription(response.data.subscription);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { user, subscription, access_token, refresh_token } = response.data;
      
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      
      setUser(user);
      setSubscription(subscription);
      setIsAuthenticated(true);
      
      toast.success('Login successful!');
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { user, access_token, refresh_token } = response.data;
      
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      
      setUser(user);
      setIsAuthenticated(true);
      
      toast.success('Registration successful!');
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setSubscription(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      setUser(response.data.user);
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Profile update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await authAPI.changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Password change failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const updateSubscription = (newSubscription) => {
    setSubscription(newSubscription);
    // Update user role if needed
    if (newSubscription && ['basic', 'premium', 'lifetime'].includes(newSubscription.subscription_type)) {
      setUser(prev => ({ ...prev, role: 'premium' }));
    }
  };

  const hasSubscription = (requiredType = null) => {
    if (!subscription || !subscription.is_active) return false;
    if (!requiredType) return true;
    
    const typeHierarchy = {
      free: 0,
      basic: 1,
      premium: 2,
      lifetime: 3
    };
    
    const currentLevel = typeHierarchy[subscription.subscription_type] || 0;
    const requiredLevel = typeHierarchy[requiredType] || 0;
    
    return currentLevel >= requiredLevel;
  };

  const canAccessPremium = () => {
    return hasSubscription('basic');
  };

  const isAdmin = () => {
    return user && ['admin', 'editor'].includes(user.role);
  };

  const value = {
    user,
    subscription,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    updateSubscription,
    hasSubscription,
    canAccessPremium,
    isAdmin,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};