
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Order, OrderStatus, Rider } from './types';
import { mockRiders } from './mockData';
import { 
  initializeOrders, 
  getStoredOrders, 
  saveOrdersToStorage 
} from './orderStorage';
import { 
  updateOrderStatus as updateOrderStatusAction, 
  getUserOrders as getUserOrdersAction,
  assignRider as assignRiderAction,
  createTestOrder as createTestOrderAction
} from './orderActions';
import { getAvailableRiders as getAvailableRidersAction } from './riderActions';

// Re-export types for backward compatibility
export type { Order, OrderStatus, Rider };

export function useOrdersState() {
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'all';
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [riders, setRiders] = useState<Rider[]>(mockRiders);
  
  // Initialize with orders from storage and mock data
  useEffect(() => {
    // Simulate loading
    setLoading(true);
    
    // Initialize orders
    const combinedOrders = initializeOrders();
    setOrders(combinedOrders);
    
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);
  
  // Add function to update order status
  const updateOrderStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders => {
      const updatedOrders = updateOrderStatusAction(prevOrders, orderId, newStatus);
      return updatedOrders;
    });
  }, []);
  
  // Filter orders by user ID
  const getUserOrders = useCallback((userId: string) => {
    return getUserOrdersAction(userId);
  }, []);
  
  // Assign a rider to an order
  const assignRider = useCallback((orderId: string, riderId: string) => {
    const rider = riders.find(r => r.id === riderId);
    
    if (rider) {
      setOrders(prevOrders => {
        return assignRiderAction(prevOrders, orderId, rider.id, rider.name);
      });
    }
  }, [riders]);

  // Get available riders
  const getAvailableRiders = useCallback(() => {
    return getAvailableRidersAction(riders);
  }, [riders]);
  
  // Create a new test order
  const createTestOrder = useCallback((userId: string, userName: string, items: string[] = []) => {
    const newOrder = createTestOrderAction(userId, userName, items);
    
    setOrders(prevOrders => {
      return [newOrder, ...prevOrders];
    });
    
    return newOrder;
  }, []);
  
  // Filter orders based on activeFilter and searchTerm
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
