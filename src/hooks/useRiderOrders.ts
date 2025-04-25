import { useState, useEffect } from 'react';
import { OrderStatus } from '@/components/ui/OrderItem';

interface Order {
  id: string;
  storeName: string;
  category: string;
  date: string;
  status: OrderStatus;
  items: string[];
  total: number;
  assignedTo?: string;
}

const mockOrders: Order[] = [
  {
    id: 'order-1',
    storeName: 'Quick Stop Mini Mart',
    category: 'Mini Mart',
    date: '2023-06-15T14:30:00',
    status: 'accepted',
    items: ['Bread', 'Milk', 'Eggs'],
    total: 15.99,
    assignedTo: 'rider-123',
  },
  {
    id: 'order-2',
    storeName: 'FreshMart Supermarket',
    category: 'Supermarket',
    date: '2023-06-15T10:15:00',
    status: 'pending',
    items: ['Rice', 'Chicken', 'Vegetables'],
    total: 32.50,
  },
  {
    id: 'order-3',
    storeName: 'Island Pharmacy',
    category: 'Pharmacy',
    date: '2023-06-14T16:45:00',
    status: 'completed',
    items: ['Pain reliever', 'Band-aids', 'Vitamins'],
    total: 24.75,
    assignedTo: 'rider-123',
  },
  {
    id: 'order-4',
    storeName: 'Island Flavors Restaurant',
    category: 'Restaurant',
    date: '2023-06-14T12:30:00',
    status: 'pending',
    items: ['Jerk Chicken', 'Rice and Peas', 'Festival'],
    total: 28.99,
  },
  {
    id: 'order-5',
    storeName: 'Quick Stop Mini Mart',
    category: 'Mini Mart',
    date: '2023-06-13T15:20:00',
    status: 'declined',
    items: ['Chips', 'Soda', 'Candy'],
    total: 8.50,
  },
];

export const useRiderOrders = (activeFilter: string) => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === activeFilter));
    }
  }, [activeFilter, orders]);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  return {
    orders,
    filteredOrders,
    loading,
    updateOrderStatus
  };
};
