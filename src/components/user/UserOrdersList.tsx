
import { useState, useEffect } from 'react';
import { useOrderFilters } from '@/hooks/useOrderFilters';
import EmptyOrdersList from './EmptyOrdersList';
import OrdersSection from './OrdersSection';
import OrderDetailsView from './OrderDetailsView';
import { useUserOrdersState, Order } from '@/hooks/useUserOrdersState';
import { useToast } from '@/hooks/use-toast';
import { OrderStatus } from '@/components/ui/OrderItem';

interface UserOrdersListProps {
  orders: Order[];
  onOrderUpdate?: () => void;
}

const UserOrdersList = ({ orders, onOrderUpdate }: UserOrdersListProps) => {
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const {
    localOrders,
    orderStatusChangeTime,
    handleStatusChange,
  } = useUserOrdersState(orders, onOrderUpdate);
  
  const { todayOrders, yesterdayOrders, earlierOrders } = useOrderFilters(localOrders);
  
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
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedOrder(null);
  };
  
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
      
      <OrderDetailsView
        isOpen={isDialogOpen}
        selectedOrder={selectedOrder}
        onClose={handleCloseDialog}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default UserOrdersList;
