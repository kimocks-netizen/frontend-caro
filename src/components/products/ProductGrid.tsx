import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import ProductCard from './ProductCard';
import { useTheme } from '../../context/ThemeContext';
//import LoadingSpinner from '../ui/LoadingSpinner';
import ProductSkeleton from '../ui/ProductSkeleton';

const ProductGrid: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchProducts = async () => {
      const startTime = Date.now();
      const minLoadingTime = 800; // Minimum loading time in milliseconds
      
      try {
        const response = await api.products.getAll();
        if (response.success) {
          setProducts(response.data || []);
        } else {
          setError(response.message || 'Failed to fetch products');
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError('An error occurred while fetching products');
      } finally {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
        setTimeout(() => {
          setLoading(false);
        }, remainingTime);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <ProductSkeleton count={8} />;
  if (error) return (
    <div className={`text-center py-8 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>
      <div className="text-xl mb-2">⚠️</div>
      <p className="text-lg font-medium">{error}</p>
      <p className="text-sm mt-2">Please try refreshing the page</p>
    </div>
  );
  
  if (products.length === 0) return (
    <div className={`text-center py-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      <div className="text-4xl mb-4">📦</div>
      <p className="text-lg font-medium">No products available</p>
      <p className="text-sm mt-2">Check back later for new products</p>
    </div>
  );

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      {products.map(product => (
        <div key={product.id} className="transform transition-all duration-300 hover:scale-80 hover:-translate-y-2 hover:shadow-xl ">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;