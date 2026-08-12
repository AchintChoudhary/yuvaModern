import React from 'react';
import { Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-display font-medium rounded-lg transition-all duration-300 select-none shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-primary hover:bg-primary-hover text-white hover:shadow-[0_0_20px_rgba(255,106,0,0.4)] border border-primary/20',
    secondary: 'bg-secondary hover:bg-secondary/90 text-dark-950 hover:shadow-[0_0_20px_rgba(255,166,43,0.3)] border border-secondary/20',
    outline: 'border border-white/20 hover:border-primary/50 text-white hover:text-primary hover:bg-primary/5 bg-transparent',
    ghost: 'text-white/80 hover:text-white hover:bg-white/5 bg-transparent shadow-none',
    danger: 'bg-red-600 hover:bg-red-700 text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] border border-red-500/20',
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyles} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4 flex-shrink-0" />
      ) : null}
      <span>{children}</span>
    </motion.button>
  );
};

export default Button;
