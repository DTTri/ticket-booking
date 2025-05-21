import React from 'react';

interface LoadingSpinnerProps {
  size?: string; // Ví dụ: 'w-12 h-12'
  color?: string; // Ví dụ: 'border-blue-500'
  thickness?: string; // Ví dụ: 'border-t-4'
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'w-12 h-12',
  color = 'border-blue-500',
  thickness = 'border-t-4',
  className = '',
}) => {
  return (
    <div
      className={`
        ${size}
        ${thickness}
        ${color}
        border-solid
        border-transparent
        rounded-full
        animate-spin
        ${className}
      `}
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
