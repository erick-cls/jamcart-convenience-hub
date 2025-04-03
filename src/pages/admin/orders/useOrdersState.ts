
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { OrderStatus } from '@/components/ui/OrderItem';

// Mock users data for reference
const mockUsers = [
  { id: 'user-123', name: 'John Doe', email: 'john.doe@example.com' },
  { id: 'admin-123', name: 'Admin User', email: 'admin@example.com' },
  { id: 'rider-123', name: 'John Rider', email: 'rider@jamcart.com' }
];

// Mock orders data with user and rider info
const mockOrders = [
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

// Mock riders data
const mockRiders = [
  { id: 'rider-123', name: 'John Rider', isAvailable: true },
  { id: 'rider-456', name: 'Jane Rider', isAvailable: true },
  { id: 'rider-789', name: 'Bob Rider', isAvailable: false }
];

export interface Order {
  id: string;
  storeName: string;
  category: string;
  date: string;
  status: OrderStatus;
  items: string[];
  total: number;
  userId?: string;
  userName?: string;
  riderId?: string | null;
  riderName?: string | null;
  isNew?: boolean;
}

export interface Rider {
  id: string;
  name: string;
  isAvailable: boolean;
}

// Get orders from localStorage or return an empty array
const getStoredOrders = (): Order[] => {
  const storedOrders = localStorage.getItem('jamcart_orders');
  return storedOrders ? JSON.parse(storedOrders) : [];
};

// Save orders to localStorage
const saveOrdersToStorage = (orders: Order[]) => {
  localStorage.setItem('jamcart_orders', JSON.stringify(orders));
};

export function useOrdersState() {
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'all';
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [riders, setRiders] = useState<Rider[]>(mockRiders);
  
  // Initialize with mockOrders and any stored orders
  useEffect(() => {
    // Simulate loading
    setLoading(true);
    
    // Get orders from localStorage
    const storedOrders = getStoredOrders();
    
    // Add a new order with current date/time when the component mounts
    const now = new Date();
    const newOrder: Order = {
      id: `order-${now.getTime()}`,
      storeName: 'New Test Order',
      category: 'Test Category',
      date: now.toISOString(),
      status: 'pending',
      items: ['Test Item 1', 'Test Item 2'],
      total: 25.99,
      userId: 'user-123',
      userName: 'John Doe',
      riderId: null,
      riderName: null,
      isNew: true
    };
    
    // Combine stored orders with mock orders, ensuring no duplicates by ID
    const allOrderIds = new Set([...storedOrders.map(order => order.id), ...mockOrders.map(order => order.id)]);
    const combinedOrders = [...storedOrders];
    
    // Add any mock orders that aren't already in stored orders
    mockOrders.forEach(mockOrder => {
      if (!storedOrders.some(order => order.id === mockOrder.id)) {
        combinedOrders.push(mockOrder);
      }
    });
    
    // Add the new test order
    combinedOrders.unshift(newOrder);
    
    // Set orders and save to localStorage
    setOrders(combinedOrders);
    saveOrdersToStorage(combinedOrders);
    
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);
  
  // Add function to update order status
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    saveOrdersToStorage(updatedOrders);
  };
  
  // Filter orders by user ID
  const getUserOrders = (userId: string) => {
    return orders.filter(order => order.userId === userId);
  };
  
  // Assign a rider to an order
  const assignRider = (orderId: string, riderId: string) => {
    const rider = riders.find(r => r.id === riderId);
    
    if (rider) {
      const updatedOrders = orders.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              riderId: rider.id, 
              riderName: rider.name 
            } 
          : order
      );
      setOrders(updatedOrders);
      saveOrdersToStorage(updatedOrders);
    }
  };

  // Get available riders
  const getAvailableRiders = () => {
    return riders.filter(rider => rider.isAvailable);
  };
  
  // Create a new test order with current date/time
  const createTestOrder = (userId: string, userName: string) => {
    const now = new Date();
    const newOrder: Order = {
      id: `order-${now.getTime()}`,
      storeName: 'New Test Order',
      category: 'Test Category',
      date: now.toISOString(),
      status: 'pending',
      items: ['Test Item 1', 'Test Item 2'],
      total: Math.floor(Math.random() * 100) + 10,
      userId,
      userName,
      riderId: null,
      riderName: null,
      isNew: true
    };
    
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    saveOrdersToStorage(updatedOrders);
    return newOrder;
  };
  
  useEffect(() => {
    let result = orders;
    
    // Apply status filter
    if (activeFilter !== 'all') {
      result = result.filter(order => order.status === activeFilter);
    }
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        order => 
          order.storeName.toLowerCase().includes(term) ||
          order.category.toLowerCase().includes(term) ||
          order.id.toLowerCase().includes(term) ||
          (order.userName && order.userName.toLowerCase().includes(term)) ||
          (order.riderName && order.riderName.toLowerCase().includes(term))
      );
    }
    
    setFilteredOrders(result);
  }, [orders, activeFilter, searchTerm]);
  
  return {
    orders,
    filteredOrders,
    activeFilter,
    setActiveFilter,
    searchTerm,
    setSearchTerm,
    loading,
    updateOrderStatus,
    getUserOrders,
    riders,
    getAvailableRiders,
    assignRider,
    createTestOrder
  };
}
