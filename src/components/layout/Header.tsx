import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import Button from '../ui/Button';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const [, setStorageChanged] = useState(false);
  useEffect(() => {
    const handleStorageChange = () => {
      setStorageChanged(s => !s); // toggle to force re-render
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCartClick = () => {
    navigate('/quote');
  };

  return (
    <header className={`sticky top-0 z-50 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-md`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">CaroParts</h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6">
          <a href="/" className="hover:text-purple-600 transition-colors">Home</a>
          {!isAuthenticated && (
            <>
              <a href="/products" className="hover:text-purple-600 transition-colors">Products</a>
              <a href="/quote" className="hover:text-purple-600 transition-colors">Request Quote</a>
              <a href="/admin" className="hover:text-purple-600 transition-colors">Admin</a>
            </>
          )}

          {isAuthenticated && (
            <>
              <a href="/admin/products" className="hover:text-purple-600 transition-colors">Products</a>
              <a href="/admin/quotes" className="hover:text-purple-600 transition-colors">Manage Quotes</a>
              <button onClick={handleLogout} className="text-red-500 hover:text-red-700">Logout</button>
            </>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>☰</button>

        <div className="flex items-center space-x-4">
          {/* Cart Icon */}
          {!isAuthenticated && (
            <button
              onClick={handleCartClick}
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title="View Quote Cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          )}
          
          <Button onClick={toggleTheme} variant="ghost" size="sm">
            {isDarkMode ? '☀️' : '🌙'}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md p-4">
          <nav className="flex flex-col space-y-4">
            <a href="/" className="hover:text-purple-600">Home</a>
            {!isAuthenticated && (
              <>
                <a href="/products" className="hover:text-purple-600">Products</a>
                <a href="/quote" className="hover:text-purple-600">Request Quote</a>
                <a href="/admin" className="hover:text-purple-600">Admin</a>
              </>
            )}
            {isAuthenticated && (
              <>
                <a href="/admin/products" className="hover:text-purple-600">Products</a>
                <a href="/admin/quotes" className="hover:text-purple-600">Manage Quotes</a>
                <button onClick={handleLogout} className="text-red-500">Logout</button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
