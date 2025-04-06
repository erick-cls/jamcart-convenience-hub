
import { Order, Rider, OrderStatus } from './types';

// Mock orders data
export const mockOrders: Order[] = [
  {
    id: 'order-123',
    storeName: 'Quick Stop Mini Mart',
    category: 'Mini Mart',
    date: '2025-04-01T10:30:00Z',
    status: 'pending',
    items: ['2 liters of milk', '1 loaf of bread', '6 eggs'],
    total: 15.99,
    userId: 'user-123',
    userName: 'John Doe',
    riderId: null,
    riderName: null,
    isNew: true
  },
  {
    id: 'order-456',
    storeName: 'Island Pharmacy',
    category: 'Pharmacy',
    date: '2025-03-30T14:45:00Z',
    status: 'accepted',
    items: ['Aspirin', 'Bandages', 'Cough syrup'],
    total: 32.50,
    userId: 'user-123',
    userName: 'John Doe',
    riderId: 'rider-123',
    riderName: 'John Rider',
    isNew: false
  },
  {
    id: 'order-789',
    storeName: 'FreshMart Supermarket',
    category: 'Supermarket',
    date: '2025-03-29T09:15:00Z',
    status: 'completed',
    items: ['Fresh vegetables', 'Chicken breasts', 'Rice', 'Cooking oil'],
    total: 45.75,
    userId: 'user-456',
    userName: 'Jane Smith',
    riderId: 'rider-123',
    riderName: 'John Rider',
    isNew: false
  },
  {
    id: 'order-012',
    storeName: 'Island Flavors Restaurant',
    category: 'Restaurant',
    date: '2025-03-28T18:30:00Z',
    status: 'declined',
    items: ['Jerk Chicken', 'Rice and Peas', 'Festival'],
    total: 28.99,
    userId: 'user-789',
    userName: 'Bob Johnson',
    riderId: null,
    riderName: null,
    isNew: false
  }
];

// Mock riders data
export const mockRiders: Rider[] = [
  {
    id: 'rider-123',
    name: 'John Rider',
    isAvailable: true
  },
  {
    id: 'rider-456',
    name: 'Jane Delivery',
    isAvailable: false
  },
  {
    id: 'rider-789',
    name: 'Alex Express',
    isAvailable: true
  }
];
