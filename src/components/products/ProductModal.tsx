import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const { isDarkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 ${
        isDarkMode ? 'bg-black/70' : 'bg-black/50'
      }`}
      onClick={onClose}
    >
      <div 
        className="w-[98vw] max-w-7xl max-h-[95vh] overflow-auto rounded-lg shadow-xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg`}>
          {/* Header */}
          {title && (
            <div className={`flex items-center justify-between p-4 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold ${
                isDarkMode ? 'text-purple-300' : 'text-purple-700'
              }`}>
                {title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl leading-none p-1"
              >
                ×
              </Button>
            </div>
          )}

          {/* Content */}
          <div className={`p-4 sm:p-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
