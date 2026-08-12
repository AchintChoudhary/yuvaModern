import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ className = '', size = 'md' }) => {
  const getLogoSize = () => {
    switch (size) {
      case 'sm':
        return 'w-12';
      case 'lg':
        return 'w-24';
      case 'xl':
        return 'w-32';
      default:
        return 'w-14'; // md = 56px
    }
  };

  return (
    <Link to="/" className={`flex items-center select-none ${className}`}>
      <img
        src="/src/assets/logo.png"
        alt="Yuva Duty"
        className={`${getLogoSize()} h-auto object-contain`}
      />
    </Link>
  );
};

export default Logo;