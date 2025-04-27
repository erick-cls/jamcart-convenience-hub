
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { OrderStatus } from '@/pages/admin/orders/types';

export const useOrderCancellation = (
  orderId: string,
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void,
  onClose: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleCancellation = async (isPenaltyFree: boolean) => {
    setIsSubmitting(true);
    
    try {
      console.log(`useOrderCancellation: Cancelling order ${orderId}, penalty free: ${isPenaltyFree}`);
      onStatusChange(orderId, 'cancelled');
      
      const description = isPenaltyFree 
        ? `Order #${orderId.slice(-6)} has been cancelled without penalty`
        : `Order #${orderId.slice(-6)} has been cancelled with a $1000 JMD penalty fee`;
      
      toast({
        title: "Order cancelled",
        description,
        variant: "default",
      });
      
      if (!isPenaltyFree) {
        toast({
          title: "Penalty applied",
          description: "$1000 JMD has been charged to your card",
          variant: "default",
        });
      }
      
      const timestamp = Date.now();
      const eventId = `${orderId}-cancel-${timestamp}`;
      
      window.dispatchEvent(new CustomEvent('order-status-change', { 
        detail: { 
          orderId, 
          newStatus: 'cancelled', 
          timestamp,
          cancelled: true,
          isPenaltyFree,
          id: eventId,
          source: 'admin-cancellation',
          forceUpdate: true
        },
        bubbles: true,
        cancelable: true
      }));
      
      window.dispatchEvent(new CustomEvent('storage', { 
        detail: { 
          orderId, 
          newStatus: 'cancelled', 
          timestamp,
          cancelled: true,
          isPenaltyFree,
          id: eventId,
          source: 'admin-cancellation',
          forceUpdate: true
        },
        bubbles: true,
        cancelable: true
      }));
      
      try {
        localStorage.setItem(`order_${orderId}_status`, 'cancelled');
      } catch (e) {
        console.warn('Local storage update failed:', e);
      }
      
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error cancelling order:", error);
      
      toast({
        title: "Error cancelling order",
        description: "There was a problem cancelling your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleCancellation
  };
};
