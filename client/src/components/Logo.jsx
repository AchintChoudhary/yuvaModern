import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

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
        return 'w-14';
    }
  };

  return (
    <Link to="/" className={`flex items-center select-none ${className}`}>
      <img
        src={logo}
        alt="Yuva Duty"
        className={`${getLogoSize()} h-auto object-contain`}
      />
    </Link>
  );
};

export default Logo;