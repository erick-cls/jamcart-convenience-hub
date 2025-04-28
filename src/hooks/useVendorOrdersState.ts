
import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/pages/admin/orders/types';
import { useToast } from './use-toast';

export const useVendorOrdersState = (vendorId: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const { toast } = useToast();
  
  // Load orders on mount and when vendorId changes
  useEffect(() => {
    if (vendorId) {
      refreshOrders();
    }
  }, [vendorId]);
  
  // Refresh orders
  const refreshOrders = async () => {
    setIsRefreshing(true);
    
    try {
      // For now, retrieve orders from local storage
      const storedOrders = localStorage.getItem('jamcart_orders');
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders);
        const vendorOrders = parsedOrders.filter((order: Order) => 
          order.store && order.store.vendor === vendorId
        );
        
        setOrders(vendorOrders);
        setFilteredOrders(vendorOrders);
        setLastRefreshed(new Date());
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      toast({
        title: "Failed to load orders",
        description: "There was an error loading your orders. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Update order status
  const handleOrderUpdate = (orderId: string, newStatus: OrderStatus) => {
    try {
      // Update order in state
      const updatedOrders = orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      );
      
      // Update order in local storage
      const storedOrders = localStorage.getItem('jamcart_orders');
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders);
        const updatedAllOrders = parsedOrders.map((order: Order) => 
          order.id === orderId 
            ? { ...order, status: newStatus } 
            : order
        );
        
        localStorage.setItem('jamcart_orders', JSON.stringify(updatedAllOrders));
      }
      
      // Update state
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
      
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Failed to update order",
        description: "There was an error updating the order status. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Return the state and functions
  return {
    orders,
    filteredOrders,
    isRefreshing,
    lastRefreshed,
    refreshOrders,
    handleOrderUpdate
  };
};
