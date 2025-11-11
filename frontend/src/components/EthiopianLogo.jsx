import React from 'react';

const EthiopianLogo = ({ size = 'default', className = '' }) => {
  const sizeClasses = {
    small: 'text-lg',
    default: 'text-2xl',
    large: 'text-3xl',
    xlarge: 'text-4xl'
  };

  return (
    <div className={`font-bold ethiopian-flag-text ${sizeClasses[size]} ${className}`}>
      <span className="relative">
        Ethio
        <span className="relative">
          3
          <span className="absolute -top-1 -right-1 text-xs">6</span>
          <span className="absolute -top-1 -right-3 text-xs">0</span>
        </span>
        °
      </span>
    </div>
  );
};

export default EthiopianLogo;