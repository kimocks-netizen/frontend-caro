const API_BASE_URL = 'https://caro-backend-production.up.railway.app/api';
//or- https://caro-backend-production.up.railway.app

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const api = {
  get: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
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

  // Product endpoints
  products: {
    getAll: async () => {
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
    submit: (quoteData: {
      name: string;
      email: string;
      items: Array<{
        productId: string;
        quantity: number;
        message?: string;
      }>;
      message?: string;
    }) => {
      return api.post('/quotes', quoteData);
    },
  },
};