import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import type { QuoteRequestData } from '../../types/quote';

const QuoteForm: React.FC = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState<Omit<QuoteRequestData, 'items'>>({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
  }>({});

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) {
      return 'Name is required';
    }
    if (name.trim().length < 2) {
      return 'Name must be at least 2 characters long';
    }
    if (name.trim().length > 50) {
      return 'Name must be less than 50 characters';
    }
    // Check if name contains only letters, spaces, and common punctuation
    const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
    if (!nameRegex.test(name.trim())) {
      return 'Name can only contain letters, spaces, hyphens, apostrophes, and periods';
    }
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address';
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    
    const errors = {
      name: nameError,
      email: emailError,
    };
    
    setValidationErrors(errors);
    
    return !nameError && !emailError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      setError('Please add items to your quote first');
      return;
    }

    // Validate form
    if (!validateForm()) {
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
    
    // Clear validation error when user starts typing
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        error={validationErrors.name}
      />
      <Input
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        error={validationErrors.email}
      />
      <div className="mb-4">
        <label className={`block mb-2 text-sm font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Additional Message
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
          rows={4}
          placeholder="Enter your additional message here..."
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