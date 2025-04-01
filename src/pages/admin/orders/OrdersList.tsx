
import { useState } from 'react';
import OrderItem, { OrderStatus } from '@/components/ui/OrderItem';
import { useNavigate } from 'react-router-dom';
import OrderDetailsDialog from '@/components/admin/orders/OrderDetailsDialog';

interface Order {
  id: string;
  storeName: string;
  category: string;
  date: string;
  status: OrderStatus;
  items: string[];
  total: number;
}

interface OrdersListProps {
  orders: Order[];
  onViewDetails?: (id: string) => void;
  onStatusChange?: (id: string, newStatus: OrderStatus) => void;
}

const OrdersList = ({ orders, onViewDetails, onStatusChange }: OrdersListProps) => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleViewDetails = (id: string) => {
    // Find the order by id
    const order = orders.find(order => order.id === id);
    
    if (order) {
      setSelectedOrder(order);
      setIsDialogOpen(true);
    }
    
    // Still call the original onViewDetails if provided
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
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <OrderItem
            key={order.id}
            id={order.id}
            storeName={order.storeName}
            category={order.category}
            date={order.date}
            status={order.status}
            items={order.items}
            total={order.total}
            onViewDetails={handleViewDetails}
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

export default OrdersList;
