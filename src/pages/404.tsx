import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold mb-4 text-primary">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-lg mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center">
          <Button 
            onClick={() => navigate('/')}
            variant="primary"
            size="lg"
          >
            Go Back Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;