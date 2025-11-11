import React from 'react';

const SubscriptionPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Premium Membership Plans
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <div className="card p-6 text-center">
            <h3 className="text-xl font-bold mb-4">Basic</h3>
            <p className="text-3xl font-bold text-red-600 mb-4">$9.99<span className="text-sm text-gray-500">/month</span></p>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li>Ad-free reading</li>
              <li>Premium articles access</li>
              <li>Mobile app access</li>
              <li>Email newsletter</li>
            </ul>
            <button className="btn-primary w-full">Choose Plan</button>
          </div>
          
          {/* Premium Plan */}
          <div className="card p-6 text-center border-2 border-red-500">
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm mb-4">Most Popular</div>
            <h3 className="text-xl font-bold mb-4">Premium</h3>
            <p className="text-3xl font-bold text-red-600 mb-4">$19.99<span className="text-sm text-gray-500">/month</span></p>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li>All Basic features</li>
              <li>Exclusive premium content</li>
              <li>Early access to breaking news</li>
              <li>Live event streaming</li>
              <li>Comment privileges</li>
              <li>Offline reading</li>
            </ul>
            <button className="btn-primary w-full">Choose Plan</button>
          </div>
          
          {/* Lifetime Plan */}
          <div className="card p-6 text-center">
            <h3 className="text-xl font-bold mb-4">Lifetime</h3>
            <p className="text-3xl font-bold text-red-600 mb-4">$299.99<span className="text-sm text-gray-500">/one-time</span></p>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li>All Premium features for life</li>
              <li>VIP support</li>
              <li>Exclusive member events</li>
              <li>Behind-the-scenes content</li>
              <li>Direct editorial access</li>
            </ul>
            <button className="btn-primary w-full">Choose Plan</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;