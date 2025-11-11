import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user, subscription } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Profile Settings
        </h1>
        
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <div className="space-y-4">
            <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Role:</strong> {user.role}</p>
            {subscription && (
              <p><strong>Subscription:</strong> {subscription.subscription_type}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;