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

  useEffect(() => {
    if (id) {
      fetchQuote();
    }
  }, [id]);

  const fetchQuote = async () => {
    try {
      // Since we don't have a getById endpoint, we'll fetch all quotes and find the one we need
      const response = await api.quotes.getAll();
      if (response.success && response.data) {
        const foundQuote = response.data.find((q: any) => q.id === id);
        if (foundQuote) {
          setQuote(foundQuote);
        } else {
          setError('Quote not found');
        }
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
      } else {
        console.error('Failed to update status:', response.message);
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdatingStatus(false);
    }
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="inline-flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading quote details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
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
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Quote not found</p>
          <Button onClick={() => navigate('/admin/quotes')} variant="primary">
            Back to Quotes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quote Details</h1>
        <Button onClick={() => navigate('/admin/quotes')} variant="outline">
          Back to Quotes
        </Button>
      </div>

      <div className={`rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
        {/* Quote Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Quote Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Tracking Code:</span> <span className="font-mono">{quote.tracking_code}</span></p>
              <p><span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-sm ${getStatusColor(quote.status)}`}>
                  {getStatusLabel(quote.status)}
                </span>
              </p>
              <p><span className="font-medium">Created:</span> {new Date(quote.created_at).toLocaleDateString()}</p>
              <p><span className="font-medium">Updated:</span> {new Date(quote.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">Customer Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {quote.guest_name}</p>
              <p><span className="font-medium">Email:</span> {quote.guest_email}</p>
              {quote.verified && <p><span className="font-medium">Verified:</span> <span className="text-green-600">Yes</span></p>}
            </div>
          </div>
        </div>

        {/* Status Update */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Update Status</h3>
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

        {/* Quote Items */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Items Requested</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <th className="text-left py-2 px-4">Product</th>
                  <th className="text-left py-2 px-4">Quantity</th>
                  <th className="text-left py-2 px-4">Message</th>
                </tr>
              </thead>
              <tbody>
                {quote.quote_items?.map((item: any) => (
                  <tr key={item.id} className={`border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <td className="py-2 px-4">
                      <div>
                        <p className="font-medium">{item.product?.title}</p>
                        <p className="text-sm text-gray-500">{item.product?.description}</p>
                      </div>
                    </td>
                    <td className="py-2 px-4">{item.quantity}</td>
                    <td className="py-2 px-4">
                      {item.message ? (
                        <p className="text-sm">{item.message}</p>
                      ) : (
                        <span className="text-gray-400 text-sm">No message</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-4">
          {quote.notes && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Customer Notes</h3>
              <div className={`p-3 rounded-md ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p>{quote.notes}</p>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-2">Admin Notes</h3>
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