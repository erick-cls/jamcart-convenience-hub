
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { OrderStatus } from '@/components/ui/OrderItem';

// Mock orders data
const mockOrders = [
  {
    id: 'order-123452',
    storeName: 'Quick Stop Mini Mart',
    category: 'Mini Mart',
    date: '2023-06-10T10:15:00',
    status: 'completed' as OrderStatus,
    items: ['Snacks', 'Soft drinks', 'Cigarettes'],
    total: 35.50,
    userId: 'user-123'
  },
  {
    id: 'order-123453',
    storeName: 'Island Flavors Restaurant',
    category: 'Restaurant',
    date: '2023-06-10T12:30:00',
    status: 'completed' as OrderStatus,
    items: ['Jerk chicken', 'Rice and peas', 'Festival'],
    total: 85.75,
    userId: 'user-123'
  },
  {
    id: 'order-123454',
    storeName: 'Hardware Express',
    category: 'Hardware',
    date: '2023-06-09T14:00:00',
    status: 'declined' as OrderStatus,
    items: ['Paint brushes', 'Screwdriver set', 'Light bulbs'],
    total: 42.20,
    userId: 'admin-123'
  },
  {
    id: 'order-123455',
    storeName: 'Water Solutions',
    category: 'Water Filtration',
    date: '2023-06-09T15:30:00',
    status: 'cancelled' as OrderStatus,
    items: ['Water filter', 'Filter replacement', 'Installation service'],
    total: 120.00,
    userId: 'rider-123'
  },
  {
    id: 'order-123456',
    storeName: 'FreshMart Supermarket',
    category: 'Supermarket',
    date: '2023-06-08T14:30:00',
    status: 'accepted' as OrderStatus,
    items: ['2 loaves of bread', '1 gallon of milk', '5 apples', 'Box of cereal'],
    total: 55.25,
    userId: 'user-123'
  },
  {
    id: 'order-123457',
    storeName: 'Island Pharmacy',
    category: 'Pharmacy',
    date: '2023-06-08T15:45:00',
    status: 'pending' as OrderStatus,
    items: ['Paracetamol', 'Bandages', 'Antiseptic solution'],
    total: 28.80,
    userId: 'admin-123'
  },
  {
    id: 'order-123458',
    storeName: 'Corner Market',
    category: 'Mini Mart',
    date: '2023-06-07T11:20:00',
    status: 'accepted' as OrderStatus,
    items: ['Eggs', 'Bread', 'Milk', 'Sugar'],
    total: 32.15,
    userId: 'user-123'
  },
  {
    id: 'order-123459',
    storeName: 'Sea Breeze Dining',
    category: 'Restaurant',
    date: '2023-06-07T13:10:00',
    status: 'completed' as OrderStatus,
    items: ['Grilled fish', 'Steamed vegetables', 'Rice'],
    total: 95.50,
    userId: 'rider-123'
  },
  {
    id: 'order-123460',
    storeName: 'Bills Express',
    category: 'Bill Pay',
    date: '2023-06-06T16:30:00',
    status: 'completed' as OrderStatus,
    items: ['Electricity bill', 'Water bill'],
    total: 150.00,
    userId: 'user-123'
  }
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
}

export function useOrdersState() {
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'all';
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Add function to update order status
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
  };
  
  // Filter orders by user ID
  const getUserOrders = (userId: string) => {
    return orders.filter(order => order.userId === userId);
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
          order.id.toLowerCase().includes(term)
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
  };
}
