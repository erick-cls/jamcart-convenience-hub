
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
      
      // Simulate API delay - much shorter for better responsiveness
      await new Promise(resolve => setTimeout(resolve, 100)); 
      
      toast({
        title: "Order status updated",
        description: `Order #${orderId.slice(-6)} has been ${newStatus}`,
        variant: "default",
      });
      
      // Force multiple refresh events to ensure updates propagate
      // Using more frequent intervals for better responsiveness
      window.dispatchEvent(new Event('storage'));
      setTimeout(() => window.dispatchEvent(new Event('storage')), 50);
      setTimeout(() => window.dispatchEvent(new Event('storage')), 150);
      setTimeout(() => window.dispatchEvent(new Event('storage')), 250);
      
      // Add a smaller delay before closing to ensure UI updates
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
      
      // Call onStatusChange immediately for instant UI update - don't wait for timeout
      onStatusChange(orderId, 'cancelled');
      
      // Simulate API delay - much shorter for better responsiveness
      await new Promise(resolve => setTimeout(resolve, 100)); 
      
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
        await new Promise(resolve => setTimeout(resolve, 100));
        
        toast({
          title: "Penalty applied",
          description: "$1000 JMD has been charged to your card",
          variant: "default",
        });
      }
      
      // Force multiple refresh events with more frequent intervals to ensure updates propagate
      window.dispatchEvent(new Event('storage'));
      setTimeout(() => window.dispatchEvent(new Event('storage')), 50);
      setTimeout(() => window.dispatchEvent(new Event('storage')), 150);
      setTimeout(() => window.dispatchEvent(new Event('storage')), 250);
      setTimeout(() => window.dispatchEvent(new Event('storage')), 350);
      
      // Add a smaller delay before closing to ensure UI updates
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
