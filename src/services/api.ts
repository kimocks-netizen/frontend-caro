import type { Quote, QuoteRequestData, QuoteResponse } from "../types/quote";
const API_BASE_URL = 'https://caro-backend-production.up.railway.app/api';

/*interface LoginData {
  email: string;
  password: string;
}*/
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
    headers
  });
  return response.json();
},

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: async <T>(endpoint: string, body: any): Promise<ApiResponse<T>> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return response.json();
  },

  // Auth endpoints
  auth: {
    login: (email: string, password: string) => {
      return api.post<LoginResponse>('/auth/login', { email, password });
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put: async <T>(endpoint: string, body: any): Promise<ApiResponse<T>> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return response.json();
},
  // Product endpoints
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
    updateStatus: (id: string, status: string) => {
      return api.put<Quote>(`/quotes/${id}/status`, { status });
    }
  },
};