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
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');

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
        if (response.data.requiresVerification) {
          // Show verification step
          setVerificationStep(true);
          setPendingEmail(formData.email);
          setError('');
        } else {
          // Direct success (shouldn't happen with new flow)
          clearCart();
          navigate('/quote/success', { 
            state: { trackingCode: response.data.trackingCode } 
          });
        }
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

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.quotes.verify(pendingEmail, verificationCode);
      
      if (response.success && response.data?.trackingCode) {
        clearCart();
        navigate('/quote/success', { 
          state: { trackingCode: response.data.trackingCode } 
        });
      } else {
        setError(response.message || 'Invalid verification code');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during verification');
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

  if (verificationStep) {
    return (
      <div className="space-y-4">
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-blue-50 border border-blue-200'}`}>
          <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
            Email Verification Required
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-blue-700'}`}>
            We've sent a verification code to <strong>{pendingEmail}</strong>. 
            Please check your email and enter the code below to complete your quote request.
          </p>
        </div>
        
        <form onSubmit={handleVerification} className="space-y-4">
          <Input
            label="Verification Code"
            name="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
            placeholder="Enter 6-digit code"
            maxLength={6}
          />
          
          {error && <p className="text-red-500">{error}</p>}
          
          <Button 
            type="submit" 
            variant="primary"
            disabled={loading || !verificationCode.trim()}
            className="w-full"
          >
            {loading ? 'Verifying...' : 'Verify Email & Complete Quote'}
          </Button>
          
          <Button 
            type="button" 
            variant="secondary"
            onClick={() => {
              setVerificationStep(false);
              setVerificationCode('');
              setPendingEmail('');
              setError('');
            }}
            className="w-full"
          >
            Back to Form
          </Button>
        </form>
      </div>
    );
  }

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