
import { useState } from 'react';
import { OrderStatus } from '@/components/ui/OrderItem';
import { useToast } from '@/hooks/use-toast';

export const useOrderStatusUpdate = (
  orderId: string,
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void,
  onClose: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsSubmitting(true);
    
    try {
      console.log(`useOrderStatusUpdate: Changing order ${orderId} status to ${newStatus}`);
      onStatusChange(orderId, newStatus);
      
      const timestamp = Date.now();
      const eventId = `${orderId}-${newStatus}-${timestamp}`;
      
      window.dispatchEvent(new CustomEvent('order-status-change', { 
        detail: { 
          orderId, 
          newStatus, 
          timestamp, 
          id: eventId,
          source: 'admin-status-change',
          forceUpdate: true
        },
        bubbles: true,
        cancelable: true
      }));
      
      window.dispatchEvent(new CustomEvent('storage', { 
        detail: { 
          orderId, 
          newStatus, 
          timestamp, 
          id: eventId,
          source: 'admin-status-change',
          forceUpdate: true
        },
        bubbles: true,
        cancelable: true
      }));
      
      toast({
        title: "Order status updated",
        description: `Order #${orderId.slice(-6)} has been ${newStatus}`,
        variant: "default",
      });
      
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error updating order",
        description: "There was a problem updating the order status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleStatusChange
  };
};
