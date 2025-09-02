import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Button from './Button';

interface ThemeBannerProps {
  onClose: () => void;
}

const ThemeBanner: React.FC<ThemeBannerProps> = ({ onClose }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show banner after a short delay for better UX
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleThemeSelect = (theme: 'dark' | 'light') => {
    if (theme === 'dark' && !isDarkMode) {
      toggleTheme();
    } else if (theme === 'light' && isDarkMode) {
      toggleTheme();
    }
    
    // Close banner after selection
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, 200);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-50 animate-slide-down">
      <div className={`mx-auto max-w-2xl px-4 py-3 rounded-md shadow-md border ring-1 ring-black/5 ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700 text-white' 
          : 'bg-white border-gray-200 text-gray-900'
      }`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`text-xl ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>🌙</div>
            <div>
              <h3 className="font-semibold text-sm">This Website supports both light and dark mode</h3>
              <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Select your preferred appearance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handleThemeSelect('dark')}
              variant="primary"
              size="sm"
              className="px-3 py-1.5"
            >
              🌙 Dark
            </Button>
            <Button
              onClick={() => handleThemeSelect('light')}
              variant="secondary"
              size="sm"
              className="px-3 py-1.5"
            >
              ☀️ Light
            </Button>
            <button
              onClick={handleClose}
              className={`p-1.5 rounded-md hover:bg-opacity-20 transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              aria-label="Close theme banner"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        
        </div>
        <div className="mt-0.5 text-center">
            <button
              onClick={handleClose}
              className={`text-xs underline hover:no-underline ${
                isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              I'll decide later
            </button>
          </div>
      </div>
    </div>
  );
};

export default ThemeBanner;
