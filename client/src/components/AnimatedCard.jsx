import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({
  children,
  number,
  icon: Icon,
  title,
  description,
  className = '',
  onClick,
}) => {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
      className={`glass-card p-6 md:p-8 rounded-xl relative overflow-hidden group select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Decorative Glow inside the card */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full filter blur-xl group-hover:bg-primary/10 transition-colors duration-500" />
      
      {/* Dynamic top highlight line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/50 transition-all duration-700" />

      <div className="flex justify-between items-start mb-6">
        {Icon ? (
          <div className="p-3.5 rounded-lg bg-dark-800 border border-white/5 text-primary group-hover:text-secondary group-hover:border-primary/20 transition-all duration-300">
            <Icon className="w-6 h-6" />
          </div>
        ) : <div />}
        
        {number && (
          <span className="text-3xl md:text-4xl font-extrabold font-display text-white/5 group-hover:text-primary/10 transition-colors duration-300">
            {number}
          </span>
        )}
      </div>

      {title && (
        <h3 className="text-lg md:text-xl font-bold font-display text-white mb-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
      )}

      {description && (
        <p className="text-grey text-sm md:text-base leading-relaxed group-hover:text-white/80 transition-colors duration-300">
          {description}
        </p>
      )}

      {children}
    </motion.div>
  );
};

export default AnimatedCard;
