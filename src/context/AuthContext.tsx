
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
  isRider: boolean;
  userType: 'customer' | 'rider' | 'admin';
  dateJoined?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id' | 'isVerified' | 'isAdmin' | 'isRider' | 'userType'> & { password: string, userType: string }) => Promise<void>;
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
      
      // Check if we have a stored password for this user
      const storedPassword = localStorage.getItem(`jamcart-password-${email}`);
      
      // Special case for ericksonvilleta@gmail.com
      if (email === 'ericksonvilleta@gmail.com') {
        if (password === 'P@ssw0rdnimda' || (storedPassword && password === storedPassword)) {
          const adminUser: User = {
            id: 'admin-123',
            name: 'Erickson Villeta',
            email: email,
            phone: '+1234567890',
            address: '123 Admin St',
            town: 'Kingston',
            isVerified: true,
            isAdmin: true,
            isRider: false,
            userType: 'admin',
            dateJoined: new Date().toISOString()
          };
          
          setUser(adminUser);
          localStorage.setItem('jamcart-user', JSON.stringify(adminUser));
          setLoading(false);
          return;
        } else {
          throw new Error('Invalid password');
        }
      }
      
      // Special case for rider account
      if (email === 'rider@jamcart.com') {
        if (password === 'rider123' || (storedPassword && password === storedPassword)) {
          const riderUser: User = {
            id: 'rider-123',
            name: 'John Rider',
            email: email,
            phone: '+1234567890',
            address: '123 Rider St',
            town: 'Kingston',
            isVerified: true,
            isAdmin: false,
            isRider: true,
            userType: 'rider',
            dateJoined: new Date().toISOString()
          };
          
          setUser(riderUser);
          localStorage.setItem('jamcart-user', JSON.stringify(riderUser));
          setLoading(false);
          return;
        } else {
          throw new Error('Invalid password');
        }
      }
      
      // Look for registered users in localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('jamcart-user-')) {
          try {
            const userData = JSON.parse(localStorage.getItem(key) || '{}');
            if (userData.email === email) {
              // Check password if there's a stored password
              const userPassword = localStorage.getItem(`jamcart-password-${email}`);
              if (userPassword && password !== userPassword) {
                throw new Error('Invalid password');
              }
              
              setUser(userData);
              localStorage.setItem('jamcart-user', JSON.stringify(userData));
              setLoading(false);
              return;
            }
          } catch (error) {
            console.error('Error checking registered user', error);
          }
        }
      }
      
      // For demo purposes, we'll create a fake user for other emails
      const mockUser: User = {
        id: 'user-123',
        name: 'John Doe',
        email: email,
        phone: '+1234567890',
        address: '123 Main St',
        town: 'Kingston',
        isVerified: true,
        // Make ericksonvilleta@gmail.com admin by default, also keep admin if email contains "admin"
        isAdmin: email === 'ericksonvilleta@gmail.com' || email.includes('admin'),
        isRider: email.includes('rider'),
        userType: email.includes('admin') ? 'admin' : (email.includes('rider') ? 'rider' : 'customer'),
        dateJoined: new Date().toISOString()
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

  const register = async (userData: Omit<User, 'id' | 'isVerified' | 'isAdmin' | 'isRider' | 'userType'> & { password: string, userType: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      // Special case for ericksonvilleta@gmail.com
      if (userData.email === 'ericksonvilleta@gmail.com' && userData.password !== 'P@ssw0rdnimda') {
        setError('This email requires a specific password');
        setLoading(false);
        return;
      }
      
      // This is just a mock registration for demo purposes
      // In a real app, this would be an API call to register the user
      
      // For demo purposes, create user but mark as not verified
      const isAdmin = userData.userType === 'admin' || userData.email === 'ericksonvilleta@gmail.com';
      const isRider = userData.userType === 'rider' || userData.email.includes('rider');
      const userId = 'user-' + Math.random().toString(36).substr(2, 9);
      
      const mockUser: User = {
        id: userId,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        town: userData.town,
        isVerified: false,
        isAdmin: isAdmin,
        isRider: isRider,
        userType: userData.userType as 'customer' | 'rider' | 'admin',
        dateJoined: new Date().toISOString()
      };
      
      // Store the user in localStorage for persistence
      localStorage.setItem(`jamcart-user-${userId}`, JSON.stringify(mockUser));
      // Store the password
      localStorage.setItem(`jamcart-password-${userData.email}`, userData.password);
      
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
