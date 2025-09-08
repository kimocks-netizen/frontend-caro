import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../../services/api';
import ProductCard from './ProductCard';
import { useTheme } from '../../context/ThemeContext';
//import LoadingSpinner from '../ui/LoadingSpinner';
import ProductSkeleton from '../ui/ProductSkeleton';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

// Category mapping from Admin/Products.tsx
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

const ProductGrid: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [sortBy, setSortBy] = useState('title-asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const startTime = Date.now();
      const minLoadingTime = 800; // Minimum loading time in milliseconds
      
      try {
        const response = await api.products.getAll();
        if (response.success) {
          setProducts(response.data || []);
        } else {
          setError(response.message || 'Failed to fetch products');
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError('An error occurred while fetching products');
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

  // Derive categories from loaded products - convert IDs to names
  const categoryOptions = useMemo(() => {
    const uniqueIds = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    return uniqueIds
      .map(id => ({
        id,
        name: getCategoryName(id)
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  // Derived filtered and sorted list
  const filteredAndSortedProducts = useMemo(() => {
    let list = products;

    // Search
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) =>
        (p.title || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Availability filter
    if (selectedAvailability !== 'all') {
      const shouldBeAvailable = selectedAvailability === 'available';
      list = list.filter((p) => Boolean(p.available) === shouldBeAvailable);
    }

    // Sorting
    const sorted = [...list];
    switch (sortBy) {
      case 'title-asc':
        sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'title-desc':
        sorted.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
        break;
      case 'category-asc':
        sorted.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
        break;
      case 'category-desc':
        sorted.sort((a, b) => (b.category || '').localeCompare(a.category || ''));
        break;
      default:
        break;
    }
    return sorted;
  }, [products, searchQuery, selectedCategory, selectedAvailability, sortBy]);

  // Pagination derived values
  const totalItems = filteredAndSortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  // Reset to first page when filters/search/sort/pageSize change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, selectedAvailability, sortBy, pageSize]);

  if (loading) return <ProductSkeleton count={pageSize} />;
  if (error) return (
    <div className={`text-center py-8 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>
      <div className="text-xl mb-2">⚠️</div>
      <p className="text-lg font-medium">{error}</p>
      <p className="text-sm mt-2">Please try refreshing the page</p>
    </div>
  );
  
  if (products.length === 0) return (
    <div className={`text-center py-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      <div className="text-4xl mb-4">📦</div>
      <p className="text-lg font-medium">No products available</p>
      <p className="text-sm mt-2">Check back later for new products</p>
    </div>
  );

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4`}>
      {/* Mobile Filter Button */}
      <div className="mb-4 md:hidden">
        <Button
          variant="outline"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full flex items-center justify-center gap-2"
        >
          <span>🔍</span>
          Filter & Search
          <span className={`transform transition-transform ${showMobileFilters ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </Button>
      </div>

      {/* Controls */}
      <div className={`mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end ${
        showMobileFilters ? 'block' : 'hidden md:grid'
      }`}>
        <Input
          label="Search"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select
          label="Category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          options={[{ value: 'all', label: 'All categories' }, ...categoryOptions.map((c) => ({ value: c.id, label: c.name }))]}
        />
        <Select
          label="Availability"
          value={selectedAvailability}
          onChange={(e) => setSelectedAvailability(e.target.value)}
          options={[
            { value: 'all', label: 'All' },
            { value: 'available', label: 'Available' },
            { value: 'unavailable', label: 'Unavailable' },
          ]}
        />
        <Select
          label="Sort by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          options={[
            { value: 'title-asc', label: 'Title (A → Z)' },
            { value: 'title-desc', label: 'Title (Z → A)' },
            { value: 'category-asc', label: 'Category (A → Z)' },
            { value: 'category-desc', label: 'Category (Z → A)' },
          ]}
        />
      </div>


      {/* Empty state for filters */}
      {paginatedProducts.length === 0 && totalItems === 0 ? (
        <div className={`text-center py-16 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <div className="text-4xl mb-4">🔎</div>
          <p className="text-lg font-medium">No products match your search or filters</p>
          <p className="text-sm mt-2">Try adjusting your search terms or filter selections</p>
        </div>
      ) : (
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
          {paginatedProducts.map((product) => (
            <div key={product.id} className="transform transition-all duration-300 hover:scale-80 hover:-translate-y-2 hover:shadow-xl ">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination Section */}
      {totalItems > 0 && (
        <div className="mt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Results info */}
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Showing {totalItems === 0 ? 0 : startIndex + 1}–{endIndex} of {totalItems} products
          </div>

          {/* Pagination buttons */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </Button>
              {(() => {
                const buttons: React.ReactNode[] = [];
                const maxToShow = 5;
                if (totalPages <= maxToShow) {
                  for (let i = 1; i <= totalPages; i++) {
                    const isActive = i === currentPage;
                    buttons.push(
                      <Button
                        key={i}
                        variant={isActive ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => setPage(i)}
                      >
                        {i}
                      </Button>
                    );
                  }
                } else {
                  const addButton = (i: number) => {
                    const isActive = i === currentPage;
                    buttons.push(
                      <Button
                        key={i}
                        variant={isActive ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => setPage(i)}
                      >
                        {i}
                      </Button>
                    );
                  };

                  addButton(1);
                  if (currentPage > 3) {
                    buttons.push(<span key="start-ellipsis" className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>…</span>);
                  }
                  const start = Math.max(2, currentPage - 1);
                  const end = Math.min(totalPages - 1, currentPage + 1);
                  for (let i = start; i <= end; i++) addButton(i);
                  if (currentPage < totalPages - 2) {
                    buttons.push(<span key="end-ellipsis" className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>…</span>);
                  }
                  addButton(totalPages);
                }
                return buttons;
              })()}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}

          {/* Page size selector */}
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Show:</span>
            <select
              value={String(pageSize)}
              onChange={(e) => setPageSize(parseInt(e.target.value) || 8)}
              className={`px-2 py-1 border rounded text-sm ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="4">4</option>
              <option value="8">8</option>
              <option value="12">12</option>
              <option value="16">16</option>
              <option value="24">24</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;