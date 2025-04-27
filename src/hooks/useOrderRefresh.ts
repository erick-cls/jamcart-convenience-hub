
import { useState, useCallback } from 'react';
import { useToast } from './use-toast';
import { Order } from '@/pages/admin/orders/types';

export const useOrderRefresh = (initialOrders: Order[]) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(Date.now());
  const { toast } = useToast();

  const refreshOrders = useCallback(() => {
    setIsRefreshing(true);
    try {
      setOrders(initialOrders);
      setLastRefreshed(Date.now());
      
      window.dispatchEvent(new Event('order-status-change'));
    } catch (error) {
      console.error("Error refreshing orders:", error);
      toast({
        title: "Error refreshing orders",
        description: "There was a problem updating your orders. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [initialOrders, toast]);

  return {
    orders,
    isRefreshing,
    lastRefreshed,
    refreshOrders
  };
};
