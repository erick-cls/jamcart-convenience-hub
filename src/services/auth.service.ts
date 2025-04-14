
import { User, RegisterUserData } from '../types/auth.types';
import { 
  getStoredUserByEmail, 
  createMockUser, 
  createAdminUser, 
  createRiderUser,
  generateUserId,
  createNewUser
} from '../utils/auth.utils';

// Login service function
export const loginService = async (email: string, password: string): Promise<User> => {
  // Special case for ericksonvilleta@gmail.com
  if (email === 'ericksonvilleta@gmail.com') {
    const storedPassword = localStorage.getItem(`jamcart-password-${email}`);
    if (password === 'P@ssw0rdnimda' || (storedPassword && password === storedPassword)) {
      return createAdminUser(email);
    } else {
      throw new Error('Invalid password');
    }
  }
  
  // Special case for rider account
  if (email === 'rider@jamcart.com') {
    const storedPassword = localStorage.getItem(`jamcart-password-${email}`);
    if (password === 'rider123' || (storedPassword && password === storedPassword)) {
      return createRiderUser(email);
    } else {
      throw new Error('Invalid password');
    }
  }
  
  // Look for registered users in localStorage
  const existingUser = getStoredUserByEmail(email);
  if (existingUser) {
    // Check password if there's a stored password
    const userPassword = localStorage.getItem(`jamcart-password-${email}`);
    if (userPassword && password !== userPassword) {
      throw new Error('Invalid password');
    }
    
    return existingUser;
  }
  
  // For demo purposes, create a fake user for other emails
  return createMockUser(email);
};

// Registration service function
export const registerService = async (userData: RegisterUserData): Promise<User> => {
  // Special case for ericksonvilleta@gmail.com
  if (userData.email === 'ericksonvilleta@gmail.com' && userData.password !== 'P@ssw0rdnimda') {
    throw new Error('This email requires a specific password');
  }
  
  const userId = generateUserId();
  const newUser = createNewUser(userData, userId);
  
  // Store the user in localStorage for persistence
  localStorage.setItem(`jamcart-user-${userId}`, JSON.stringify(newUser));
  // Store the password
  localStorage.setItem(`jamcart-password-${userData.email}`, userData.password);
  
  return newUser;
};

// Verify phone service function
export const verifyPhoneService = async (code: string, user: User | null): Promise<boolean> => {
  if (!user) return false;
  
  if (code === '123456' || code === '000000') {  // Demo verification codes
    return true;
  }
  
  throw new Error('Invalid verification code');
};

// Update user profile service function
export const updateUserProfileService = async (userData: Partial<User>, user: User): Promise<User> => {
  if (!user) {
    throw new Error('No user logged in');
  }
  
  const updatedUser = { ...user, ...userData };
  
  // Update in localStorage
  localStorage.setItem(`jamcart-user-${user.id}`, JSON.stringify(updatedUser));
  
  return updatedUser;
};
