
import { useState } from 'react';
import { OrderStatus } from '@/components/ui/OrderItem';
import { useToast } from '@/hooks/use-toast';

export const useOrderStatus = (
  orderId: string,
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void,
  onClose: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsSubmitting(true);
    
    try {
      console.log(`useOrderStatus: Changing order ${orderId} status to ${newStatus}`);
      
      // Call onStatusChange immediately for instant UI update
      onStatusChange(orderId, newStatus);
      
      toast({
        title: "Order status updated",
        description: `Order #${orderId.slice(-6)} has been ${newStatus}`,
        variant: "default",
      });
      
      // Single storage event to notify components
      window.dispatchEvent(new Event('storage'));
      
      setTimeout(() => {
        onClose();
      }, 100);
    } catch (error) {
      toast({
        title: "Error updating order",
        description: "There was a problem updating the order status. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleCancellation = async (isPenaltyFree: boolean) => {
    setIsSubmitting(true);
    
    try {
      console.log(`useOrderStatus: Cancelling order ${orderId}, penalty-free: ${isPenaltyFree}`);
      
      // Call onStatusChange immediately for instant UI update
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
      
      // Single event dispatch to notify components
      window.dispatchEvent(new Event('storage'));
      
      setTimeout(() => {
        onClose();
      }, 100);
    } catch (error) {
      toast({
        title: "Error cancelling order",
        description: "There was a problem cancelling your order. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleStatusChange,
    handleCancellation
  };
};
