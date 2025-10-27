import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - adds retry logic
apiClient.interceptors.request.use(
  (config) => {
    // Add any request preprocessing here
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handles auth errors and retries
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized and hasn't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the session
        await apiClient.post('/auth/refresh');
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      // You might want to show a toast/notification here
    }

    return Promise.reject(error);
  }
);

export default apiClient;