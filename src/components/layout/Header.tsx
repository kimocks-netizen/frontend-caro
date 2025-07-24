import React, { useState, useEffect, useRef } from 'react';
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
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const [, setStorageChanged] = useState(false);
  useEffect(() => {
    const handleStorageChange = () => {
      setStorageChanged(s => !s); // toggle to force re-render
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Close mobile nav when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileNavRef.current && !mobileNavRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const handleCartClick = () => {
    navigate('/quote');
    setIsOpen(false);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const navBackground = isDarkMode 
    ? 'bg-gray-900/95 backdrop-blur-md border-gray-700' 
    : 'bg-white/95 backdrop-blur-md border-gray-200';

  const mobileNavBackground = isDarkMode 
    ? 'bg-gray-800/95 border-gray-700' 
    : 'bg-white/95 border-gray-200';

  return (
    <>
      {/* Main navbar */}
      <header className={`sticky top-0 z-50 ${navBackground} shadow-md border-b`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              CaroParts
            </h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6">
            <a 
              href="/" 
              className={`hover:text-purple-600 transition-colors ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
            >
              Home
            </a>
            {!isAuthenticated && (
              <>
                <a 
                  href="/products" 
                  className={`hover:text-purple-600 transition-colors ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                >
                  Products
                </a>
                <a 
                  href="/quote" 
                  className={`hover:text-purple-600 transition-colors ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                >
                  Request Quote
                </a>
                <a 
                  href="/admin" 
                  className={`hover:text-purple-600 transition-colors ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                >
                  Admin
                </a>
              </>
            )}

            {isAuthenticated && (
              <>
                <a 
                  href="/admin/products" 
                  className={`hover:text-purple-600 transition-colors ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                >
                  Products
                </a>
                <a 
                  href="/admin/quotes" 
                  className={`hover:text-purple-600 transition-colors ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                >
                  Manage Quotes
                </a>
                <button 
                  onClick={handleLogout} 
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            {!isAuthenticated && (
              <button
                onClick={handleCartClick}
                className={`relative p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-white' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                title="View Quote Cart"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
            
            {/* Theme Toggle */}
            <Button 
              onClick={toggleTheme} 
              variant="ghost" 
              size="sm"
              className={isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </Button>

            {/* Mobile menu toggle */}
            <button 
              className={`md:hidden p-2 rounded-md transition-colors ${
                isDarkMode 
                  ? 'text-white hover:bg-gray-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Mobile Nav Content */}
          <div 
            ref={mobileNavRef}
            className={`fixed top-16 left-0 right-0 ${mobileNavBackground} border-t shadow-lg z-50 transition-all duration-300`}
          >
            <div className="px-4 py-4 space-y-2">
              <button
                onClick={() => handleNavClick('/')}
                className={`w-full text-left py-3 px-4 rounded-md transition-colors ${
                  isDarkMode 
                    ? 'text-white hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Home
              </button>
              
              {!isAuthenticated && (
                <>
                  <hr className={isDarkMode ? "border-gray-700" : "border-gray-200"} />
                  <button
                    onClick={() => handleNavClick('/products')}
                    className={`w-full text-left py-3 px-4 rounded-md transition-colors ${
                      isDarkMode 
                        ? 'text-white hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Products
                  </button>
                  <button
                    onClick={() => handleNavClick('/quote')}
                    className={`w-full text-left py-3 px-4 rounded-md transition-colors ${
                      isDarkMode 
                        ? 'text-white hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Request Quote
                  </button>
                  <button
                    onClick={() => handleNavClick('/admin')}
                    className={`w-full text-left py-3 px-4 rounded-md transition-colors ${
                      isDarkMode 
                        ? 'text-white hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Admin
                  </button>
                </>
              )}
              
              {isAuthenticated && (
                <>
                  <hr className={isDarkMode ? "border-gray-700" : "border-gray-200"} />
                  <button
                    onClick={() => handleNavClick('/admin/products')}
                    className={`w-full text-left py-3 px-4 rounded-md transition-colors ${
                      isDarkMode 
                        ? 'text-white hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Products
                  </button>
                  <button
                    onClick={() => handleNavClick('/admin/quotes')}
                    className={`w-full text-left py-3 px-4 rounded-md transition-colors ${
                      isDarkMode 
                        ? 'text-white hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Manage Quotes
                  </button>
                  <hr className={isDarkMode ? "border-gray-700" : "border-gray-200"} />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-3 px-4 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
