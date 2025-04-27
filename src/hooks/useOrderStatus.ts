
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
      // Call onStatusChange immediately for instant UI update
      onStatusChange(orderId, newStatus);
      
      toast({
        title: "Order status updated",
        description: `Order #${orderId.slice(-6)} has been ${newStatus}`,
        variant: "default",
      });
      
      // Dispatch both events with details to notify all components
      window.dispatchEvent(new CustomEvent('order-status-change', { detail: { orderId, newStatus } }));
      window.dispatchEvent(new CustomEvent('storage', { detail: { orderId, newStatus } }));
      
      // Close with slight delay to ensure updates are processed
      setTimeout(() => {
        onClose();
      }, 300);
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
      
      // Dispatch both events with details to notify all components
      window.dispatchEvent(new CustomEvent('order-status-change', { detail: { orderId, newStatus: 'cancelled' } }));
      window.dispatchEvent(new CustomEvent('storage', { detail: { orderId, newStatus: 'cancelled' } }));
      
      // Close with slight delay to ensure updates are processed
      setTimeout(() => {
        onClose();
      }, 300);
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
