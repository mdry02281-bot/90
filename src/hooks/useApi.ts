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
  timeout?: number;
}

interface ApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  retryCount: number;
  dataSource: 'api' | 'cache' | 'offline';
}

// Simple in-memory cache with TTL
class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  set(key: string, data: any, ttl: number = 300000) { // 5 minutes default TTL
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  clear() {
    this.cache.clear();
  }
  
  delete(key: string) {
    this.cache.delete(key);
  }
}

const apiCache = new ApiCache();

// Get authentication token from cookies
function getAuthToken(): string | null {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth-token' || name === 'access_token') {
      return value;
    }
  }
  return null;
}

// Enhanced API fetch with timeout, retry, and cache
async function apiFetch<T>(
  endpoint: string, 
  options: RequestInit = {},
  timeout: number = 10000
): Promise<{ data: T; dataSource: 'api' | 'cache' | 'offline' }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    console.log(`🔍 Fetching data from API: ${endpoint}`);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
        ...(options.headers || {}),
      },
      signal: controller.signal,
      ...options,
    });

    console.log(`📡 API Response Status: ${response.status} for ${endpoint}`);

    if (response.ok) {
      const result: ApiResponse<T> = await response.json();
      console.log(`✅ API Response Data for ${endpoint}:`, result);
      
      if (result.success && result.data !== undefined) {
        // Cache successful responses
        apiCache.set(endpoint, result.data);
        console.log(`✅ Data loaded successfully from API: ${endpoint}`);
        return { data: result.data, dataSource: 'api' };
      } else {
        throw new Error(result.error || 'Invalid response format');
      }
    } else if (response.status === 401) {
      console.log(`🔒 Authentication required for ${endpoint}`);
      throw new Error('Authentication required');
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
  } catch (error: any) {
    console.error(`❌ Error fetching ${endpoint}:`, error);
    
    // Check if we're offline
    if (!navigator.onLine) {
      console.warn(`[fallback] switched to cache due to: offline mode`);
      const cached = apiCache.get(endpoint);
      if (cached) {
        return { data: cached, dataSource: 'offline' };
      }
    }
    
    // Check cache as fallback for network errors
    if (error.name === 'AbortError' || error.message.includes('fetch')) {
      console.warn(`[fallback] switched to cache due to: ${error.message}`);
      const cached = apiCache.get(endpoint);
      if (cached) {
        return { data: cached, dataSource: 'cache' };
      }
    }
    
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export function useApi<T>(
  endpoint: string,
  options: UseApiOptions = {}
): ApiResult<T> {
  const {
    immediate = true,
    retryOnError = false,
    maxRetries = 3,
    retryDelay = 1000,
    timeout = 10000,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [dataSource, setDataSource] = useState<'api' | 'cache' | 'offline'>('api');

  const fetchData = async (retryAttempt = 0): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFetch<T>(endpoint, {}, timeout);
      
      setData(result.data);
      setDataSource(result.dataSource);
      setRetryCount(0);
      
      if (result.dataSource !== 'api') {
        console.warn(`⚠️ Using ${result.dataSource} data for ${endpoint}`);
      }
      
    } catch (err: any) {
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
        setDataSource('api');
      }
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    // Clear cache for this endpoint to force fresh data
    apiCache.delete(endpoint);
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
    dataSource,
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
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: payload ? JSON.stringify(payload) : undefined,
      });

      console.log(`📡 POST API Response Status: ${response.status} for ${endpoint}`);

      const result: ApiResponse<T> = await response.json();
      console.log(`📡 POST API Response Data for ${endpoint}:`, result);

      if (response.ok && result.success) {
        console.log(`✅ POST request successful: ${endpoint}`);
        
        // Clear related cache entries after successful mutations
        apiCache.clear();
        
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

// Utility function to clear all cache
export function clearApiCache() {
  apiCache.clear();
}

// Utility function to get cache status
export function getCacheStatus() {
  return {
    size: apiCache['cache'].size,
    keys: Array.from(apiCache['cache'].keys())
  };
}
