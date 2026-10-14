import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  isGlass?: boolean;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  isGlass = false,
  hoverEffect = false,
}) => {
  return (
    <div
      className={`rounded-2xl transition-all duration-200 ${
        isGlass
          ? 'glass-card'
          : 'bg-white border border-stone-200/80 shadow-xs'
      } ${
        hoverEffect ? 'hover:shadow-md hover:border-emerald-200 transition-all' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
