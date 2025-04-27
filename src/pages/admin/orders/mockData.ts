
import { Order, Rider, OrderStatus } from './types';

// Mock orders data
export const mockOrders: Order[] = [
  {
    id: 'order-123',
    storeName: 'Quick Stop Mini Mart',
    category: 'Mini Mart',
    date: '2025-04-01T10:30:00Z',
    status: 'pending',
    items: [
      { name: '2 liters of milk', price: 5.99, quantity: 1 },
      { name: '1 loaf of bread', price: 4.50, quantity: 1 },
      { name: '6 eggs', price: 5.50, quantity: 1 }
    ],
    total: 15.99,
    userId: 'user-123',
    userName: 'John Doe',
    riderId: null,
    riderName: null,
    isNew: true,
    store: {
      vendor: 'vendor-123'
    },
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-1234'
    },
    address: '123 Main St, Kingston, Jamaica',
    price: 15.99
  },
  {
    id: 'order-456',
    storeName: 'Island Pharmacy',
    category: 'Pharmacy',
    date: '2025-03-30T14:45:00Z',
    status: 'accepted',
    items: [
      { name: 'Aspirin', price: 10.50, quantity: 1 },
      { name: 'Bandages', price: 12.00, quantity: 1 },
      { name: 'Cough syrup', price: 10.00, quantity: 1 }
    ],
    total: 32.50,
    userId: 'user-123',
    userName: 'John Doe',
    riderId: 'rider-123',
    riderName: 'John Rider',
    isNew: false,
    store: {
      vendor: 'vendor-456'
    },
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-1234'
    },
    address: '123 Main St, Kingston, Jamaica',
    price: 32.50
  },
  {
    id: 'order-789',
    storeName: 'FreshMart Supermarket',
    category: 'Supermarket',
    date: '2025-03-29T09:15:00Z',
    status: 'completed',
    items: [
      { name: 'Fresh vegetables', price: 15.75, quantity: 1 },
      { name: 'Chicken breasts', price: 12.00, quantity: 1 },
      { name: 'Rice', price: 8.00, quantity: 1 },
      { name: 'Cooking oil', price: 10.00, quantity: 1 }
    ],
    total: 45.75,
    userId: 'user-456',
    userName: 'Jane Smith',
    riderId: 'rider-123',
    riderName: 'John Rider',
    isNew: false,
    store: {
      vendor: 'vendor-789'
    },
    user: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '555-5678'
    },
    address: '456 Side St, Kingston, Jamaica',
    price: 45.75
  },
  {
    id: 'order-012',
    storeName: 'Island Flavors Restaurant',
    category: 'Restaurant',
    date: '2025-03-28T18:30:00Z',
    status: 'declined',
    items: [
      { name: 'Jerk Chicken', price: 12.99, quantity: 1 },
      { name: 'Rice and Peas', price: 8.00, quantity: 1 },
      { name: 'Festival', price: 8.00, quantity: 1 }
    ],
    total: 28.99,
    userId: 'user-789',
    userName: 'Bob Johnson',
    riderId: null,
    riderName: null,
    isNew: false,
    store: {
      vendor: 'vendor-012'
    },
    user: {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '555-9012'
    },
    address: '789 Other St, Kingston, Jamaica',
    price: 28.99
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
