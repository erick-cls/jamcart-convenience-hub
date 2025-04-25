
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
  const { todayOrders, yesterdayOrders, earlierOrders } = useOrderFilters(localOrders);
  
  // Update local orders when the parent component's orders change - with immediate effect
  useEffect(() => {
    console.log("UserOrdersList received updated orders:", orders.map(o => `${o.id.slice(-6)}: ${o.status}`).join(', '));
    setLocalOrders(orders);
  }, [orders]);
  
  // Listen for storage events but without the frequent interval refreshes
  useEffect(() => {
    const handleStorageEvent = () => {
      console.log("UserOrdersList: Storage event triggered refresh");
    };
    
    window.addEventListener('storage', handleStorageEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);
  
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
    
    // Dispatch single storage event to trigger refresh
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
    
    // Single dispatch event instead of multiple
    window.dispatchEvent(new Event('storage'));
  }, [localOrders, toast, onOrderUpdate]);
  
  if (localOrders.length === 0) {
    return <EmptyOrdersList />;
  }
  
  return (
    <div>
      <OrdersSection title="Today" orders={todayOrders} onViewDetails={handleViewDetails} />
      <OrdersSection title="Yesterday" orders={yesterdayOrders} onViewDetails={handleViewDetails} />
      <OrdersSection title="Earlier" orders={earlierOrders} onViewDetails={handleViewDetails} />
      
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
