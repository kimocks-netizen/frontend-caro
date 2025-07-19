import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';
import type { Quote } from '../../types/quote';

const QuoteStatus: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [trackingCode, setTrackingCode] = useState('');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.trackingCode) {
      setTrackingCode(location.state.trackingCode);
      fetchQuote(location.state.trackingCode);
    }
  }, [location]);

  const fetchQuote = async (code: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.quotes.getByTracking(code);
      if (response.success && response.data) {
        setQuote(response.data);
      } else {
        setError(response.message || 'Quote not found');
      }
    } catch (error) {
      setError('Failed to fetch quote details');
      console.error('Error fetching quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingCode.trim()) {
      fetchQuote(trackingCode);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'quoted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
      <h2 className="text-2xl font-bold mb-6">Track Your Quote</h2>
      
      {!quote && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex space-x-2">
            <input
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="Enter tracking code"
              className="flex-grow px-4 py-2 border rounded-md"
              required
            />
            <Button 
              type="submit" 
              variant="primary"
              disabled={!trackingCode.trim()}
            >
              Track
            </Button>
          </div>
        </form>
      )}

      {loading && <p className="text-center py-4">Loading quote details...</p>}
      {error && <p className="text-red-500 text-center py-4">{error}</p>}

      {quote && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(quote.status)}`}>
                {quote.status.toUpperCase()}
              </span>
            </div>
            <p className="text-sm">Requested on: {new Date(quote.created_at).toLocaleDateString()}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Items Requested</h3>
            <ul className="space-y-2">
              {quote.quote_items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.product.title} (x{item.quantity})</span>
                </li>
              ))}
            </ul>
          </div>

          {quote.admin_notes && (
            <div className={`p-4 rounded-md mb-6 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
              <h3 className="font-semibold mb-2">Admin Notes</h3>
              <p>{quote.admin_notes}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <Button 
              onClick={() => navigate('/products')} 
              variant="secondary"
            >
              Back to Products
            </Button>
            <Button 
              onClick={() => {
                setQuote(null);
                setTrackingCode('');
              }}
              variant="ghost"
            >
              Track Another Quote
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteStatus;