import React from 'react';
import { motion } from 'framer-motion';

const SectionHeading = ({
  title,
  subtitle,
  description,
  align = 'center',
  className = '',
}) => {
  const isLeft = align === 'left';

  return (
    <div className={`mb-12 ${isLeft ? 'text-left' : 'text-center'} ${className}`}>
      {subtitle && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs uppercase font-bold tracking-widest text-primary font-display block mb-2"
        >
          {subtitle}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-display leading-tight mb-4"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`text-grey text-base md:text-lg max-w-2xl leading-relaxed ${isLeft ? '' : 'mx-auto'}`}
        >
          {description}
        </motion.p>
      )}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className={`h-0.5 w-16 bg-primary mt-6 origin-left ${isLeft ? '' : 'mx-auto'}`}
      />
    </div>
  );
};

export default SectionHeading;
