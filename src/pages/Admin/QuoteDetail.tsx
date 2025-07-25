import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import Button from '../../components/ui/Button';
import { useTheme } from '../../context/ThemeContext';

const QuoteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPricing, setUpdatingPricing] = useState(false);
  const [issuingQuote, setIssuingQuote] = useState(false);
  const [pricingItems, setPricingItems] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchQuote();
    }
  }, [id]);

  const fetchQuote = async () => {
    try {
      const response = await api.quotes.getById(id!);
      if (response.success && response.data) {
        setQuote(response.data);
        setPricingItems(response.data.quote_items || []);
      } else {
        setError(response.message || 'Failed to fetch quote');
      }
    } catch (error) {
      setError('An error occurred while fetching quote');
      console.error('Error fetching quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: string) => {
    if (!id) return;
    
    setUpdatingStatus(true);
    try {
      const response = await api.quotes.updateStatus(id, status);
      if (response.success) {
        setQuote((prev: any) => ({ ...prev, status }));
        console.log('Status updated successfully');
      } else {
        console.error('Failed to update status:', response.message);
        setError(response.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Failed to update status', err);
      setError('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const updatePricing = async () => {
    if (!id) return;
    
    setUpdatingPricing(true);
    try {
      const items = pricingItems.map(item => ({
        id: item.id,
        unit_price: parseFloat(item.unit_price) || 0,
        quantity: item.quantity
      }));

      const response = await api.quotes.updatePricing(id, items);
      if (response.success && response.data) {
        setQuote(response.data);
        setPricingItems(response.data.quote_items || []);
        console.log('Pricing updated successfully');
      } else {
        console.error('Failed to update pricing:', response.message);
        setError(response.message || 'Failed to update pricing');
      }
    } catch (err) {
      console.error('Failed to update pricing', err);
      setError('Failed to update pricing');
    } finally {
      setUpdatingPricing(false);
    }
  };

  const issueQuote = async () => {
    if (!id) return;
    
    setIssuingQuote(true);
    try {
      const items = pricingItems.map(item => ({
        id: item.id,
        unit_price: parseFloat(item.unit_price) || 0,
        quantity: item.quantity
      }));

      const response = await api.quotes.issueQuote(id, items);
      if (response.success && response.data) {
        setQuote(response.data);
        setPricingItems(response.data.quote_items || []);
        console.log('Quote issued successfully');
      } else {
        console.error('Failed to issue quote:', response.message);
        setError(response.message || 'Failed to issue quote');
      }
    } catch (err) {
      console.error('Failed to issue quote', err);
      setError('Failed to issue quote');
    } finally {
      setIssuingQuote(false);
    }
  };

  const handlePricingChange = (itemId: string, field: string, value: string) => {
    setPricingItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, [field]: value }
        : item
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'quoted':
        return 'bg-green-100 text-green-800';
      case 'quote_issued':
        return 'bg-purple-100 text-purple-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  if (loading) {
    return (
      <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="text-center py-8">
          <div className="inline-flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Loading quote details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => navigate('/admin/quotes')} variant="primary">
            Back to Quotes
          </Button>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="text-center py-8">
          <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Quote not found</p>
          <Button onClick={() => navigate('/admin/quotes')} variant="primary">
            Back to Quotes
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = pricingItems.reduce((sum, item) => sum + (parseFloat(item.total_price) || 0), 0);
  const vatAmount = subtotal * 0.15;
  const total = subtotal + vatAmount;

  return (
    <div className={`p-6 max-w-6xl mx-auto ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Quote Details
        </h1>
        <Button onClick={() => navigate('/admin/quotes')} variant="outline">
          Back to Quotes
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className={`rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
        {/* Quote Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Quote Information
            </h2>
            <div className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p><span className="font-medium">Tracking Code:</span> <span className="font-mono">{quote.tracking_code}</span></p>
              <p><span className="font-medium">Quote Number:</span> <span className="font-mono">{quote.quote_number}</span></p>
              <p><span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-sm ${getStatusColor(quote.status)}`}>
                  {getStatusLabel(quote.status)}
                </span>
              </p>
              <p><span className="font-medium">Created:</span> {new Date(quote.created_at).toLocaleDateString()}</p>
              <p><span className="font-medium">Valid Until:</span> {new Date(quote.valid_until).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div>
            <h2 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Customer Information
            </h2>
            <div className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p><span className="font-medium">Name:</span> {quote.guest_name}</p>
              <p><span className="font-medium">Email:</span> {quote.guest_email}</p>
              {quote.verified && <p><span className="font-medium">Verified:</span> <span className="text-green-600">Yes</span></p>}
            </div>
          </div>
        </div>

        {/* Status Update */}
        <div className="mb-6">
          <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Update Status
          </h3>
          <div className="flex flex-wrap gap-2">
            {['pending', 'in_progress', 'quoted', 'quote_issued', 'rejected'].map((status) => (
              <Button
                key={status}
                onClick={() => updateStatus(status)}
                disabled={updatingStatus || quote.status === status}
                variant={quote.status === status ? "primary" : "outline"}
                size="sm"
                className="whitespace-nowrap"
              >
                {getStatusLabel(status)}
              </Button>
            ))}
          </div>
        </div>

        {/* Quote Items with Pricing */}
        <div className="mb-6">
          <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Items & Pricing
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <th className={`text-left py-2 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    Product
                  </th>
                  <th className={`text-left py-2 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    Quantity
                  </th>
                  <th className={`text-left py-2 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    Unit Price (ZAR)
                  </th>
                  <th className={`text-left py-2 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    Total Price (ZAR)
                  </th>
                  <th className={`text-left py-2 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    Message
                  </th>
                </tr>
              </thead>
              <tbody>
                {pricingItems?.map((item: any) => (
                  <tr key={item.id} className={`border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <td className={`py-2 px-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      <div>
                        <p className="font-medium">{item.product?.title}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.product?.description}
                        </p>
                      </div>
                    </td>
                    <td className={`py-2 px-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item.quantity}
                    </td>
                    <td className="py-2 px-4">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unit_price || ''}
                        onChange={(e) => handlePricingChange(item.id, 'unit_price', e.target.value)}
                        className={`w-24 px-2 py-1 border rounded text-sm ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </td>
                    <td className={`py-2 px-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency((parseFloat(item.unit_price) || 0) * item.quantity)}
                    </td>
                    <td className={`py-2 px-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item.message ? (
                        <p className="text-sm">{item.message}</p>
                      ) : (
                        <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          No message
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Summary */}
          <div className={`mt-4 p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className="flex justify-between items-center">
              <div className={`space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <p><span className="font-medium">Subtotal:</span> {formatCurrency(subtotal)}</p>
                <p><span className="font-medium">VAT (15%):</span> {formatCurrency(vatAmount)}</p>
                <p className="text-lg font-bold">Total: {formatCurrency(total)}</p>
              </div>
              <div className="space-x-2">
                <Button 
                  onClick={updatePricing}
                  disabled={updatingPricing}
                  variant="secondary"
                  size="sm"
                >
                  {updatingPricing ? 'Updating...' : 'Update Pricing'}
                </Button>
                <Button 
                  onClick={issueQuote}
                  disabled={issuingQuote || quote.status === 'quote_issued'}
                  variant="primary"
                  size="sm"
                >
                  {issuingQuote ? 'Issuing...' : 'Issue Quote'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-4">
          {quote.notes && (
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Customer Notes
              </h3>
              <div className={`p-3 rounded-md ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{quote.notes}</p>
              </div>
            </div>
          )}

          <div>
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Admin Notes
            </h3>
            <textarea
              className={`w-full p-3 border rounded-md ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              rows={4}
              placeholder="Add admin notes here..."
              defaultValue={quote.admin_notes || ''}
            />
            <div className="mt-2">
              <Button 
                onClick={() => {
                  // TODO: Implement admin notes update
                  console.log('Update admin notes');
                }}
                variant="primary"
                size="sm"
              >
                Update Notes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteDetail; 