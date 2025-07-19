import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Button from '../../components/ui/Button';
//import Input from '../../ui/Input';

const AdminProducts: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* const handleDelete = async (id: string) => {
    try {
      await api.products.delete(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleEdit = (product: Product) => {
    // Implement edit modal or navigate to edit page
  };*/

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.products.getAll();
        if (response.success) {
          setProducts(response.data || []);
        } else {
          setError(response.message || 'Failed to fetch products');
        }
      } catch (error) {
        setError('An error occurred while fetching products');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Button variant="primary">Add Product</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Product</th>
              <th className="py-2 px-4 border-b">Category</th>
              <th className="py-2 px-4 border-b">Price Range</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td className="py-2 px-4 border-b">
                  <div className="flex items-center">
                    {product.image_url?.[0] && (
                      <img 
                        src={product.image_url[0]} 
                        alt={product.title}
                        className="w-10 h-10 object-cover mr-3"
                      />
                    )}
                    <div>
                      <div className="font-medium">{product.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                    </div>
                  </div>
                </td>
                <td className="py-2 px-4 border-b">{product.category}</td>
                <td className="py-2 px-4 border-b">{product.price_range || '-'}</td>
                <td className="py-2 px-4 border-b">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    {/*<Button 
                      onClick={() => handleEdit(product)} 
                      variant="outline" 
                      size="sm"
                    >
                      Edit
                    </Button>*/}
                    <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                    {/**<Button 
                      onClick={() => handleDelete(product.id)} 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500"
                    >
                      Delete
                    </Button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;