import type { Quote, QuoteRequestData, QuoteResponse } from "../types/quote";
const API_BASE_URL = 'https://caro-backend-h1rh.onrender.com/api';
//const API_BASE_URL = 'https://caro-backend-production.up.railway.app/api'; 
//const API_BASE_URL = 'http://localhost:3000/api';

export type Product = {
  id: string;
  title: string;
  description: string;
  image_url: string[];
  category: string;
  available: boolean;
  price_range?: string;
};
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

interface LoginResponse {
  token: string;
  admin: {
    id: string;
    email: string;
    name: string;
  };
}

export const api = {
  // Base HTTP methods
    get: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    const token = localStorage.getItem('adminToken');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      cache: 'no-cache' // Prevent caching
    });
    return response.json();
  },
  // In api.ts
   delete: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    const token = localStorage.getItem('adminToken');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers
    });

    return response.json();
  },
  // Auth endpoints
 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: async <T>(endpoint: string, body: any): Promise<ApiResponse<T>> => {
    const token = localStorage.getItem('adminToken');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    return response.json();
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put: async <T>(endpoint: string, body: any): Promise<ApiResponse<T>> => {
    const token = localStorage.getItem('adminToken');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    console.log('PUT request to:', `${API_BASE_URL}${endpoint}`, 'with body:', body);
    console.log('Headers:', headers);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    
    console.log('Response status:', response.status);
    const responseData = await response.json();
    console.log('Response data:', responseData);
    
    return responseData;
  },
   auth: {
    login: (email: string, password: string) => {
      return api.post<LoginResponse>('/auth/login', { email, password });
    },
  },
  
  // Product endpoints
// Update the products section in api.ts
products: {
  getAll: () => {
    return api.get<Array<{
      id: string;
      title: string;
      description: string;
      image_url: string[];
      category: string;
      available: boolean;
      price_range?: string;
    }>>('/products');
  },
  getById: (id: string) => {
    return api.get<{
      id: string;
      title: string;
      description: string;
      image_url: string[];
      category: string;
      available: boolean;
      price_range?: string;
    }>(`/products/${id}`);
  },
  create: async (productData: Omit<Product, 'id'>) => {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Authentication required');

    // Ensure image_url is properly formatted as an array
    const payload = {
      ...productData,
      image_url: Array.isArray(productData.image_url) 
        ? productData.image_url 
        : productData.image_url ? [productData.image_url] : []
    };

    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }

      return await response.json();
    } catch (error) {
      console.error('Product creation error:', error);
      throw error;
    }
  },
   
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: (id: string, productData: any) => {
    return api.put<{
      id: string;
      title: string;
      description: string;
      image_url: string[];
      category: string;
      available: boolean;
      price_range?: string;
    }>(`/products/${id}`, productData);
  },
  delete: (id: string) => {
    return api.delete<{ success: boolean }>(`/products/${id}`);
  }
},

  // Quote endpoints
  quotes: {
    submit: (quoteData: QuoteRequestData) => {
      return api.post<QuoteResponse>('/quotes', quoteData);
    },
    getByTracking: (trackingCode: string) => {
      return api.get<Quote>(`/quotes/${trackingCode}`);
    },
    getAll: () => {
      return api.get<Quote[]>('/quotes');
    },
    getById: (id: string) => {
      return api.get<Quote>(`/quotes/admin/${id}`);
    },
    updateStatus: (id: string, status: string) => {
      console.log('API: Updating status for quote', id, 'to', status);
      return api.put<Quote>(`/quotes/${id}/status`, { status });
    },
    updatePricing: (id: string, items: Array<{id: string, unit_price: number, quantity: number}>) => {
      return api.put<Quote>(`/quotes/${id}/pricing`, { items });
    },
    issueQuote: (id: string, items?: Array<{id: string, unit_price: number, quantity: number}>) => {
      return api.put<Quote>(`/quotes/${id}/issue`, { items });
    }
  },
};