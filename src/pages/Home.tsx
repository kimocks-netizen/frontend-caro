import React,{useEffect} from 'react';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/ui/Button';
import { useAuth } from '../context/useAuth';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import QuoteStatus from '../components/quotes/QuoteStatus';


const Home: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleGetQuoteClick = () => {
    if (cartItems.length === 0) {
      navigate('/quote/request');
    } else {
      navigate('/quote');
    }
  };

  return (
    <div className={`py-8 sm:py-12 px-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-12 sm:mb-16">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Premium Packaging at Competitive Prices
          </h1>
          <p className={`text-lg sm:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Request quotes for high-quality equipment and parts and get the best deals delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
            <Button 
              onClick={() => navigate('/products')}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Browse Products
            </Button>
            <Button 
              onClick={() => navigate('/quote')}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Request Quote
            </Button>
          </div>
        </div>
        {/* Track Your Quote Section */}
        <div className={`w-full max-w-3xl mx-auto mb-12 sm:mb-16 ${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'}`}>
          <QuoteStatus />
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className={`p-4 sm:p-6 rounded-lg ${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🚚</div>
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Fast Delivery</h3>
            <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Get your parts shipped quickly to your location</p>
          </div>
          <div className={`p-4 sm:p-6 rounded-lg ${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💰</div>
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Best Prices</h3>
            <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Competitive pricing with no hidden fees</p>
          </div>
          <div className={`p-4 sm:p-6 rounded-lg ${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🛠️</div>
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quality Parts</h3>
            <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Premium components from trusted manufacturers</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className={`p-6 sm:p-8 rounded-lg ${isDarkMode ? 'bg-purple-900 border border-purple-700' : 'bg-purple-100 border border-purple-200'}`}>
          <h2 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Ready to get started?</h2>
          <p className={`mb-4 sm:mb-6 text-sm sm:text-base ${isDarkMode ? 'text-purple-200' : 'text-gray-700'}`}>Request a quote today and our team will get back to you within 24 hours</p>
          <Button 
            onClick={handleGetQuoteClick}
            variant={isDarkMode ? "secondary" : "primary"}
            size="lg"
            className="w-full sm:w-auto"
          >
            Get a Quote
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;