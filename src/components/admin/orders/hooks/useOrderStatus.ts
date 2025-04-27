
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Call status change handler to update UI immediately
      onStatusChange(orderId, newStatus);
      
      toast({
        title: "Order status updated",
        description: `Order #${orderId.slice(-6)} has been ${newStatus}`,
        variant: "default",
      });
      
      // Enhanced event dispatching with timestamp and unqiue identifiers
      const statusEvent = new CustomEvent('order-status-change', { 
        detail: { orderId, newStatus, timestamp: Date.now(), id: `${orderId}-${Date.now()}` } 
      });
      window.dispatchEvent(statusEvent);
      
      // Also dispatch storage event with same enhanced data
      window.dispatchEvent(new CustomEvent('storage', { 
        detail: { orderId, newStatus, timestamp: Date.now(), id: `${orderId}-${Date.now()}` } 
      }));
      
      // Add a slightly longer delay before closing to ensure UI updates
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      toast({
        title: "Error updating order",
        description: "There was a problem updating the order status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancellation = async (isPenaltyFree: boolean) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Call status change handler to update UI immediately - with forced cancelled status
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
        // Simulate API call for penalty charge
        await new Promise(resolve => setTimeout(resolve, 300));
        
        toast({
          title: "Penalty applied",
          description: "$1000 JMD has been charged to your card",
          variant: "default",
        });
      }
      
      // Enhanced event dispatching with specific cancellation flag
      const cancelEvent = new CustomEvent('order-status-change', { 
        detail: { 
          orderId, 
          newStatus: 'cancelled', 
          timestamp: Date.now(),
          cancelled: true,
          id: `${orderId}-cancel-${Date.now()}`
        } 
      });
      window.dispatchEvent(cancelEvent);
      
      // Also dispatch storage event with explicit cancel data
      window.dispatchEvent(new CustomEvent('storage', { 
        detail: { 
          orderId, 
          newStatus: 'cancelled', 
          timestamp: Date.now(),
          cancelled: true,
          id: `${orderId}-cancel-${Date.now()}`
        } 
      }));
      
      // Increased delay to ensure UI updates before closing
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
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
    handleStatusChange,
    handleCancellation
  };
};
