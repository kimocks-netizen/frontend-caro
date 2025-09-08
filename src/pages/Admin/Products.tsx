import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import FileInput from '../../components/ui/FileInput';
import { uploadProductImages, deleteProductImage } from '../../services/supabase';
import { useTheme } from '../../context/ThemeContext';
//import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ProductSkeleton from '../../components/ui/ProductSkeleton';
//import { supabase, uploadProductImages, deleteProductImage } from '../../services/supabase';

type Product = {
  id: string;
  title: string;
  description: string;
 image_url: (string | File)[]; // Allow both strings (URLs) and Files (temporary)
  category: string;
  available: boolean;
  price_range?: string;
};
// In your API types file (or at the top of your component)
type APIProduct = {
  id: string;
  title: string;
  description: string;
  image_url: string[]; // Only strings for the API
  category: string;
  available: boolean;
  price_range?: string;
};

type LocalProduct = {
  id: string;
  title: string;
  description: string;
  image_url: (string | File)[]; // Allows both for local state
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
  { id: '6', name: 'Oil Machinery' }
];

// Helper function to get category name by ID
const getCategoryName = (categoryId: string): string => {
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.name : categoryId; // Fallback to ID if not found
};

const AdminProducts: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  //const [products, setProducts] = useState<Product[]>([]);
  //const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [currentProduct, setCurrentProduct] = useState<LocalProduct | null>(null);
  const [products, setProducts] = useState<APIProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const startTime = Date.now();
      const minLoadingTime = 800; // Minimum loading time in milliseconds
      
      try {
        const response = await api.products.getAll();
        if (response.success) {
          setProducts(response.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
        setError('Failed to fetch products');
      } finally {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
        setTimeout(() => {
          setLoading(false);
        }, remainingTime);
      }
    };
    fetchProducts();
  }, []);
  
  useEffect(() => {
  return () => {
    // Clean up any object URLs when component unmounts
    currentProduct?.image_url.forEach(item => {
      if (item instanceof File) {
        const objectUrl = URL.createObjectURL(item);
        URL.revokeObjectURL(objectUrl);
      }
    });
  };
}, [currentProduct]);

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
// handleSubmit
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!currentProduct) return;

  try {
    setLoading(true);
    setError('');

    // 1. Upload new files and get their URLs
    const files = currentProduct.image_url
      .filter((item): item is File => item instanceof File);
    
    const uploadedUrls = files.length > 0
      ? await uploadProductImages(
          files as unknown as FileList,
          currentProduct.id || 'temp',
          (progress) => setImageUploadProgress(progress)
        )
      : [];

    // 2. Combine existing URLs with new ones
    const existingUrls = currentProduct.image_url
      .filter((item): item is string => typeof item === 'string');
    
    const allImageUrls = [...existingUrls, ...uploadedUrls];

    // 3. Prepare API payload (using APIProduct type)
    const apiPayload: Omit<APIProduct, 'id'> = {
      title: currentProduct.title,
      description: currentProduct.description,
      image_url: allImageUrls,
      category: currentProduct.category,
      available: currentProduct.available,
      price_range: currentProduct.price_range,
    };

    // 4. Call API
    const response = currentProduct.id
      ? await api.products.update(currentProduct.id, apiPayload)
      : await api.products.create(apiPayload);

    if (response.success) {
      // Update state with the API response (which has proper string[] for image_url)
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
    const filesArray = Array.from(files);
    
    // Update state with new files
    setCurrentProduct(prev => {
      if (!prev) return null;
      return {
        ...prev,
        image_url: [...prev.image_url, ...filesArray]
      };
    });
  } catch (error) {
    console.error('Image upload failed:', error);
    setError('Failed to upload images');
  } finally {
    setLoading(false);
  }
};
  const handleRemoveImage = async (index: number) => {
    if (!currentProduct || loading) return;
    
    const urlToRemove = currentProduct.image_url[index];
    
    try {
      setLoading(true);
      
      // Only delete from storage if it's a Supabase URL
    if (typeof urlToRemove === 'string' && urlToRemove.includes('supabase.co')) {
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

  if (loading && !isModalOpen) return <ProductSkeleton count={6} />;
  
  if (error) return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className={`text-center py-8 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>
        <div className="text-xl mb-2">⚠️</div>
        <p className="text-lg font-medium">{error}</p>
        <p className="text-sm mt-2">Please try refreshing the page</p>
      </div>
    </div>
  );

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Manage Products</h1>
        <Button onClick={handleAdd} variant="primary">Add Product</Button>
      </div>

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
              <th className={`py-2 px-4 border-b text-left text-sm font-medium ${
                isDarkMode ? 'text-gray-300 border-gray-600' : 'text-gray-700 border-gray-200'
              }`}>
                Product
              </th>
              <th className={`py-2 px-4 border-b text-left text-sm font-medium ${
                isDarkMode ? 'text-gray-300 border-gray-600' : 'text-gray-700 border-gray-200'
              }`}>
                Category
              </th>
              <th className={`py-2 px-4 border-b text-left text-sm font-medium ${
                isDarkMode ? 'text-gray-300 border-gray-600' : 'text-gray-700 border-gray-200'
              }`}>
                Price Range
              </th>
              <th className={`py-2 px-4 border-b text-left text-sm font-medium ${
                isDarkMode ? 'text-gray-300 border-gray-600' : 'text-gray-700 border-gray-200'
              }`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${
            isDarkMode ? 'divide-gray-700' : 'divide-gray-200'
          }`}>
            {products.map(product => (
              <tr key={product.id} className={`${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}>
                <td className={`py-2 px-4 border-b ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <div className="flex items-center">
                    {product.image_url[0] && typeof product.image_url[0] === 'string' && (
                      <img 
                        src={product.image_url[0]} 
                        alt={product.title}
                        className="w-10 h-10 object-cover mr-3"
                      />
                    )}
                    <div>
                      <div className="font-medium">{product.title}</div>
                      <div className={`text-sm line-clamp-1 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {product.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className={`py-2 px-4 border-b ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {getCategoryName(product.category)}
                </td>
                <td className={`py-2 px-4 border-b ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {product.price_range || '-'}
                </td>
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
             title={currentProduct?.id ? 'Edit Product' : 'Add Product'}
             size="md">
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
                {currentProduct.image_url.map((item, index) => {
                  // Handle File objects by creating object URLs
                  if (item instanceof File) {
                    const objectUrl = URL.createObjectURL(item);
                    return (
                      <div key={index} className="relative">
                        <img 
                          src={objectUrl}
                          alt={`Product preview ${index}`}
                          className="w-20 h-20 object-cover rounded"
                          onLoad={() => URL.revokeObjectURL(objectUrl)} // Clean up memory
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
                    );
                  }
                  
                  // Handle string URLs
                  return (
                    <div key={index} className="relative">
                      <img 
                        src={item}
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
                  );
                })}
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

            <div className="flex justify-end space-x-2">
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