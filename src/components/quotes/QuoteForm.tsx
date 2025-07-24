import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import type { QuoteRequestData } from '../../types/quote';

const QuoteForm: React.FC = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Omit<QuoteRequestData, 'items'>>({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

 // components/quotes/QuoteForm.tsx
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setError('Please add items to your quote first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const quoteData: QuoteRequestData = {
        ...formData,  // { name, email, message }
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          message: item.message || ''
        }))
      };

      const response = await api.quotes.submit(quoteData);
      
      if (response.success && response.data?.trackingCode) {
        clearCart();
        navigate('/quote/success', { 
          state: { trackingCode: response.data.trackingCode } 
        });
      } else {
        setError(response.message || 'Failed to submit quote');
      }
    } catch (error) {
      console.error('Quote submission error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while submitting your quote');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <Input
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Additional Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          rows={4}
        />
      </div>
      
      {error && <p className="text-red-500">{error}</p>}
      
      <Button 
        type="submit" 
        variant="primary"
        disabled={loading || cartItems.length === 0}
        className="w-full"
      >
        {loading ? 'Submitting...' : 'Request Quote'}
      </Button>
    </form>
  );
};

export default QuoteForm;