import React,{useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
//import Button from '../../components/ui/Button';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to admin dashboard if someone tries to access /
    navigate('/admin/dashboard');
  }, [navigate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          className="p-6 border rounded-lg cursor-pointer hover:bg-gray-50"
          onClick={() => navigate('/admin/products')}
        >
          <h2 className="text-xl font-semibold mb-2">Manage Products</h2>
          <p>Add, edit, or remove products from your catalog</p>
        </div>
        <div 
          className="p-6 border rounded-lg cursor-pointer hover:bg-gray-50"
          onClick={() => navigate('/admin/quotes')}
        >
          <h2 className="text-xl font-semibold mb-2">Manage Quotes</h2>
          <p>View and respond to customer quote requests</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;