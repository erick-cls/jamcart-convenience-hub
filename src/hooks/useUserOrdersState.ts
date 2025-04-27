
import { useState, useEffect, useCallback } from 'react';
import { OrderStatus } from '@/components/ui/OrderItem';
import { useToast } from '@/hooks/use-toast';
import { OrderItem } from '@/pages/admin/orders/types';

export interface Order {
  id: string;
  storeName: string;
  category: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  userId?: string;
  userName?: string;
  riderId?: string | null;
  riderName?: string | null;
  isNew?: boolean;
  store?: {
    vendor: string;
  };
  user?: {
    name: string;
    email: string;
    phone: string;
  };
  address?: string;
  price?: number;
  notes?: string;
  estimatedTime?: string;
}

export const useUserOrdersState = (orders: Order[], onOrderUpdate?: () => void) => {
  const { toast } = useToast();
  const [localOrders, setLocalOrders] = useState<Order[]>(orders);
  const [orderStatusChangeTime, setOrderStatusChangeTime] = useState<number>(Date.now());
  
  // Update local orders when the parent component's orders change
  useEffect(() => {
    console.log("useUserOrdersState received updated orders:", 
      orders.map(o => `${o.id.slice(-6)}: ${o.status}`).join(', '));
    setLocalOrders(orders);
  }, [orders]);
  
  // Listen for storage and custom events to trigger status updates
  useEffect(() => {
    const handleStorageEvent = (e: Event) => {
      console.log("useUserOrdersState: Event triggered refresh", e);
      
      // Check if this is a CustomEvent with order details
      if (e instanceof CustomEvent && e.detail) {
        const { orderId, newStatus, forceUpdate } = e.detail;
        
        if (orderId && newStatus) {
          console.log(`useUserOrdersState: Received specific update for order ${orderId} to ${newStatus}`);
          
          // Update specific order in local state
          setLocalOrders(prevOrders => 
            prevOrders.map(order => 
              order.id === orderId 
                ? { ...order, status: newStatus } 
                : order
            )
          );
        }
      }
      
      // Always update timestamp to force re-render
      setOrderStatusChangeTime(Date.now());
      
      // Notify parent component about the update
      if (onOrderUpdate) {
        console.log("useUserOrdersState: Triggering onOrderUpdate callback from event");
        onOrderUpdate();
      }
    };
    
    // Listen for both storage event and custom order-status-change event
    window.addEventListener('storage', handleStorageEvent);
    window.addEventListener('order-status-change', handleStorageEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('order-status-change', handleStorageEvent);
    };
  }, [onOrderUpdate]);
  
  const handleStatusChange = useCallback((orderId: string, newStatus: OrderStatus) => {
    console.log(`Status changed for order ${orderId} to ${newStatus}`);
    
    // Update local state immediately for instant UI feedback
    setLocalOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      )
    );
    
    // Save status to localStorage for persistence
    try {
      localStorage.setItem(`order_${orderId}_status`, newStatus);
    } catch (e) {
      console.warn('Error saving to localStorage:', e);
    }
    
    // Update status change time to trigger re-render
    setOrderStatusChangeTime(Date.now());
    
    if (newStatus === 'cancelled') {
      const order = localOrders.find(o => o.id === orderId);
      if (order) {
        const orderTime = new Date(order.date).getTime();
        const currentTime = Date.now();
        const minutesSinceOrder = (currentTime - orderTime) / (1000 * 60);
        
        if (minutesSinceOrder <= 10) {
          toast({
            title: "Order cancelled",
            description: "Your order has been cancelled without penalty.",
          });
        } else {
          toast({
            title: "Order cancelled with penalty",
            description: "Your order has been cancelled. A $1000 JMD penalty fee has been charged to your card.",
          });
        }
      }
    } else {
      toast({
        title: "Status updated",
        description: `Order status has been updated to ${newStatus}.`
      });
    }
    
    // Always trigger the onOrderUpdate callback when status changes
    if (onOrderUpdate) {
      console.log("useUserOrdersState: Triggering onOrderUpdate callback after status change");
      onOrderUpdate();
    }
    
    // Dispatch custom event with detailed payload for other components
    const updateEvent = new CustomEvent('order-status-change', {
      detail: {
        orderId,
        newStatus,
        timestamp: Date.now(),
        source: 'userOrdersList-statusChange',
        forceUpdate: true
      },
      bubbles: true,
      cancelable: true
    });
    window.dispatchEvent(updateEvent);
    
    // Also dispatch storage event for components listening to that
    window.dispatchEvent(new CustomEvent('storage', {
      detail: {
        orderId,
        newStatus,
        timestamp: Date.now(),
        source: 'userOrdersList-statusChange',
        forceUpdate: true
      },
      bubbles: true,
      cancelable: true
    }));
  }, [localOrders, toast, onOrderUpdate]);
  
  return {
    localOrders,
    orderStatusChangeTime,
    handleStatusChange,
    setOrderStatusChangeTime
  };
};
