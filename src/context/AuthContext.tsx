
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, RegisterUserData } from '../types/auth.types';
import { 
  loginService, 
  registerService, 
  verifyPhoneService, 
  updateUserProfileService 
} from '../services/auth.service';

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
      const loggedInUser = await loginService(email, password);
      
      setUser(loggedInUser);
      localStorage.setItem('jamcart-user', JSON.stringify(loggedInUser));
    } catch (err) {
      setError('Invalid email or password');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterUserData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newUser = await registerService(userData);
      
      setUser(newUser);
      localStorage.setItem('jamcart-user', JSON.stringify(newUser));
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const verifyPhone = async (code: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const isVerified = await verifyPhoneService(code, user);
      
      if (isVerified && user) {
        const verifiedUser = { ...user, isVerified: true };
        setUser(verifiedUser);
        localStorage.setItem('jamcart-user', JSON.stringify(verifiedUser));
      }
      
      return isVerified;
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (userData: Partial<User>): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      if (!user) {
        throw new Error('No user logged in');
      }
      
      const updatedUser = await updateUserProfileService(userData, user);
      
      localStorage.setItem('jamcart-user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err: any) {
      setError(err.message || 'Update failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jamcart-user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      verifyPhone, 
      updateUserProfile,
      loading, 
      error 
    }}>
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
