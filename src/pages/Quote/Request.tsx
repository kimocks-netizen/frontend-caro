import React from 'react';
import QuoteForm from '../../components/quotes/QuoteForm';
import QuoteCart from '../../components/quotes/QuoteCart';
import { useCart } from '../../context/CartContext';

const QuoteRequestPage: React.FC = () => {
  const { cartItems } = useCart();

  // If cart is empty, only show the empty cart message
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <QuoteCart />
      </div>
    );
  }

  // If cart has items, show the full layout
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Request a Quote</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Quote Items</h2>
          <QuoteCart />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Information</h2>
          <QuoteForm />
        </div>
      </div>
    </div>
  );
};

export default QuoteRequestPage;