import React, { useState } from 'react';
import { Heart, Target, Users, Globe, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

const DonationPage = () => {
  const [amount, setAmount] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe'); // 'stripe' or 'paypal'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);

  const predefinedAmounts = [5, 10, 25, 50, 100, 250, 500];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) < 1) {
      toast.error('Please enter a valid donation amount');
      return;
    }

    if (paymentMethod === 'stripe' && (!cardNumber || !expiryDate || !cvv)) {
      toast.error('Please fill in all card details');
      return;
    }

    setProcessing(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      if (paymentMethod === 'stripe') {
        // Process Stripe payment
        const response = await fetch(`${apiUrl}/api/donation/stripe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: parseFloat(amount),
            currency: 'usd',
            recurring: isRecurring,
            cardNumber: cardNumber.replace(/\s/g, ''),
            expiryDate,
            cvv,
            fullName,
            email,
            message,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success('Thank you for your generous donation!');
          // Reset form
          setAmount('');
          setCardNumber('');
          setExpiryDate('');
          setCvv('');
          setFullName('');
          setEmail('');
          setMessage('');
        } else {
          toast.error(data.error || 'Payment failed. Please try again.');
        }
      } else if (paymentMethod === 'paypal') {
        // Process PayPal payment
        const response = await fetch(`${apiUrl}/api/donation/paypal`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: parseFloat(amount),
            currency: 'usd',
            recurring: isRecurring,
            fullName,
            email,
            message,
          }),
        });

        const data = await response.json();

        if (response.ok && data.approvalUrl) {
          // Redirect to PayPal for approval
          window.location.href = data.approvalUrl;
        } else {
          toast.error(data.error || 'PayPal payment initialization failed.');
        }
      }
    } catch (error) {
      console.error('Donation error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Heart className="mx-auto text-red-600 mb-4" size={48} />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Support Ethio360
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
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-4 rounded-lg border-2 transition-all flex items-center justify-center space-x-2 ${
                    paymentMethod === 'stripe'
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                >
                  <CreditCard size={20} />
                  <span className="font-medium">Credit/Debit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-4 rounded-lg border-2 transition-all flex items-center justify-center space-x-2 ${
                    paymentMethod === 'paypal'
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.76-4.852a.932.932 0 0 1 .924-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.746-4.467z"/>
                  </svg>
                  <span className="font-medium">PayPal</span>
                </button>
              </div>
            </div>

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

            {/* Card Details - Only show for Stripe */}
            {paymentMethod === 'stripe' && (
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-900 flex items-center">
                  <CreditCard size={18} className="mr-2" />
                  Card Details
                </h3>
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  className="input-field"
                  maxLength="19"
                  required={paymentMethod === 'stripe'}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    className="input-field"
                    maxLength="5"
                    required={paymentMethod === 'stripe'}
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="input-field"
                    maxLength="4"
                    required={paymentMethod === 'stripe'}
                  />
                </div>
              </div>
            )}

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
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-field"
              />
              <input
                type="email"
                placeholder="Email Address (Optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Message */}
            <textarea
              placeholder="Leave a message (Optional)"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input-field"
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!amount || parseFloat(amount) < 1 || processing}
            >
              {processing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `Donate $${amount || '0'} ${isRecurring ? 'Monthly' : 'Once'} via ${paymentMethod === 'stripe' ? 'Card' : 'PayPal'}`
              )}
            </button>
          </form>

          {/* Security Note */}
          <p className="text-xs text-gray-500 text-center mt-4">
            🔒 Your donation is secure and processed through {paymentMethod === 'stripe' ? 'Stripe' : 'PayPal'}. 
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