import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const AdminQuotes: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    try {
      const response = await api.quotes.updateStatus(quoteId, status);
      if (response.success) {
        setQuotes(prev => prev.map(q => 
          q.id === quoteId ? { ...q, status } : q
        ));
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  if (loading) return <div>Loading quotes...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Quotes</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Tracking Code</th>
              <th className="py-2 px-4 border-b">Customer</th>
              <th className="py-2 px-4 border-b">Items</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map(quote => (
              <tr key={quote.id}>
                <td className="py-2 px-4 border-b">{quote.tracking_code}</td>
                <td className="py-2 px-4 border-b">
                  <div>{quote.guest_name}</div>
                  <div className="text-sm text-gray-500">{quote.guest_email}</div>
                </td>
                <td className="py-2 px-4 border-b">
                  {quote.quote_items.length} item(s)
                </td>
                <td className="py-2 px-4 border-b">
                  <select
                    value={quote.status}
                    onChange={(e) => updateStatus(quote.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="quoted">Quoted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td className="py-2 px-4 border-b">
                  <Button 
                    onClick={() => handleView(quote.id)} 
                    variant="outline" 
                    size="sm"
                  >
                    View
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
