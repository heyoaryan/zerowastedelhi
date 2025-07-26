import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  totalWaste: number;
  rewardPoints: number;
  joinedDate: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      // Verify token is still valid by making a test request
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          setUser(JSON.parse(savedUser));
        } else {
          // Token is invalid, clear storage
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('sessionId');
        }
      })
      .catch(() => {
        // Network error or server down, keep user logged in locally
        setUser(JSON.parse(savedUser));
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      console.log('🔐 Attempting login to:', `${API_BASE_URL}/api/auth/login`);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Login successful:', data.user.name);
        
        const user: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          phone: '+91 00000 00000',
          avatar: '👤',
          totalWaste: data.user.totalWasteCollected || 0,
          rewardPoints: data.user.points || 0,
          joinedDate: new Date().toISOString().split('T')[0]
        };
        
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', data.token); // Store JWT token
        
        console.log('✅ User data and token saved to localStorage');
        setLoading(false);
        return true;
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        console.error('❌ Login failed:', errorData.message);
        alert(`Login failed: ${errorData.message}`);
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      alert('Unable to connect to server. Please check if backend is running on port 5000.');
      setLoading(false);
      return false;
    }
  };

  // Helper function to generate name from email
  const getUserNameFromEmail = (email: string): string => {
    const username = email.split('@')[0];
    // Convert email username to proper name format
    return username
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  };

  const signup = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      console.log('📝 Attempting signup to:', `${API_BASE_URL}/api/auth/register`);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, password }),
      });

      console.log('Signup response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Signup successful:', data.user.name);
        
        const user: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          phone: phone || '+91 00000 00000',
          avatar: '👤',
          totalWaste: data.user.totalWasteCollected || 0,
          rewardPoints: data.user.points || 0,
          joinedDate: new Date().toISOString().split('T')[0]
        };
        
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', data.token); // Store JWT token
        
        console.log('✅ User data and token saved to localStorage');
        setLoading(false);
        return true;
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Signup failed' }));
        console.error('❌ Signup failed:', errorData.message);
        
        // Show detailed validation errors if available
        if (errorData.errors && errorData.errors.length > 0) {
          const errorMessages = errorData.errors.map(error => error.msg).join('\n');
          alert(`Signup failed:\n${errorMessages}`);
        } else {
          alert(`Signup failed: ${errorData.message}`);
        }
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('❌ Signup error:', error);
      alert('Unable to connect to server. Please check if backend is running on port 5000.');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('sessionId');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};