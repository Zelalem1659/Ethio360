import React, { useState } from 'react';
import BreakingNewsAdmin from '../components/BreakingNewsAdmin';
import { Newspaper, Users, FileText, Heart } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'breaking-news', label: 'Breaking News', icon: Newspaper },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'breaking-news':
        return <BreakingNewsAdmin />;
      default:
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Admin Dashboard Overview
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">Total Users</h3>
                  <p className="text-3xl font-bold text-blue-600">1,234</p>
                </div>
                
                <div className="card p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">Total Articles</h3>
                  <p className="text-3xl font-bold text-green-600">567</p>
                </div>
                
                <div className="card p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">Subscribers</h3>
                  <p className="text-3xl font-bold text-purple-600">89</p>
                </div>
                
                <div className="card p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">Total Donations</h3>
                  <p className="text-3xl font-bold text-red-600">$2,345</p>
                </div>
              </div>
              
              <div className="mt-8">
                <p className="text-gray-600">
                  Welcome to the Ethio360 Admin Dashboard. Use the navigation above to manage different aspects of the platform.
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default AdminDashboard;