import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import FileInput from '../../components/ui/FileInput';
import { uploadProductImages, deleteProductImage } from '../../services/supabase';

type Product = {
  id: string;
  title: string;
  description: string;
  image_url: string[];
  category: string;
  available: boolean;
  price_range?: string;
};

const categories = [
  { id: '1', name: 'Packing Bags' },
  { id: '2', name: 'Hardware' },
  { id: '3', name: 'Grinding Mills' },
  { id: '4', name: 'Electric Cables' },
  { id: '5', name: 'Equipment' },
];

const AdminProducts: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.products.getAll();
        if (response.success) {
          setProducts(response.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!currentProduct) return;

  try {
    setLoading(true);
    setError('');

    // First create the product without images if it's new
    let response;
    if (!currentProduct.id) {
      response = await api.products.create({
        ...currentProduct,
        image_url: [] // Start with empty array for new products
      });
    } else {
      response = await api.products.update(currentProduct.id, currentProduct);
    }

    if (response.success && response.data) {
      const productId = response.data.id;

      // Handle image uploads if there are any temporary images
      if (currentProduct.image_url.some(url => url.startsWith('data:'))) {
        const files = await Promise.all(
          currentProduct.image_url
            .filter(url => url.startsWith('data:'))
            .map(async (dataUrl) => {
              const res = await fetch(dataUrl);
              const blob = await res.blob();
              return new File([blob], `image-${Date.now()}.jpg`, { type: blob.type });
            })
        );

        if (files.length > 0) {
          const uploadedUrls = await uploadProductImages(
            files as unknown as FileList,
            productId,
            (progress) => setImageUploadProgress(progress)
          );
          
          // Update product with permanent URLs
          await api.products.update(productId, {
            image_url: uploadedUrls
          });
          response.data.image_url = uploadedUrls;
        }
      }

      // Update UI state
      setProducts(prev => 
        currentProduct.id 
          ? prev.map(p => p.id === currentProduct.id ? response.data : p)
          : [response.data, ...prev]
      );
      setIsModalOpen(false);
    }
  } catch (error) {
    console.error('Product save failed:', error);
    setError(error instanceof Error ? error.message : 'Failed to save product');
  } finally {
    setLoading(false);
    setImageUploadProgress(0);
  }
};

  const handleImageUpload = async (files: FileList) => {
    if (!currentProduct || loading) return;

    try {
      setLoading(true);
      
      // For new products, store temporary data URLs
      if (!currentProduct.id) {
        const imageUrls = await Promise.all(
          Array.from(files).map(file => {
            return new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target?.result as string);
              reader.readAsDataURL(file);
            });
          })
        );
        setCurrentProduct(prev => ({
          ...prev!,
          image_url: [...prev!.image_url, ...imageUrls]
        }));
        return;
      }

      // For existing products, upload immediately
      setImageUploadProgress(0);
      const uploadedUrls = await uploadProductImages(
        files, 
        currentProduct.id,
        (progress) => setImageUploadProgress(progress)
      );
      setCurrentProduct(prev => ({
        ...prev!,
        image_url: [...prev!.image_url, ...uploadedUrls]
      }));
    } catch (error) {
      console.error('Image upload failed:', error);
      setError('Failed to upload images');
    } finally {
      setLoading(false);
      setImageUploadProgress(0);
    }
  };

  const handleRemoveImage = async (index: number) => {
    if (!currentProduct || loading) return;
    
    const urlToRemove = currentProduct.image_url[index];
    
    try {
      setLoading(true);
      
      // Only delete from storage if it's a Supabase URL
      if (urlToRemove.includes('supabase.co')) {
        await deleteProductImage(urlToRemove);
      }
      
      setCurrentProduct(prev => ({
        ...prev!,
        image_url: prev!.image_url.filter((_, i) => i !== index)
      }));
    } catch (error) {
      console.error('Failed to remove image:', error);
      setError('Failed to remove image');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentProduct({
      id: '',
      title: '',
      description: '',
      image_url: [],
      category: '',
      available: true,
      price_range: ''
    });
    setIsModalOpen(true);
  };

  const handleInputChange = <K extends keyof Product>(field: K, value: Product[K]) => {
    setCurrentProduct(prev => {
      if (!prev) return null;
      return { ...prev, [field]: value };
    });
  };

  if (loading && !isModalOpen) return <div>Loading products...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Button onClick={handleAdd} variant="primary">Add Product</Button>
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
                    <Button onClick={() => handleEdit(product)} variant="outline" size="sm">Edit</Button>
                    <Button onClick={() => handleDelete(product.id)} variant="ghost" size="sm" className="text-red-500">Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} 
             title={currentProduct?.id ? 'Edit Product' : 'Add Product'}>
        {currentProduct && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <FileInput
              label="Product Images"
              onChange={handleImageUpload}
              multiple
              accept="image/*"
              disabled={loading}
            />

            {imageUploadProgress > 0 && imageUploadProgress < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full" 
                  style={{ width: `${imageUploadProgress}%` }}
                ></div>
              </div>
            )}

            {currentProduct.image_url.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentProduct.image_url.map((url, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={url} 
                      alt={`Product preview ${index}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      disabled={loading}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Input
              label="Title"
              value={currentProduct.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
              disabled={loading}
            />
            <Input
              label="Description"
              value={currentProduct.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
              disabled={loading}
            />
            <Select
              label="Category"
              value={currentProduct.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
              required
              disabled={loading}
            />
            <Input
              label="Price Range"
              value={currentProduct.price_range || ''}
              onChange={(e) => handleInputChange('price_range', e.target.value)}
              disabled={loading}
            />

            {error && <p className="text-red-500">{error}</p>}

            <div className="mt-4 flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsModalOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                disabled={loading || imageUploadProgress > 0}
              >
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default AdminProducts;