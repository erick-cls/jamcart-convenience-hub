
export interface CardInfo {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

export interface UserAddress {
  type: string; // 'home', 'office', or 'current'
  address: string;
}

export interface User {
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
  cardInfo?: CardInfo;
  addresses?: UserAddress[];
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterUserData) => Promise<void>;
  logout: () => void;
  verifyPhone: (code: string) => Promise<boolean>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export type RegisterUserData = Omit<User, 'id' | 'isVerified' | 'isAdmin' | 'isRider' | 'userType'> & { 
  password: string, 
  userType: string, 
  cardInfo?: CardInfo 
};
