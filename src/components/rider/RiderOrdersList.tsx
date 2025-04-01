
import { useState } from 'react';
import { OrderStatus } from '@/components/ui/OrderItem';
import RiderOrderItem from './RiderOrderItem';
import OrderDetailsDialog from '@/components/admin/orders/OrderDetailsDialog';

interface Order {
  id: string;
  storeName: string;
  category: string;
  date: string;
  status: OrderStatus;
  items: string[];
  total: number;
  assignedTo?: string;
}

interface RiderOrdersListProps {
  orders: Order[];
  onStatusChange?: (id: string, newStatus: OrderStatus) => void;
  onTakeOrder: (id: string) => void;
  onCompleteOrder: (id: string) => void;
}

const RiderOrdersList = ({ 
  orders, 
  onStatusChange, 
  onTakeOrder,
  onCompleteOrder 
}: RiderOrdersListProps) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleViewDetails = (id: string) => {
    // Find the order by id
    const order = orders.find(order => order.id === id);
    
    if (order) {
      setSelectedOrder(order);
      setIsDialogOpen(true);
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
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <RiderOrderItem
            key={order.id}
            order={order}
            onViewDetails={handleViewDetails}
            onTakeOrder={onTakeOrder}
            onCompleteOrder={onCompleteOrder}
          />
        ))}
      </div>
      
      <OrderDetailsDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        order={selectedOrder}
        onStatusChange={handleStatusChange}
      />
    </>
  );
};

export default RiderOrdersList;
