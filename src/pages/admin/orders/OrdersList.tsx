import { useState, useEffect } from 'react';
import { OrderStatus } from '@/components/ui/OrderItem';
import { useOrdersState, Order } from './useOrdersState';
import OrderDetailsDialog from '@/components/admin/orders/OrderDetailsDialog';
import PendingOrdersSection from './components/PendingOrdersSection';
import AcceptedOrdersSection from './components/AcceptedOrdersSection';
import CompletedOrdersSection from './components/CompletedOrdersSection';
import AssignRiderDialog from './components/AssignRiderDialog';
import { autoCancelPendingOrders } from './orderActions';

interface OrdersListProps {
  orders: Order[];
  onViewDetails?: (id: string) => void;
  onStatusChange?: (id: string, newStatus: OrderStatus) => void;
  onAssignRider?: (id: string, riderId: string) => void;
  showUserInfo?: boolean;
}

const OrdersList = ({ 
  orders: initialOrders, 
  onViewDetails, 
  onStatusChange,
  onAssignRider,
  showUserInfo = false
}: OrdersListProps) => {
  const { getAvailableRiders } = useOrdersState();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAssignRiderDialogOpen, setIsAssignRiderDialogOpen] = useState(false);
  
  useEffect(() => {
    const updatedOrders = autoCancelPendingOrders(initialOrders);
    setOrders(updatedOrders);
  }, [initialOrders]);

  const handleViewDetails = (id: string) => {
    const order = orders.find(order => order.id === id);
    
    if (order) {
      setSelectedOrder(order);
      setIsDialogOpen(true);
    }
    
    if (onViewDetails) {
      onViewDetails(id);
    }
  };
  
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    if (onStatusChange) {
      onStatusChange(orderId, newStatus);
    }
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleAssignRider = (order: Order) => {
    setSelectedOrder(order);
    setIsAssignRiderDialogOpen(true);
  };

  const handleRiderSelection = (riderId: string) => {
    if (selectedOrder && onAssignRider) {
      onAssignRider(selectedOrder.id, riderId);
      setIsAssignRiderDialogOpen(false);
      setSelectedOrder(null);
    }
  };
  
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const acceptedOrders = orders.filter(order => order.status === 'accepted');
  const completedOrders = orders.filter(order => 
    order.status === 'completed' || order.status === 'declined' || order.status === 'cancelled'
  );
  
  const availableRiders = getAvailableRiders();
  
  return (
    <>
      <PendingOrdersSection 
        orders={pendingOrders}
        onViewDetails={handleViewDetails}
        onAssignRider={handleAssignRider}
        showUserInfo={showUserInfo}
      />
      
      <AcceptedOrdersSection 
        orders={acceptedOrders}
        onViewDetails={handleViewDetails}
        onAssignRider={handleAssignRider}
        showUserInfo={showUserInfo}
      />
      
      <CompletedOrdersSection 
        orders={completedOrders}
        onViewDetails={handleViewDetails}
        showUserInfo={showUserInfo}
      />
      
      <OrderDetailsDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        order={selectedOrder}
        onStatusChange={handleStatusChange}
      />

      <AssignRiderDialog
        isOpen={isAssignRiderDialogOpen}
        onClose={() => setIsAssignRiderDialogOpen(false)}
        selectedOrder={selectedOrder}
        availableRiders={availableRiders}
        onAssignRider={handleRiderSelection}
      />
    </>
  );
};

export default OrdersList;
