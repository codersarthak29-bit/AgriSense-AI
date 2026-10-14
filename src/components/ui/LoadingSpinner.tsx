import React from 'react';
import { Sprout } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label,
  size = 'md',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        <div className={`${sizeClasses[size]} rounded-full border-2 border-emerald-200 border-t-emerald-600 animate-spin`} />
        <Sprout className="absolute text-emerald-600 animate-pulse w-1/2 h-1/2" />
      </div>
      {label && <p className="text-xs sm:text-sm font-medium text-stone-600 animate-pulse">{label}</p>}
    </div>
  );
};
