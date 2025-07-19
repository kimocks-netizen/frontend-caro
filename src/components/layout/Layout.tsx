import React from 'react';
import { Outlet } from 'react-router-dom'; // <-- import Outlet
import { useTheme } from '../../context/ThemeContext';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children || <Outlet />} {/* <-- This is where nested routes will render */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
