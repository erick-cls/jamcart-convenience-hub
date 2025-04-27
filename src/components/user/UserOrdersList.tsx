
import { useState, useEffect, useCallback } from 'react';
import { OrderStatus } from '@/components/ui/OrderItem';
import OrderDetailsDialog from '@/components/admin/orders/OrderDetailsDialog';
import { useToast } from '@/hooks/use-toast';
import { useOrderFilters } from '@/hooks/useOrderFilters';
import EmptyOrdersList from './EmptyOrdersList';
import OrdersSection from './OrdersSection';

interface Order {
  id: string;
  storeName: string;
  category: string;
  date: string;
  status: OrderStatus;
  items: string[];
  total: number;
  userId?: string;
  userName?: string;
  riderId?: string | null;
  riderName?: string | null;
  isNew?: boolean;
}

interface UserOrdersListProps {
  orders: Order[];
  onOrderUpdate?: () => void;
}

const UserOrdersList = ({ orders, onOrderUpdate }: UserOrdersListProps) => {
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [localOrders, setLocalOrders] = useState<Order[]>(orders);
  const [orderStatusChangeTime, setOrderStatusChangeTime] = useState<number>(Date.now());
  const { todayOrders, yesterdayOrders, earlierOrders } = useOrderFilters(localOrders);
  
  // Update local orders when the parent component's orders change - with immediate effect
  useEffect(() => {
    console.log("UserOrdersList received updated orders:", orders.map(o => `${o.id.slice(-6)}: ${o.status}`).join(', '));
    setLocalOrders(orders);
  }, [orders]);
  
  // Listen for storage and custom events to trigger status updates
  useEffect(() => {
    const handleStorageEvent = (e: Event) => {
      console.log("UserOrdersList: Event triggered refresh", e);
      
      // Check if this is a CustomEvent with order details
      if (e instanceof CustomEvent && e.detail) {
        const { orderId, newStatus, forceUpdate } = e.detail;
        
        if (orderId && newStatus) {
          console.log(`UserOrdersList: Received specific update for order ${orderId} to ${newStatus}`);
          
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
        console.log("UserOrdersList: Triggering onOrderUpdate callback from event");
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
  
  const handleViewDetails = (id: string) => {
    console.log("View details clicked for order:", id);
    const order = localOrders.find(order => order.id === id);
    
    if (order) {
      // Check if there's a persisted status in localStorage for this order
      try {
        const persistedStatus = localStorage.getItem(`order_${id}_status`);
        if (persistedStatus && persistedStatus !== order.status) {
          console.log(`UserOrdersList: Found persisted status ${persistedStatus} for order ${id}`);
          order.status = persistedStatus as OrderStatus;
        }
      } catch (e) {
        console.warn('Error checking localStorage status:', e);
      }
      
      setSelectedOrder(order);
      setIsDialogOpen(true);
    } else {
      toast({
        title: "Order not found",
        description: "The selected order could not be found.",
        variant: "destructive"
      });
    }
  };
  
  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedOrder(null);
    
    // Ensure we update parent component when dialog closes
    if (onOrderUpdate) {
      console.log("UserOrdersList: Triggering onOrderUpdate callback after dialog close");
      onOrderUpdate();
    }
    
    // Update status change time to trigger re-render
    setOrderStatusChangeTime(Date.now());
    
    // Dispatch custom event to ensure all components are notified
    window.dispatchEvent(new CustomEvent('order-status-change', {
      detail: {
        action: 'dialog-closed',
        timestamp: Date.now()
      }
    }));
    
    // Also dispatch storage event for components listening to that
    window.dispatchEvent(new CustomEvent('storage'));
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
      console.log("UserOrdersList: Triggering onOrderUpdate callback after status change");
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
  
  if (localOrders.length === 0) {
    return <EmptyOrdersList />;
  }
  
  return (
    <div key={`order-list-container-${orderStatusChangeTime}`}>
      <OrdersSection 
        title="Today" 
        orders={todayOrders} 
        onViewDetails={handleViewDetails} 
        key={`today-orders-${orderStatusChangeTime}`}
      />
      <OrdersSection 
        title="Yesterday" 
        orders={yesterdayOrders} 
        onViewDetails={handleViewDetails} 
        key={`yesterday-orders-${orderStatusChangeTime}`}
      />
      <OrdersSection 
        title="Earlier" 
        orders={earlierOrders} 
        onViewDetails={handleViewDetails} 
        key={`earlier-orders-${orderStatusChangeTime}`}
      />
      
      {selectedOrder && (
        <OrderDetailsDialog
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          order={selectedOrder}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default UserOrdersList;
