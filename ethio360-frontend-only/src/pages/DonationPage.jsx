import React, { useState } from 'react';
import { Heart, Target, Users, Globe } from 'lucide-react';

const DonationPage = () => {
  const [amount, setAmount] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  const predefinedAmounts = [10, 25, 50, 100, 250, 500];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Heart className="mx-auto text-red-600 mb-4" size={48} />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Support Ethiopian Journalism
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help us continue providing independent, quality journalism that keeps Ethiopia informed. 
            Your support makes a difference in preserving press freedom and democratic values.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card p-6 text-center">
            <Users className="mx-auto text-green-600 mb-3" size={32} />
            <h3 className="text-2xl font-bold text-gray-900">50,000+</h3>
            <p className="text-gray-600">Daily Readers</p>
          </div>
          <div className="card p-6 text-center">
            <Globe className="mx-auto text-yellow-600 mb-3" size={32} />
            <h3 className="text-2xl font-bold text-gray-900">24/7</h3>
            <p className="text-gray-600">News Coverage</p>
          </div>
          <div className="card p-6 text-center">
            <Target className="mx-auto text-red-600 mb-3" size={32} />
            <h3 className="text-2xl font-bold text-gray-900">Independent</h3>
            <p className="text-gray-600">Journalism</p>
          </div>
        </div>

        {/* Donation Form */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Make a Donation
          </h2>
          
          <form className="space-y-6">
            {/* Amount Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose Amount (USD)
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                {predefinedAmounts.map((presetAmount) => (
                  <button
                    key={presetAmount}
                    type="button"
                    onClick={() => setAmount(presetAmount.toString())}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      amount === presetAmount.toString()
                        ? 'border-red-500 bg-red-50 text-red-600'
                        : 'border-gray-200 hover:border-red-300'
                    }`}
                  >
                    ${presetAmount}
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Custom amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field"
                min="1"
              />
            </div>

            {/* Recurring Option */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="recurring"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="recurring" className="text-sm text-gray-700">
                Make this a monthly recurring donation
              </label>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name (Optional)"
                className="input-field"
              />
              <input
                type="email"
                placeholder="Email Address (Optional)"
                className="input-field"
              />
            </div>

            {/* Message */}
            <textarea
              placeholder="Leave a message (Optional)"
              rows={3}
              className="input-field"
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full py-3 text-lg"
              disabled={!amount || parseFloat(amount) < 1}
            >
              Donate ${amount || '0'} {isRecurring ? 'Monthly' : 'Once'}
            </button>
          </form>

          {/* Security Note */}
          <p className="text-xs text-gray-500 text-center mt-4">
            🔒 Your donation is secure and processed through Stripe. 
            We do not store your payment information.
          </p>
        </div>

        {/* Why Donate Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Why Your Support Matters
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Maintain editorial independence</li>
              <li>• Support investigative journalism</li>
              <li>• Keep news accessible to all Ethiopians</li>
              <li>• Fund technology improvements</li>
              <li>• Support journalist training programs</li>
            </ul>
          </div>
          
          <div className="card p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              How We Use Donations
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Editorial Operations</span>
                <span className="font-medium">60%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Technology & Infrastructure</span>
                <span className="font-medium">25%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Training & Development</span>
                <span className="font-medium">15%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;