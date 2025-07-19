import React,{useState} from 'react';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';
import { useAuth } from '../../context/useAuth';

const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

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
          {isAuthenticated && (
            <button onClick={logout} className="text-red-500 hover:text-red-700">
              Logout
            </button>
          )}
        </nav>
        <button 
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
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
      {/**Mobile Menu */}
      {isOpen && (
      <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md p-4">
        <nav className="flex flex-col space-y-4">
          <a href="/products" className="hover:text-purple-600">Products</a>
          <a href="/quote/request" className="hover:text-purple-600">Request Quote</a>
          {isAuthenticated && (
            <>
              <a href="/admin/dashboard" className="hover:text-purple-600">Dashboard</a>
              <button onClick={logout} className="text-red-500">Logout</button>
            </>
          )}
        </nav>
      </div>
      )}
    </header>
  );
};

export default Header;