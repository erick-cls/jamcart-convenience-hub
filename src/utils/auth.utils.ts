
import { User, RegisterUserData } from '../types/auth.types';

// Helper function to get a stored user by email
export const getStoredUserByEmail = (email: string): User | null => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('jamcart-user-')) {
      try {
        const userData = JSON.parse(localStorage.getItem(key) || '{}');
        if (userData.email === email) {
          return userData;
        }
      } catch (error) {
        console.error('Error checking registered user', error);
      }
    }
  }
  return null;
};

// Helper function to create a mock user for demo purposes
export const createMockUser = (email: string): User => {
  return {
    id: 'user-123',
    name: 'John Doe',
    email: email,
    phone: '+1234567890',
    address: '123 Main St',
    town: 'Kingston',
    isVerified: true,
    isAdmin: email === 'ericksonvilleta@gmail.com' || email.includes('admin'),
    isRider: email.includes('rider'),
    userType: email.includes('admin') ? 'admin' : (email.includes('rider') ? 'rider' : 'customer'),
    dateJoined: new Date().toISOString()
  };
};

// Helper function to create admin user
export const createAdminUser = (email: string): User => {
  return {
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
};

// Helper function to create rider user
export const createRiderUser = (email: string): User => {
  return {
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
};

// Helper function to generate a unique user ID
export const generateUserId = (): string => {
  return 'user-' + Math.random().toString(36).substr(2, 9);
};

// Helper function to create an address array from initial address
export const createInitialAddresses = (address: string): { type: string; address: string }[] => {
  return [{
    type: 'home',
    address: address
  }];
};

// Helper function to create a new user from registration data
export const createNewUser = (userData: RegisterUserData, userId: string): User => {
  const isAdmin = userData.userType === 'admin' || userData.email === 'ericksonvilleta@gmail.com';
  const isRider = userData.userType === 'rider' || userData.email.includes('rider');
  
  const addresses = createInitialAddresses(userData.address);

  return {
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
    dateJoined: new Date().toISOString(),
    cardInfo: userData.cardInfo,
    addresses: addresses
  };
};
