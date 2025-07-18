import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className={`sticky top-0 z-50 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-md`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">CaroParts</h1>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="/" className="hover:text-purple-600 transition-colors">Home</a>
          <a href="/products" className="hover:text-purple-600 transition-colors">Products</a>
          <a href="/quote" className="hover:text-purple-600 transition-colors">Request Quote</a>
          <a href="/admin" className="hover:text-purple-600 transition-colors">Admin</a>
        </nav>
        <div className="flex items-center space-x-4">
          <Button 
            onClick={toggleTheme}
            variant="ghost"
            size="sm"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;