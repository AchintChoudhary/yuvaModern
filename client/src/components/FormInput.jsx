import React from 'react';

const FormInput = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full text-left ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-white/95 font-display flex items-center">
          {label}
          {required && <span className="text-primary ml-1 font-bold">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full bg-dark-900 border ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary'} rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 ${error ? 'focus:ring-red-500/20' : 'focus:ring-primary/20'} placeholder:text-white/20 transition-all duration-300`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-400 mt-1 font-medium flex items-center gap-1">
          ⚠ {error}
        </span>
      )}
    </div>
  );
};

export default FormInput;
