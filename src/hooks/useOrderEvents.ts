
import { useEffect, useCallback } from 'react';
import { Order } from '@/pages/admin/orders/types';

export const useOrderEvents = (fetchOrders: () => void) => {
  useEffect(() => {
    const handleStorageChange = (e: Event) => {
      if (e instanceof CustomEvent && e.detail) {
        console.log("useOrderEvents: Custom event received", e.detail);
      }
      console.log("useOrderEvents: Storage event triggered refresh");
      fetchOrders();
    };
    
    const handleOrderStatusChange = (e: Event) => {
      console.log("useOrderEvents: Order status change event received");
      fetchOrders();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('order-status-change', handleOrderStatusChange);
    
    const intervalId = setInterval(() => {
      console.log("useOrderEvents: Auto-refresh interval triggered");
      fetchOrders();
    }, 10000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('order-status-change', handleOrderStatusChange);
      clearInterval(intervalId);
    };
  }, [fetchOrders]);
};
