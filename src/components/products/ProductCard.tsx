// components/products/ProductCard.tsx
import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';
import AddToCartModal from '../ui/AddToCartModal';
import Modal from '../ui/Modal';

interface Product {
  id: string;
  title: string;
  description: string;
  image_url: string[];
  price_range?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleAddToCart = () => {
    console.log('[Cart] Adding to cart:', { ...product, message: '' });
    // Add the item to cart 'quantity' times since CartContext addToCart adds 1 at a time
    for (let i = 0; i < quantity; i++) {
      addToCart({
        ...product,
        message: ''
      });
    }
    setShowModal(true);
    setQuantity(1);
  };

  const handleContinueShopping = () => {
    // Modal will close automatically
  };

  const handleCheckout = () => {
    navigate('/quote');
  };

  const handleReadMore = () => {
    setShowDetailModal(true);
  };

  const handleImageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentImageIndex((prev) => 
        prev === product.image_url.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.image_url.length - 1 : prev - 1
      );
    }
  };

  const isDescriptionLong = product.description.length > 100;

  return (
    <>
      <div className={`border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="h-48 bg-gray-100 overflow-hidden relative">
          {product.image_url?.length > 0 && (
            <>
              <img 
                src={product.image_url[currentImageIndex]} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.image_url.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between p-2">
                  <button
                    onClick={() => handleImageChange('prev')}
                    className="bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition-all"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => handleImageChange('next')}
                    className="bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition-all"
                  >
                    ›
                  </button>
                </div>
              )}
              {product.image_url.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {product.image_url.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <div className="p-4">
          <h3 className={`text-lg font-semibold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {product.title}
          </h3>
          <div className="mb-4">
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            } line-clamp-2`}>
              {product.description}
            </p>
            {isDescriptionLong && (
              <button
                onClick={handleReadMore}
                className="text-sm text-blue-600 hover:text-blue-800 mt-1 font-medium"
              >
                Read More
              </button>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-amber-600">
              {product.price_range || 'Request Quote'}
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className={`w-14 px-2 py-1 border rounded ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <Button 
                onClick={handleAddToCart} 
                variant="primary" 
                size="sm"
                className="whitespace-nowrap"
              >
                Add to Quote
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AddToCartModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onContinueShopping={handleContinueShopping}
        onCheckout={handleCheckout}
        productName={product.title}
      />

      <Modal 
        isOpen={showDetailModal} 
        onClose={() => setShowDetailModal(false)}
        title={product.title}
      >
        <div className="space-y-4">
          {product.image_url.length > 1 && (
            <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={product.image_url[currentImageIndex]} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-between p-4">
                <button
                  onClick={() => handleImageChange('prev')}
                  className="bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-all"
                >
                  ‹
                </button>
                <button
                  onClick={() => handleImageChange('next')}
                  className="bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-all"
                >
                  ›
                </button>
              </div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {product.image_url.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
          <p className={`text-sm leading-relaxed ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {product.description}
          </p>
          <div className="flex justify-between items-center pt-4">
            <span className="font-medium text-amber-600">
              {product.price_range || 'Request Quote'}
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className={`w-16 px-2 py-1 border rounded ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <Button 
                onClick={handleAddToCart} 
                variant="primary" 
                size="sm"
                className="whitespace-nowrap"
              >
                Add to Quote
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProductCard;
