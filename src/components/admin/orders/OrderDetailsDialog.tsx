
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { OrderItem, OrderStatus } from '@/pages/admin/orders/types';
import { useOrderDialog } from './hooks/useOrderDialog';
import OrderDialogHeader from './details/OrderDialogHeader';
import OrderDialogContent from './details/OrderDialogContent';

interface OrderDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    storeName: string;
    category: string;
    date: string;
    status: OrderStatus;
    items: OrderItem[];
    total?: number;
  } | null;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

const OrderDetailsDialog = ({ 
  isOpen, 
  onClose, 
  order, 
  onStatusChange 
}: OrderDetailsDialogProps) => {
  const { user } = useAuth();
  const { 
    currentStatus,
    handleClose,
    handleStatusChange,
    handleOrderCancellation
  } = useOrderDialog({
    order,
    onStatusChange,
    onClose
  });
  
  if (!isOpen || !order) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Order #{order.id.slice(-6)}</DialogTitle>
        </DialogHeader>
        
        <OrderDialogContent
          order={order}
          currentStatus={currentStatus}
          user={user}
          onStatusChange={handleStatusChange}
          onCancellation={handleOrderCancellation}
          isDialogOpen={isOpen}
        />
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
