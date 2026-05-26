'use client';

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverLift?: boolean;
  glass?: boolean;
}

export function Card({
  children,
  hoverLift = false,
  glass = false,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-border-custom bg-bg-secondary p-6 shadow-sm ${
        hoverLift ? 'hover-lift' : ''
      } ${
        glass ? 'glass' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function CardHeader({
  title,
  description,
  action,
  className = '',
  ...props
}: CardHeaderProps) {
  return (
    <div className={`flex items-start justify-between gap-4 pb-4 mb-4 border-b border-border-custom ${className}`} {...props}>
      <div>
        <h4 className="font-semibold font-display text-text-primary text-base leading-snug">
          {title}
        </h4>
        {description && (
          <p className="text-xs text-text-secondary mt-1">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
