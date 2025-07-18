import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Footer: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <footer className={`py-8 ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-semibold">CaroParts</h2>
            <p className="text-sm mt-2">Quality auto parts at competitive prices</p>
          </div>
          <div className="flex space-x-6">
            <a href="/about" className="hover:text-purple-600 transition-colors">About Us</a>
            <a href="/contact" className="hover:text-purple-600 transition-colors">Contact</a>
            <a href="/terms" className="hover:text-purple-600 transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-purple-600 transition-colors">Privacy</a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm">
          © {new Date().getFullYear()} CaroParts. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;