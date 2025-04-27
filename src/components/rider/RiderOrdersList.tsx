
import { useState } from 'react';
import { OrderStatus } from '@/components/ui/OrderItem';
import RiderOrderItem from './RiderOrderItem';
import OrderDetailsDialog from '@/components/admin/orders/OrderDetailsDialog';
import { useToast } from '@/hooks/use-toast';
import { OrderItem } from '@/pages/admin/orders/types';

interface Order {
  id: string;
  storeName: string;
  category: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
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
  const { toast } = useToast();
  
  const handleViewDetails = (id: string) => {
    console.log("View details clicked for order:", id);
    // Find the order by id
    const order = orders.find(order => order.id === id);
    
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
  
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    if (onStatusChange) {
      onStatusChange(orderId, newStatus);
      toast({
        title: "Status Updated",
        description: `Order status has been updated to ${newStatus}.`
      });
    }
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedOrder(null);
  };
  
  return (
    <>
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-700 mb-2">No orders available</h3>
          <p className="text-gray-500">Check back later for new delivery assignments.</p>
        </div>
      ) : (
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
      )}
      
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
