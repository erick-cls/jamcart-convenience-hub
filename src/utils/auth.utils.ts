
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
  // Check if this is one of our specific vendor emails
  if (email === 'deonroy@gmail.com' || email === 'deonroy.mitchell@example.com') {
    return {
      id: 'vendor-deonroy',
      name: 'Deonroy Mitchell',
      email: email,
      phone: '+1876123456',
      address: '45 Hope Road',
      town: 'Kingston',
      isVerified: true,
      isAdmin: false,
      isRider: false,
      userType: 'vendor',
      dateJoined: new Date().toISOString(),
      storeName: 'Mitchell Grocery',
      storeDescription: 'Fresh farm produce and groceries',
      storeCategory: 'grocery'
    };
  } else if (email === 'roger.blakely@example.com' || email === 'rogerb@gmail.com') {
    return {
      id: 'vendor-rogerb',
      name: 'Roger Blakely',
      email: email,
      phone: '+1876234567',
      address: '12 Trafalgar Road',
      town: 'Kingston',
      isVerified: true,
      isAdmin: false,
      isRider: false,
      userType: 'vendor',
      dateJoined: new Date().toISOString(),
      storeName: 'Blakely Electronics',
      storeDescription: 'Latest electronics and gadgets',
      storeCategory: 'electronics'
    };
  } else if (email === 'joe.black@example.com' || email === 'joeblack@gmail.com') {
    return {
      id: 'vendor-joeblack',
      name: 'Joe Black',
      email: email,
      phone: '+1876345678',
      address: '78 Constant Spring Road',
      town: 'Kingston',
      isVerified: true,
      isAdmin: false,
      isRider: false,
      userType: 'vendor',
      dateJoined: new Date().toISOString(),
      storeName: 'Black Pharmacy',
      storeDescription: 'Medicines and healthcare products',
      storeCategory: 'pharmacy'
    };
  } else if (email === 'nichemarsh@gmail.com') {
    return {
      id: 'vendor-nichemarsh',
      name: 'Niche Marshall',
      email: email,
      phone: '+1876456789',
      address: '23 Oxford Street',
      town: 'Kingston',
      isVerified: true,
      isAdmin: false,
      isRider: false,
      userType: 'vendor',
      dateJoined: new Date().toISOString(),
      storeName: 'Marshall Fashion',
      storeDescription: 'Trendy clothing and accessories',
      storeCategory: 'fashion'
    };
  }
  
  // Default user for other emails
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
  // Special handling for known vendor emails
  const vendorEmails = [
    'deonroy@gmail.com', 
    'deonroy.mitchell@example.com', 
    'roger.blakely@example.com', 
    'rogerb@gmail.com', 
    'joe.black@example.com', 
    'joeblack@gmail.com',
    'nichemarsh@gmail.com'
  ];
  
  // If this is a known vendor email, use vendor-specific logic
  if (vendorEmails.includes(userData.email)) {
    const mockVendorUser = createMockUser(userData.email);
    return {
      ...mockVendorUser,
      id: userId, // Use the provided userId
      name: userData.name || mockVendorUser.name, // Allow override if provided
      address: userData.address || mockVendorUser.address,
      town: userData.town || mockVendorUser.town,
      phone: userData.phone || mockVendorUser.phone,
      cardInfo: userData.cardInfo,
      addresses: createInitialAddresses(userData.address || mockVendorUser.address),
      isVerified: false,
      dateJoined: new Date().toISOString(),
      userType: 'vendor' // Always ensure vendor type
    };
  }
  
  // Regular user creation logic
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
    userType: userData.userType as 'customer' | 'rider' | 'admin' | 'vendor',
    dateJoined: new Date().toISOString(),
    cardInfo: userData.cardInfo,
    addresses: addresses
  };
};

// Enhanced updateVendorUsers function to fix the vendor accounts
export const updateVendorUsers = () => {
  const vendorProfiles = {
    'deonroy@gmail.com': { 
      name: 'Deonroy Mitchell', 
      storeName: 'Mitchell Grocery',
      storeDescription: 'Fresh farm produce and groceries',
      storeCategory: 'grocery'
    },
    'deonroy.mitchell@example.com': { 
      name: 'Deonroy Mitchell', 
      storeName: 'Mitchell Grocery',
      storeDescription: 'Fresh farm produce and groceries',
      storeCategory: 'grocery'
    },
    'roger.blakely@example.com': { 
      name: 'Roger Blakely', 
      storeName: 'Blakely Electronics',
      storeDescription: 'Latest electronics and gadgets',
      storeCategory: 'electronics'
    },
    'rogerb@gmail.com': { 
      name: 'Roger Blakely', 
      storeName: 'Blakely Electronics',
      storeDescription: 'Latest electronics and gadgets',
      storeCategory: 'electronics'
    },
    'joe.black@example.com': { 
      name: 'Joe Black', 
      storeName: 'Black Pharmacy',
      storeDescription: 'Medicines and healthcare products',
      storeCategory: 'pharmacy'
    },
    'joeblack@gmail.com': { 
      name: 'Joe Black', 
      storeName: 'Black Pharmacy',
      storeDescription: 'Medicines and healthcare products',
      storeCategory: 'pharmacy'
    },
    'nichemarsh@gmail.com': { 
      name: 'Niche Marshall', 
      storeName: 'Marshall Fashion',
      storeDescription: 'Trendy clothing and accessories',
      storeCategory: 'fashion'
    }
  };

  // Look through all localStorage items
  const vendorsUpdated = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('jamcart-user-')) {
      try {
        const userData = JSON.parse(localStorage.getItem(key) || '{}');
        const email = userData.email;
        
        if (email && vendorProfiles[email]) {
          // Update vendor data
          userData.userType = 'vendor';
          userData.isAdmin = false;
          userData.isRider = false;
          userData.name = vendorProfiles[email].name;
          userData.storeName = vendorProfiles[email].storeName;
          userData.storeDescription = vendorProfiles[email].storeDescription;
          userData.storeCategory = vendorProfiles[email].storeCategory;
          
          localStorage.setItem(key, JSON.stringify(userData));
          vendorsUpdated.push(email);
        }
      } catch (error) {
        console.error('Error updating vendor user', error);
      }
    }
  }

  // Also check current logged-in user
  const mainUserKey = 'jamcart-user';
  try {
    const mainUserData = localStorage.getItem(mainUserKey);
    if (mainUserData) {
      const userData = JSON.parse(mainUserData);
      const email = userData.email;
      
      if (email && vendorProfiles[email]) {
        // Update vendor data for current user
        userData.userType = 'vendor';
        userData.isAdmin = false;
        userData.isRider = false;
        userData.name = vendorProfiles[email].name;
        userData.storeName = vendorProfiles[email].storeName;
        userData.storeDescription = vendorProfiles[email].storeDescription;
        userData.storeCategory = vendorProfiles[email].storeCategory;
        
        localStorage.setItem(mainUserKey, JSON.stringify(userData));
        if (!vendorsUpdated.includes(email)) {
          vendorsUpdated.push(email);
        }
      }
    }
  } catch (error) {
    console.error('Error updating main vendor user', error);
  }
  
  console.log('Vendors updated:', vendorsUpdated);
};

// Run the update when the file loads
updateVendorUsers();

