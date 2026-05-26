'use client';

import React, { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  options,
  containerClassName = '',
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || `select-${Date.now()}`;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={selectId}
          className="text-xs font-semibold text-text-secondary select-none"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          id={selectId}
          ref={ref}
          className={`w-full px-4.5 py-2.5 text-sm rounded-xl border border-border-custom bg-bg-secondary text-text-primary focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-all duration-200 outline-none appearance-none ${
            error ? 'border-brand-danger focus:border-brand-danger' : ''
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        
        {/* Custom Chevron Indicator */}
        <div className="absolute inset-y-0 end-0 flex items-center pe-3.5 pointer-events-none text-text-secondary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {error && (
        <p className="text-xs font-medium text-brand-danger animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
