import { useState, useEffect } from 'react';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface UseApiOptions {
  immediate?: boolean;
  retryOnError?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

export function useApi<T>(
  endpoint: string,
  options: UseApiOptions = {}
) {
  const {
    immediate = true,
    retryOnError = false,
    maxRetries = 3,
    retryDelay = 1000,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = async (retryAttempt = 0): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔍 Fetching data from API: ${endpoint} (attempt ${retryAttempt + 1})`);
      
      const response = await fetch(endpoint, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log(`📡 API Response Status: ${response.status} for ${endpoint}`);

      if (response.ok) {
        const result: ApiResponse<T> = await response.json();
        console.log(`✅ API Response Data for ${endpoint}:`, result);
        
        if (result.success && result.data !== undefined) {
          setData(result.data);
          setRetryCount(0);
          console.log(`✅ Data loaded successfully from API: ${endpoint}`);
        } else {
          throw new Error(result.error || 'Invalid response format');
        }
      } else if (response.status === 401) {
        console.log(`🔒 Authentication required for ${endpoint}`);
        setError('Authentication required');
        setData(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
    } catch (err: any) {
      console.error(`❌ Error fetching ${endpoint}:`, err);
      
      const errorMessage = err.message || 'Network error';
      setError(errorMessage);
      
      // Retry logic
      if (retryOnError && retryAttempt < maxRetries) {
        console.log(`🔄 Retrying ${endpoint} in ${retryDelay}ms...`);
        setTimeout(() => {
          setRetryCount(retryAttempt + 1);
          fetchData(retryAttempt + 1);
        }, retryDelay);
      } else {
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    setRetryCount(0);
    fetchData(0);
  };

  useEffect(() => {
    if (immediate) {
      fetchData(0);
    }
  }, [endpoint, immediate]);

  return {
    data,
    loading,
    error,
    refetch,
    retryCount,
  };
}

// Hook for POST requests
export function useApiMutation<T, P = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (endpoint: string, payload?: P): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔍 POST request to API: ${endpoint}`);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload ? JSON.stringify(payload) : undefined,
      });

      console.log(`📡 POST API Response Status: ${response.status} for ${endpoint}`);

      const result: ApiResponse<T> = await response.json();
      console.log(`📡 POST API Response Data for ${endpoint}:`, result);

      if (response.ok && result.success) {
        console.log(`✅ POST request successful: ${endpoint}`);
        return result.data || null;
      } else {
        throw new Error(result.error || `HTTP ${response.status}`);
      }
    } catch (err: any) {
      console.error(`❌ POST Error for ${endpoint}:`, err);
      setError(err.message || 'Network error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    loading,
    error,
  };
}
