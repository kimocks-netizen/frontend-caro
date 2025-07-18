import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  description, 
  footer, 
  children, 
  className = '', 
  ...props 
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`rounded-lg shadow-md overflow-hidden ${
        isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-800'
      } ${className}`}
      {...props}
    >
      {(title || description) && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-600">
          {title && (
            <h3 className={`text-xl font-semibold ${
              isDarkMode ? 'text-purple-300' : 'text-purple-700'
            }`}>
              {title}
            </h3>
          )}
          {description && (
            <p className={`mt-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {description}
            </p>
          )}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className={`px-6 py-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;