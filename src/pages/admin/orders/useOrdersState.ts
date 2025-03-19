
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
    total: 35.50
  },
  {
    id: 'order-123453',
    storeName: 'Island Flavors Restaurant',
    category: 'Restaurant',
    date: '2023-06-10T12:30:00',
    status: 'completed' as OrderStatus,
    items: ['Jerk chicken', 'Rice and peas', 'Festival'],
    total: 85.75
  },
  {
    id: 'order-123454',
    storeName: 'Hardware Express',
    category: 'Hardware',
    date: '2023-06-09T14:00:00',
    status: 'declined' as OrderStatus,
    items: ['Paint brushes', 'Screwdriver set', 'Light bulbs'],
    total: 42.20
  },
  {
    id: 'order-123455',
    storeName: 'Water Solutions',
    category: 'Water Filtration',
    date: '2023-06-09T15:30:00',
    status: 'cancelled' as OrderStatus,
    items: ['Water filter', 'Filter replacement', 'Installation service'],
    total: 120.00
  },
  {
    id: 'order-123456',
    storeName: 'FreshMart Supermarket',
    category: 'Supermarket',
    date: '2023-06-08T14:30:00',
    status: 'accepted' as OrderStatus,
    items: ['2 loaves of bread', '1 gallon of milk', '5 apples', 'Box of cereal'],
    total: 55.25
  },
  {
    id: 'order-123457',
    storeName: 'Island Pharmacy',
    category: 'Pharmacy',
    date: '2023-06-08T15:45:00',
    status: 'pending' as OrderStatus,
    items: ['Paracetamol', 'Bandages', 'Antiseptic solution'],
    total: 28.80
  },
  {
    id: 'order-123458',
    storeName: 'Corner Market',
    category: 'Mini Mart',
    date: '2023-06-07T11:20:00',
    status: 'accepted' as OrderStatus,
    items: ['Eggs', 'Bread', 'Milk', 'Sugar'],
    total: 32.15
  },
  {
    id: 'order-123459',
    storeName: 'Sea Breeze Dining',
    category: 'Restaurant',
    date: '2023-06-07T13:10:00',
    status: 'completed' as OrderStatus,
    items: ['Grilled fish', 'Steamed vegetables', 'Rice'],
    total: 95.50
  },
  {
    id: 'order-123460',
    storeName: 'Bills Express',
    category: 'Bill Pay',
    date: '2023-06-06T16:30:00',
    status: 'completed' as OrderStatus,
    items: ['Electricity bill', 'Water bill'],
    total: 150.00
  }
];

export function useOrdersState() {
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'all';
  const [orders] = useState(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState(mockOrders);
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [searchTerm, setSearchTerm] = useState('');
  
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
    setSearchTerm
  };
}
