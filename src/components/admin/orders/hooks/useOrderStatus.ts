
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
      console.log(`Admin useOrderStatus: Changing order ${orderId} status to ${newStatus}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Call status change handler to update UI immediately
      onStatusChange(orderId, newStatus);
      
      toast({
        title: "Order status updated",
        description: `Order #${orderId.slice(-6)} has been ${newStatus}`,
        variant: "default",
      });
      
      // Enhanced event dispatching with multiple event types and rich metadata
      const timestamp = Date.now();
      const eventId = `${orderId}-${newStatus}-${timestamp}`;
      
      // Use CustomEvent with rich detail payload and force update flag
      const statusEvent = new CustomEvent('order-status-change', { 
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
      });
      window.dispatchEvent(statusEvent);
      
      // Dispatch multiple events to ensure all components receive the update
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
      
      // Update localStorage to persist the change
      try {
        localStorage.setItem(`order_${orderId}_status`, newStatus);
      } catch (e) {
        console.warn('Local storage update failed:', e);
      }
      
      // Extra log for debugging
      console.log(`Admin useOrderStatus: Dispatched events for order ${orderId}, status: ${newStatus}`);
      
      // Add a longer delay before closing to ensure UI updates
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

  const handleCancellation = async (isPenaltyFree: boolean) => {
    setIsSubmitting(true);
    
    try {
      console.log(`Admin useOrderStatus: Cancelling order ${orderId}, penalty free: ${isPenaltyFree}`);
      
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
      
      // Enhanced event dispatching with multiple event types and rich metadata
      const timestamp = Date.now();
      const eventId = `${orderId}-cancel-${timestamp}`;
      
      // Use CustomEvent with rich detail payload and force update flag
      const cancelEvent = new CustomEvent('order-status-change', { 
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
      });
      window.dispatchEvent(cancelEvent);
      
      // Dispatch multiple events to ensure all components receive the update
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
      
      // Set localStorage to persist the cancellation
      try {
        localStorage.setItem(`order_${orderId}_status`, 'cancelled');
      } catch (e) {
        console.warn('Local storage update failed:', e);
      }
      
      // Extra log for debugging
      console.log(`Admin useOrderStatus: Dispatched cancellation events for order ${orderId}`);
      
      // Increased delay to ensure UI updates before closing
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
    handleStatusChange,
    handleCancellation
  };
};
