// components/ui/Modal.tsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer,
}) => {
  const { isDarkMode } = useTheme();

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDarkMode ? 'bg-black/70' : 'bg-black/50'}`}>
      <div 
        className={`w-full ${sizeClasses[size]} rounded-lg shadow-xl overflow-hidden animate-fade-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden`}>
          {/* Header */}
          {title && (
            <div className={`flex items-center justify-between p-4 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              {title && (
                <h3 className={`text-lg font-semibold ${
                  isDarkMode ? 'text-primary-dark' : 'text-primary'
                }`}>
                  {title}
                </h3>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                &times;
              </Button>
            </div>
          )}

          {/* Content */}
          <div className={`p-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className={`p-4 border-t ${
              isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
            } flex justify-end space-x-2`}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;