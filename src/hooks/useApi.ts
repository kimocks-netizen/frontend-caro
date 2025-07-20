//useApi.ts
import { useState } from 'react';

type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiOptions {
  method?: ApiMethod;
  headers?: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export const useApi = <T>() => {
  const [response, setResponse] = useState<ApiResponse<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const callApi = async (
    url: string,
    options: ApiOptions = { method: 'GET' }
  ): Promise<ApiResponse<T>> => {
    setResponse({ data: null, error: null, loading: true });

    try {
      const res = await fetch(url, {
        method: options.method,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      setResponse({ data, error: null, loading: false });
      return { data, error: null, loading: false };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setResponse({ data: null, error: errorMessage, loading: false });
      return { data: null, error: errorMessage, loading: false };
    }
  };

  return { ...response, callApi };
};