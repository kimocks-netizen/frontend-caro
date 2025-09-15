import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';
import QuotePDF from './QuotePDF';
import type { Quote } from '../../types/quote';

const QuoteStatus: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trackingCode: urlTrackingCode } = useParams<{ trackingCode: string }>();
  const { isDarkMode } = useTheme();
  const [trackingCode, setTrackingCode] = useState('');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPDF, setShowPDF] = useState(false);

  useEffect(() => {
    // Priority: URL parameter > location state > manual input
    const codeToUse = urlTrackingCode || location.state?.trackingCode;
    if (codeToUse) {
      setTrackingCode(codeToUse);
      fetchQuote(codeToUse);
    }
  }, [urlTrackingCode, location.state?.trackingCode]);

  const fetchQuote = async (code: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.quotes.getByTracking(code);
      if (response.success && response.data) {
        console.log('Quote fetched:', response.data);
        console.log('Quote status:', response.data.status);
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
      case 'pending': 
        return isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800';
      case 'in_progress': 
        return isDarkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800';
      case 'quoted': 
        return isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800';
      case 'quote_issued': 
        return isDarkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800';
      case 'rejected': 
        return isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800';
      default: 
        return isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'in_progress': return 'In Progress';
      case 'quoted': return 'Quoted';
      case 'quote_issued': return 'Quote Issued';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  return (
    <>
      <div className={`p-4 sm:p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'}`}>
        <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Track Your Quote
        </h2>
        
        {!quote && !urlTrackingCode && (
          <form onSubmit={handleSubmit} className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type="text"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="Enter tracking code"
                className={`flex-grow px-3 sm:px-4 py-2 sm:py-3 border rounded-md text-sm sm:text-base ${
                  isDarkMode 
                    ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                required
              />
              <Button 
                type="submit" 
                variant="primary"
                disabled={!trackingCode.trim()}
                className="whitespace-nowrap"
              >
                Track
              </Button>
            </div>
          </form>
        )}

        {urlTrackingCode && !quote && !loading && (
          <div className="mb-4 sm:mb-6 p-3 rounded-md bg-blue-50 border border-blue-200">
            <p className="text-blue-800 text-sm">
              <strong>Tracking Code:</strong> {urlTrackingCode}
            </p>
            <p className="text-blue-600 text-xs mt-1">
              Loading quote details...
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center py-4">
            <div className="inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Loading quote details...</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="text-center py-4">
            <p className="text-red-500 text-sm sm:text-base">{error}</p>
          </div>
        )}

        {quote && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
              <div>
                <span className={`inline-block text-xs sm:text-sm px-3 py-1 rounded-full font-medium ${getStatusColor(quote.status)}`}>
                  {getStatusLabel(quote.status)}
                </span>
              </div>
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Requested on: {new Date(quote.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* Quote Number and Status */}
            <div className={`p-3 rounded-md ${isDarkMode ? 'bg-gray-600 border border-gray-500' : 'bg-gray-100 border border-gray-200'}`}>
              <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="font-semibold">Quote Number:</span> {quote.quote_number}
              </p>
              <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="font-semibold">Valid Until:</span> {quote.valid_until ? new Date(quote.valid_until).toLocaleDateString() : 'N/A'}
              </p>
              <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="font-semibold">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getStatusColor(quote.status)}`}>
                  {getStatusLabel(quote.status)}
                </span>
              </p>
            </div>

            <div className="space-y-3">
              <h3 className={`font-semibold text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Items Requested
              </h3>
              <ul className="space-y-2">
                {quote.quote_items.map((item) => (
                  <li key={item.id} className={`flex justify-between text-sm sm:text-base ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <span className="flex-1">{item.product.title}</span>
                    <span className="ml-2 font-medium">x{item.quantity}</span>
                    {item.unit_price && (
                      <span className="ml-2 font-medium">{formatCurrency((item.unit_price || 0) * item.quantity)}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing Summary for Quoted/Issued Quotes */}
            {(quote.status === 'quoted' || quote.status === 'quote_issued') && quote.subtotal && (
              <div className={`p-3 sm:p-4 rounded-md ${isDarkMode ? 'bg-gray-600 border border-gray-500' : 'bg-gray-100 border border-gray-200'}`}>
                <h3 className={`font-semibold mb-2 text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Pricing Summary
                </h3>
                <div className="space-y-1">
                  <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="font-medium">Subtotal:</span> {formatCurrency(quote.subtotal)}
                  </p>
                  <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="font-medium">VAT (15%):</span> {formatCurrency(quote.vat_amount || 0)}
                  </p>
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Total: {formatCurrency(quote.total_amount || 0)}
                  </p>
                </div>
              </div>
            )}

            {quote.admin_notes && (
              <div className={`p-3 sm:p-4 rounded-md ${isDarkMode ? 'bg-gray-600 border border-gray-500' : 'bg-gray-100 border border-gray-200'}`}>
                <h3 className={`font-semibold mb-2 text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Admin Notes
                </h3>
                <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {quote.admin_notes}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
              {(quote.status === 'quoted' || quote.status === 'quote_issued') && (
                <Button 
                  onClick={() => setShowPDF(true)}
                  variant="primary"
                  className="flex-1 sm:flex-none"
                >
                  View Quote PDF
                </Button>
              )}
              <Button 
                onClick={() => fetchQuote(quote.tracking_code)}
                variant="outline"
                className={`flex-1 sm:flex-none ${
                  isDarkMode 
                    ? 'text-white border-gray-600 hover:bg-gray-700 hover:text-white' 
                    : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Refresh Quote
              </Button>
              <Button 
                onClick={() => navigate('/products')} 
                variant="secondary"
                className="flex-1 sm:flex-none"
              >
                Back to Products
              </Button>
              <Button 
                onClick={() => {
                  setQuote(null);
                  setTrackingCode('');
                }}
                variant="ghost"
                className="flex-1 sm:flex-none"
              >
                Track Another Quote
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* PDF Modal */}
      {showPDF && quote && (
        <QuotePDF 
          quote={quote} 
          onClose={() => setShowPDF(false)} 
        />
      )}
    </>
  );
};

export default QuoteStatus;