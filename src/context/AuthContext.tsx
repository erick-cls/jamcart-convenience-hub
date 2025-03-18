
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  town: string;
  isVerified: boolean;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id' | 'isVerified' | 'isAdmin'> & { password: string }) => Promise<void>;
  logout: () => void;
  verifyPhone: (code: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('jamcart-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // This is just a mock login for demo purposes
      // In a real app, this would be an API call to authenticate
      
      // For demo purposes, we'll create a fake user
      const mockUser: User = {
        id: 'user-123',
        name: 'John Doe',
        email: email,
        phone: '+1234567890',
        address: '123 Main St',
        town: 'Kingston',
        isVerified: true,
        isAdmin: email.includes('admin') // For demo, make admin if email has "admin" in it
      };
      
      setUser(mockUser);
      localStorage.setItem('jamcart-user', JSON.stringify(mockUser));
    } catch (err) {
      setError('Invalid email or password');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id' | 'isVerified' | 'isAdmin'> & { password: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      // This is just a mock registration for demo purposes
      // In a real app, this would be an API call to register the user
      
      // For demo purposes, create user but mark as not verified
      const mockUser: User = {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        town: userData.town,
        isVerified: false,
        isAdmin: false
      };
      
      setUser(mockUser);
      localStorage.setItem('jamcart-user', JSON.stringify(mockUser));
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const verifyPhone = async (code: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // This is a mock verification
      // In a real app, this would validate the code with an API
      
      if (code === '123456' || code === '000000') {  // Demo verification codes
        if (user) {
          const verifiedUser = { ...user, isVerified: true };
          setUser(verifiedUser);
          localStorage.setItem('jamcart-user', JSON.stringify(verifiedUser));
          return true;
        }
      } else {
        setError('Invalid verification code');
        return false;
      }
      return false;
    } catch (err) {
      setError('Verification failed. Please try again.');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jamcart-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, verifyPhone, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
