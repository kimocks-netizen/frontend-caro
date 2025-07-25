import React,{useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
//import Button from '../../components/ui/Button';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Redirect to admin dashboard if someone tries to access /
    navigate('/admin/dashboard');
  }, [navigate]);

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          className={`p-6 border rounded-lg cursor-pointer transition-colors ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-white' 
              : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-900'
          }`}
          onClick={() => navigate('/admin/products')}
        >
          <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Manage Products
          </h2>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            Add, edit, or remove products from your catalog
          </p>
        </div>
        <div 
          className={`p-6 border rounded-lg cursor-pointer transition-colors ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-white' 
              : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-900'
          }`}
          onClick={() => navigate('/admin/quotes')}
        >
          <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Manage Quotes
          </h2>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            View and respond to customer quote requests
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;