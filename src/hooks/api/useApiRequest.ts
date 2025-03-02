import { useState, useCallback } from 'react';

import { useApiContext } from '@/contexts/api/ApiContext';

export const useApiRequest = <T,>(endpoint: string) => {
  const { request } = useApiContext();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (method = 'GET', body?: any) => {
    setLoading(true);
    try {
      const options: RequestInit = { method }; // Set method in options
      if (body) {
        options.body = JSON.stringify(body);
        options.headers = { 'Content-Type': 'application/json' };
      }
      const result = await request<T>(endpoint, options); // Only 2 args
      setData(result);
      setError(null);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [endpoint, request]);

  return { data, loading, error, fetchData };
};