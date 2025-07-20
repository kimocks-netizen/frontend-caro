import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Button from '../../components/ui/Button';



const AdminProducts: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);


  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    category: '',
    price_range: ''
  });

  const handleDelete = async (id: string) => {
    try {
      const response = await api.products.delete(id);
      if (response.success) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdate = async (id: string, productData: any) => {
    try {
      const response = await api.products.update(id, productData);
      if (response.success) {
        setProducts(products.map(p => p.id === id ? response.data : p));
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const response = await api.products.create(newProduct);
      if (response.success) {
        setProducts([response.data, ...products]);
        setIsAddModalOpen(false);
        setNewProduct({
          title: '',
          description: '',
          category: '',
          price_range: ''
        });
      }
    } catch (error) {
      console.error('Add product failed:', error);
    }
  };

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
        <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
          Add Product
        </Button>
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
                   <Button
                      onClick={() =>
                        handleUpdate(product.id, {
                          ...product,
                          title: product.title + ' (Edited)' // Example update
                        })
                      }
                      variant="outline"
                      size="sm"
                    >
                      Edit
                  </Button>
                    <Button 
                      onClick={() => handleDelete(product.id)} 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500"
                    >
                      Delete
                    </Button> 
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                className="w-full border p-2 rounded"
                value={newProduct.title}
                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
              />
              <input
                type="text"
                placeholder="Description"
                className="w-full border p-2 rounded"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
              <input
                type="text"
                placeholder="Category"
                className="w-full border p-2 rounded"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              />
              <input
                type="text"
                placeholder="Price Range"
                className="w-full border p-2 rounded"
                value={newProduct.price_range}
                onChange={(e) => setNewProduct({ ...newProduct, price_range: e.target.value })}
              />
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <Button onClick={handleAddProduct}>Save</Button>
              <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
