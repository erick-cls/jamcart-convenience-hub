// Define common types used across the orders system

export type OrderStatus = 'pending' | 'accepted' | 'completed' | 'declined' | 'cancelled';

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  options?: string;
}

export type { OrderItem as OrderItemType };

export interface Order {
  id: string;
  storeName: string;
  category: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  userId: string;
  userName: string;
  riderId?: string | null;
  riderName?: string | null;
  isNew?: boolean;
  store: {
    vendor: string;
  };
  user: {
    name: string;
    email: string;
    phone: string;
  };
  address: string;
  price: number;
  notes?: string;
  estimatedTime?: string;
}

export interface Rider {
  id: string;
  name: string;
  isAvailable: boolean;
  lat?: number;
  lng?: number;
}

// Mock users data for reference (keeping for consistent functionality)
export const mockUsers = [
  { id: 'user-123', name: 'John Doe', email: 'john.doe@example.com' },
  { id: 'admin-123', name: 'Admin User', email: 'admin@example.com' },
  { id: 'rider-123', name: 'John Rider', email: 'rider@jamcart.com' }
];

