
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
      await new Promise(resolve => setTimeout(resolve, 300)); // Shorter delay for better responsiveness
      onStatusChange(orderId, newStatus);
      
      toast({
        title: "Order status updated",
        description: `Order #${orderId.slice(-6)} has been ${newStatus}`,
        variant: "default",
      });
      
      // Force a refresh of the order data
      window.dispatchEvent(new Event('storage'));
      
      // Add a smaller delay before closing to ensure UI updates
      setTimeout(() => {
        onClose();
      }, 200);
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
      await new Promise(resolve => setTimeout(resolve, 300)); // Shorter delay for better responsiveness
      // Explicitly call with 'cancelled' status to ensure it gets set correctly
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
        // Simulate API call to charge card for penalty with shorter delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        toast({
          title: "Penalty applied",
          description: "$1000 JMD has been charged to your card",
          variant: "default",
        });
      }
      
      // Force multiple refresh events to ensure updates propagate
      window.dispatchEvent(new Event('storage'));
      setTimeout(() => window.dispatchEvent(new Event('storage')), 300);
      
      // Add a small delay before closing to ensure UI updates
      setTimeout(() => {
        onClose();
      }, 250);
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
