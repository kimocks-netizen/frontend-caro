import React from 'react';
import ProductGrid from '../components/products/ProductGrid';

const ProductsPage: React.FC = () => {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>
      <ProductGrid />
    </div>
  );
};

export default ProductsPage;
