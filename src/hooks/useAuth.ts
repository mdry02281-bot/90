import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  level: number;
  isApproved: boolean;
  referralCode: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching user from API...');
      
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log('📡 User API Response Status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ User data from API:', data);
        
        if (data.success && data.user) {
          setUser(data.user);
          console.log('✅ User authenticated successfully');
        } else {
          setUser(null);
          console.log('❌ Invalid user data format');
        }
      } else if (response.status === 401) {
        setUser(null);
        console.log('🔒 User not authenticated');
      } else {
        const errorData = await response.json();
        console.error('❌ Failed to fetch user:', errorData);
        setError(errorData.error || 'Failed to fetch user');
      }
    } catch (err: any) {
      console.error('❌ Network error fetching user:', err);
      setUser(null);
      setError('Network error - cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔐 Attempting login...');
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 Login API Response Status:', response.status);

      const data = await response.json();
      console.log('📡 Login API Response Data:', data);

      if (data.success && data.user) {
        setUser(data.user);
        console.log('✅ Login successful');
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (err: any) {
      console.error('❌ Login error:', err);
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out...');
      
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      setUser(null);
      console.log('✅ Logout successful');
    } catch (err) {
      console.error('❌ Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        logout,
        refetch: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
