'use client';

import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  containerClassName = '',
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Date.now()}`;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="text-xs font-semibold text-text-secondary select-none"
        >
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-text-tertiary">
            {icon}
          </div>
        )}
        
        <input
          id={inputId}
          ref={ref}
          className={`w-full px-4.5 py-2.5 text-sm rounded-xl border border-border-custom bg-bg-secondary text-text-primary placeholder-text-tertiary focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-all duration-200 outline-none ${
            icon ? 'ps-10.5' : ''
          } ${
            error ? 'border-brand-danger focus:border-brand-danger focus:ring-brand-danger/10' : ''
          } ${className}`}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-xs font-medium text-brand-danger animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
