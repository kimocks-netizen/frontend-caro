import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text = 'Loading...', 
  size = 'md',
  className = '' 
}) => {
  const { isDarkMode } = useTheme();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]} mb-4 shadow-lg`}></div>
      <p className={`${textSizeClasses[size]} ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} animate-pulse`}>
        {text}
      </p>
    </div>
  );
};

export default LoadingSpinner;
