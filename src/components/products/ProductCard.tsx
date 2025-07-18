import React from 'react';
import { useCart } from '../../hooks/useCart';
import Button from '../ui/Button';

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

  return (
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
          <Button 
            onClick={() => addToCart(product)}
            variant="primary"
            size="sm"
          >
            Add to Quote
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;