
import { useState, useEffect } from 'react';
import { OrderStatus } from '@/components/ui/OrderItem';
import OrderDetailsDialog from '@/components/admin/orders/OrderDetailsDialog';
import { useToast } from '@/hooks/use-toast';
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
  const [localOrders, setLocalOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);
  
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
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedOrder(null);
  };
  
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    console.log(`Status changed for order ${orderId} to ${newStatus}`);
    
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
    
    if (onOrderUpdate) {
      onOrderUpdate();
    }
  };
  
  if (localOrders.length === 0) {
    return <EmptyOrdersList />;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const todayOrders = localOrders.filter(order => {
    const orderDate = new Date(order.date);
    orderDate.setHours(0, 0, 0, 0);
    return orderDate.getTime() === today.getTime();
  });
  
  const yesterdayOrders = localOrders.filter(order => {
    const orderDate = new Date(order.date);
    orderDate.setHours(0, 0, 0, 0);
    return orderDate.getTime() === yesterday.getTime();
  });
  
  const earlierOrders = localOrders.filter(order => {
    const orderDate = new Date(order.date);
    orderDate.setHours(0, 0, 0, 0);
    return orderDate.getTime() < yesterday.getTime();
  });
  
  return (
    <>
      <OrdersSection title="Today" orders={todayOrders} onViewDetails={handleViewDetails} />
      <OrdersSection title="Yesterday" orders={yesterdayOrders} onViewDetails={handleViewDetails} />
      <OrdersSection title="Earlier" orders={earlierOrders} onViewDetails={handleViewDetails} />
      
      <OrderDetailsDialog
        isOpen={isDialogOpen}
        onClose={() => {
          handleCloseDialog();
          if (onOrderUpdate) {
            onOrderUpdate();
          }
        }}
        order={selectedOrder}
        onStatusChange={handleStatusChange}
      />
    </>
  );
};

export default UserOrdersList;
