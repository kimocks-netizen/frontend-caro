import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`py-12 px-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Premium Auto Parts at Competitive Prices
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Request quotes for high-quality auto parts and get the best deals delivered to your inbox
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => navigate('/products')}
              variant="primary"
              size="lg"
            >
              Browse Products
            </Button>
            <Button 
              onClick={() => navigate('/quote')}
              variant="secondary"
              size="lg"
            >
              Request Quote
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p>Get your parts shipped quickly to your location</p>
          </div>
          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
            <p>Competitive pricing with no hidden fees</p>
          </div>
          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="text-4xl mb-4">🛠️</div>
            <h3 className="text-xl font-semibold mb-2">Quality Parts</h3>
            <p>Premium components from trusted manufacturers</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className={`p-8 rounded-lg ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'}`}>
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="mb-6">Request a quote today and our team will get back to you within 24 hours</p>
          <Button 
            onClick={() => navigate('/quote')}
            variant={isDarkMode ? "secondary" : "primary"}
            size="lg"
          >
            Get a Quote
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;