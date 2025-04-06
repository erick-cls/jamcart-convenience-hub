
import { Order, OrderStatus } from './types';

// Mock orders data with user and rider info
export const mockOrders: Order[] = [
  {
    id: 'order-123452',
    storeName: 'Quick Stop Mini Mart',
    category: 'Mini Mart',
    date: '2023-06-10T10:15:00',
    status: 'completed' as OrderStatus,
    items: ['Snacks', 'Soft drinks', 'Cigarettes'],
    total: 35.50,
    userId: 'user-123',
    userName: 'John Doe',
    riderId: 'rider-123',
    riderName: 'John Rider',
    isNew: false
  },
  {
    id: 'order-123453',
    storeName: 'Island Flavors Restaurant',
    category: 'Restaurant',
    date: '2023-06-10T12:30:00',
    status: 'completed' as OrderStatus,
    items: ['Jerk chicken', 'Rice and peas', 'Festival'],
    total: 85.75,
    userId: 'user-123',
    userName: 'John Doe',
    riderId: null,
    riderName: null,
    isNew: false
  },
  {
    id: 'order-123454',
    storeName: 'Hardware Express',
    category: 'Hardware',
    date: '2023-06-09T14:00:00',
    status: 'declined' as OrderStatus,
    items: ['Paint brushes', 'Screwdriver set', 'Light bulbs'],
    total: 42.20,
    userId: 'admin-123',
    userName: 'Admin User',
    riderId: null,
    riderName: null,
    isNew: false
  },
  {
    id: 'order-123455',
    storeName: 'Water Solutions',
    category: 'Water Filtration',
    date: '2023-06-09T15:30:00',
    status: 'cancelled' as OrderStatus,
    items: ['Water filter', 'Filter replacement', 'Installation service'],
    total: 120.00,
    userId: 'rider-123',
    userName: 'John Rider',
    riderId: null,
    riderName: null,
    isNew: false
  },
  {
    id: 'order-123456',
    storeName: 'FreshMart Supermarket',
    category: 'Supermarket',
    date: '2023-06-08T14:30:00',
    status: 'accepted' as OrderStatus,
    items: ['2 loaves of bread', '1 gallon of milk', '5 apples', 'Box of cereal'],
    total: 55.25,
    userId: 'user-123',
    userName: 'John Doe',
    riderId: 'rider-123',
    riderName: 'John Rider',
    isNew: false
  },
  {
    id: 'order-123457',
    storeName: 'Island Pharmacy',
    category: 'Pharmacy',
    date: '2023-06-08T15:45:00',
    status: 'pending' as OrderStatus,
    items: ['Paracetamol', 'Bandages', 'Antiseptic solution'],
    total: 28.80,
    userId: 'admin-123',
    userName: 'Admin User',
    riderId: null,
    riderName: null,
    isNew: false
  },
  {
    id: 'order-123458',
    storeName: 'Corner Market',
    category: 'Mini Mart',
    date: '2023-06-07T11:20:00',
    status: 'accepted' as OrderStatus,
    items: ['Eggs', 'Bread', 'Milk', 'Sugar'],
    total: 32.15,
    userId: 'user-123',
    userName: 'John Doe',
    riderId: null,
    riderName: null,
    isNew: false
  },
  {
    id: 'order-123459',
    storeName: 'Sea Breeze Dining',
    category: 'Restaurant',
    date: '2023-06-07T13:10:00',
    status: 'completed' as OrderStatus,
    items: ['Grilled fish', 'Steamed vegetables', 'Rice'],
    total: 95.50,
    userId: 'rider-123',
    userName: 'John Rider',
    riderId: 'rider-123',
    riderName: 'John Rider',
    isNew: false
  },
  {
    id: 'order-123460',
    storeName: 'Bills Express',
    category: 'Bill Pay',
    date: '2023-06-06T16:30:00',
    status: 'completed' as OrderStatus,
    items: ['Electricity bill', 'Water bill'],
    total: 150.00,
    userId: 'user-123',
    userName: 'John Doe',
    riderId: null,
    riderName: null,
    isNew: false
  }
];

export const mockRiders: Rider[] = [
  { id: 'rider-123', name: 'John Rider', isAvailable: true },
  { id: 'rider-456', name: 'Jane Rider', isAvailable: true },
  { id: 'rider-789', name: 'Bob Rider', isAvailable: false }
];
