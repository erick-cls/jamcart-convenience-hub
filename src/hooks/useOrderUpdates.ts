
import { useCallback } from 'react';
import { useToast } from './use-toast';
import { OrderStatus } from '@/pages/admin/orders/types';

export const useOrderUpdates = (onOrderUpdate?: () => void) => {
  const { toast } = useToast();

  const handleOrderUpdate = useCallback((orderId: string, newStatus: OrderStatus) => {
    try {
      localStorage.setItem(`order_${orderId}_status`, newStatus);
      
      if (onOrderUpdate) {
        console.log("useOrderUpdates: Triggering onOrderUpdate callback");
        onOrderUpdate();
      }

      toast({
        title: "Order updated",
        description: `Order status has been updated to ${newStatus}`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Update failed",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  }, [onOrderUpdate, toast]);

  return { handleOrderUpdate };
};
