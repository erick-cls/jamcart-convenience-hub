
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderStatus } from '@/components/ui/OrderItem';
import OrderItem from '@/components/ui/OrderItem';
import OrderDetailsDialog from '@/components/admin/orders/OrderDetailsDialog';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  storeName: string;
  category: string;
  date: string;
  status: OrderStatus;
  items: string[];
  total: number;
  userId?: string;
}

interface UserOrdersListProps {
  orders: Order[];
}

const UserOrdersList = ({ orders }: UserOrdersListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleViewDetails = (id: string) => {
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
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedOrder(null);
  };
  
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    // For customer view, they can't change status
    toast({
      title: "Not authorized",
      description: "You don't have permission to change order status.",
      variant: "destructive"
    });
  };
  
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8 text-center">
        <h3 className="text-base md:text-lg font-medium mb-2">No orders found</h3>
        <p className="text-sm md:text-base text-gray-500 mb-4 md:mb-6">
          You haven't placed any orders yet.
        </p>
      </div>
    );
  }
  
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

export default UserOrdersList;
