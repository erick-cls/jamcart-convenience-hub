
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
      
      // Create unique event ID for tracking
      const timestamp = Date.now();
      const eventId = `${orderId}-${newStatus}-${timestamp}`;
      
      // Broadcast multiple events with rich metadata to ensure all components update
      const statusChangeEvent = new CustomEvent('order-status-change', { 
        detail: { 
          orderId, 
          newStatus, 
          timestamp, 
          eventId, 
          source: 'user-hook',
          forceUpdate: true
        },
        bubbles: true,
        cancelable: true
      });
      window.dispatchEvent(statusChangeEvent);
      
      // Also dispatch storage event as fallback for components listening to that
      window.dispatchEvent(new CustomEvent('storage', { 
        detail: { 
          orderId, 
          newStatus, 
          timestamp, 
          eventId, 
          source: 'user-hook',
          forceUpdate: true
        },
        bubbles: true,
        cancelable: true
      }));
      
      // Extra notification for debugging
      console.log(`useOrderStatus: Dispatched events for order ${orderId}, status ${newStatus}`);
      
      toast({
        title: "Order status updated",
        description: `Order #${orderId.slice(-6)} has been ${newStatus}`,
        variant: "default",
      });
      
      // Close with longer delay to ensure updates are processed
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
      console.log(`useOrderStatus: Cancelling order ${orderId}, penalty free: ${isPenaltyFree}`);
      
      // Call onStatusChange immediately for instant UI update with CANCELLED status
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
      
      // Enhanced event dispatching with multiple events and rich metadata
      const timestamp = Date.now();
      const eventId = `${orderId}-cancel-${timestamp}`;
      
      // Dispatch status change event with clear cancellation flag and force update
      const cancelEvent = new CustomEvent('order-status-change', { 
        detail: { 
          orderId, 
          newStatus: 'cancelled', 
          timestamp,
          eventId,
          cancelled: true, 
          isPenaltyFree,
          source: 'user-cancellation',
          forceUpdate: true
        },
        bubbles: true,
        cancelable: true
      });
      window.dispatchEvent(cancelEvent);
      
      // Also dispatch storage event with same data as fallback
      window.dispatchEvent(new CustomEvent('storage', { 
        detail: { 
          orderId, 
          newStatus: 'cancelled', 
          timestamp,
          eventId,
          cancelled: true, 
          isPenaltyFree,
          source: 'user-cancellation',
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
      
      // Log success for debugging
      console.log(`useOrderStatus: Dispatched cancellation events for order ${orderId}`);
      
      // Wait a moment to ensure UI updates before closing the dialog
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
