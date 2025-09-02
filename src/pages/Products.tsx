import React, { useState, useEffect } from 'react';
import ProductGrid from '../components/products/ProductGrid';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ProductsPage: React.FC = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    // Simulate page loading time
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading Products Page..." size="lg" />
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>
      <ProductGrid />
    </div>
  );
};

export default ProductsPage;
