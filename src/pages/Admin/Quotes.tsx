
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const AdminQuotes: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await api.quotes.getAll();
        if (response.success) {
          setQuotes(response.data || []);
        } else {
          setError(response.message || 'Failed to fetch quotes or they do not exist');
        }
      } catch (error) {
        setError('An error occurred while fetching quotes');
        console.error('Error fetching quotes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  const handleView = (id: string) => {
    console.log('Navigating to quote:', id);
    navigate(`/admin/quotes/${id}`);
  };

  const updateStatus = async (quoteId: string, status: string) => {
    setUpdatingStatus(quoteId);
    try {
      console.log('Updating status for quote:', quoteId, 'to status:', status);
      const response = await api.quotes.updateStatus(quoteId, status);
      console.log('Update status response:', response);
      if (response.success) {
        setQuotes(prev => prev.map(q => 
          q.id === quoteId ? { ...q, status } : q
        ));
      } else {
        console.error('Failed to update status:', response.message);
        alert(`Failed to update status: ${response.message}`);
      }
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingStatus(null);
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
//fixed
  /*const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in_progress':
        return 'In Progress';
      case 'quoted':
        return 'Quoted';
      case 'quote_issued':
        return 'Quote Issued';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };*/

  if (loading) return <div>Loading quotes...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Manage Quotes
      </h1>

      <div className="overflow-x-auto">
        <table className={`min-w-full border rounded-lg ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <thead className={`${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <tr>
              <th className={`py-3 px-4 border-b text-left text-sm font-medium ${
                isDarkMode ? 'text-gray-300 border-gray-600' : 'text-gray-700 border-gray-200'
              }`}>
                Tracking Code
              </th>
              <th className={`py-3 px-4 border-b text-left text-sm font-medium ${
                isDarkMode ? 'text-gray-300 border-gray-600' : 'text-gray-700 border-gray-200'
              }`}>
                Customer
              </th>
              <th className={`py-3 px-4 border-b text-left text-sm font-medium ${
                isDarkMode ? 'text-gray-300 border-gray-600' : 'text-gray-700 border-gray-200'
              }`}>
                Items
              </th>
              <th className={`py-3 px-4 border-b text-left text-sm font-medium ${
                isDarkMode ? 'text-gray-300 border-gray-600' : 'text-gray-700 border-gray-200'
              }`}>
                Status
              </th>
              <th className={`py-3 px-4 border-b text-left text-sm font-medium ${
                isDarkMode ? 'text-gray-300 border-gray-600' : 'text-gray-700 border-gray-200'
              }`}>
                Created
              </th>
              <th className={`py-3 px-4 border-b text-left text-sm font-medium ${
                isDarkMode ? 'text-gray-300 border-gray-600' : 'text-gray-700 border-gray-200'
              }`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${
            isDarkMode ? 'divide-gray-700' : 'divide-gray-200'
          }`}>
            {quotes.map(quote => (
              <tr key={quote.id} className={`${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}>
                <td className={`py-3 px-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <span className="font-mono text-sm">{quote.tracking_code}</span>
                </td>
                <td className={`py-3 px-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <div className="font-medium">{quote.guest_name}</div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {quote.guest_email}
                  </div>
                </td>
                <td className={`py-3 px-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <span className="text-sm">{quote.quote_items?.length || 0} item(s)</span>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={quote.status}
                    onChange={(e) => updateStatus(quote.id, e.target.value)}
                    disabled={updatingStatus === quote.id}
                    className={`border rounded px-3 py-1 text-sm ${getStatusColor(quote.status)} ${
                      updatingStatus === quote.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="quoted">Quoted</option>
                    <option value="quote_issued">Quote Issued</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  {updatingStatus === quote.id && (
                    <span className={`ml-2 text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Updating...
                    </span>
                  )}
                </td>
                <td className={`py-3 px-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {new Date(quote.created_at).toLocaleDateString()}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <Button 
                    onClick={() => handleView(quote.id)} 
                    variant="outline" 
                    size="sm"
                    className={isDarkMode ? 'text-white' : ''}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminQuotes;
