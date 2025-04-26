
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
  
  // Listen for storage events to trigger status updates
  useEffect(() => {
    const handleStorageEvent = () => {
      console.log("UserOrdersList: Storage event triggered refresh");
      setOrderStatusChangeTime(Date.now());
      
      // Notify parent component about the update
      if (onOrderUpdate) {
        console.log("UserOrdersList: Triggering onOrderUpdate callback from storage event");
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
    window.dispatchEvent(new Event('order-status-change'));
    
    // Also dispatch storage event for components listening to that
    window.dispatchEvent(new Event('storage'));
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
    
    // Dispatch custom event for other components
    window.dispatchEvent(new Event('order-status-change'));
    
    // Also dispatch storage event for components listening to that
    window.dispatchEvent(new Event('storage'));
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
