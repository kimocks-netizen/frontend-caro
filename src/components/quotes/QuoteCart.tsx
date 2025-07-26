// components/quotes/QuoteCart.tsx
import React from 'react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const QuoteCart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className={`p-6 rounded-lg text-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <div className={`text-4xl mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-300'}`}>
          🛒
        </div>
        <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Your cart is empty
        </h3>
        <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Browse our products to add items to your quote request
        </p>
        <Button 
          onClick={() => navigate('/products')}
          variant="primary"
          size="md"
        >
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Quote Request Items</h3>
        <Button 
          onClick={clearCart}
          variant="ghost"
          size="sm"
        >
          Clear All
        </Button>
      </div>
      
      <div className="space-y-4">
        {cartItems.map(item => (
          <div 
            key={`${item.id}-${item.message || ''}`} 
            className={`p-3 rounded-md flex justify-between items-center ${
              isDarkMode ? 'bg-gray-600' : 'bg-white'
            }`}
          >
            <div className="flex items-center space-x-4">
              {item.image_url?.[0] && (
                <img 
                  src={item.image_url[0]} 
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div>
                <h4 className="font-medium">{item.title}</h4>
                <div className="flex items-center mt-1">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 border rounded-l"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 border-t border-b">
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 border rounded-r"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => removeFromCart(item.id)}
              variant="ghost"
              size="sm"
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuoteCart;