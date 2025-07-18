import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import ProductCard from './ProductCard';
import { useTheme } from '../../context/ThemeContext';

const ProductGrid: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchProducts = async () => {
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
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="text-center py-8">Loading products...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (products.length === 0) return <div className="text-center py-8">No products available</div>;

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;