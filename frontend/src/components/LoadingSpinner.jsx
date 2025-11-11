import React from 'react';

const LoadingSpinner = ({ size = 'default', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        {/* Ethiopian flag colored spinner */}
        <div className={`${sizeClasses[size]} animate-spin`}>
          <div className="absolute inset-0 border-4 border-transparent border-t-green-500 rounded-full"></div>
          <div className="absolute inset-1 border-4 border-transparent border-t-yellow-500 rounded-full animate-spin" style={{ animationDelay: '0.1s' }}></div>
          <div className="absolute inset-2 border-4 border-transparent border-t-red-500 rounded-full animate-spin" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
      {text && (
        <p className="mt-4 text-gray-600 text-sm font-medium">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;