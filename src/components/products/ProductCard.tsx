// components/products/ProductCard.tsx
import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import AddToCartModal from '../ui/AddToCartModal';

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
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

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

  return (
    <>
      <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        <div className="h-48 bg-gray-100 overflow-hidden">
          {product.image_url?.length > 0 && (
            <img 
              src={product.image_url[0]} 
              alt={product.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">{product.title}</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
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
                className="w-16 px-2 py-1 border rounded"
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
    </>
  );
};

export default ProductCard;
