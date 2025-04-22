
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { OrderStatus } from '@/components/ui/OrderItem';
import { useAuth } from '@/context/AuthContext';
import OrderStatusBadge from './details/OrderStatusBadge';
import OrderItemsList from './details/OrderItemsList';
import OrderStatusActions from './details/OrderStatusActions';
import { useOrderStatus } from './hooks/useOrderStatus';

interface OrderDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    storeName: string;
    category: string;
    date: string;
    status: OrderStatus;
    items: string[];
    total?: number;
  } | null;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

const OrderDetailsDialog = ({ isOpen, onClose, order, onStatusChange }: OrderDetailsDialogProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  if (!order) return null;

  const { isSubmitting, handleStatusChange } = useOrderStatus(order.id, onStatusChange, onClose);
  
  const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleStatusChangeWithAuth = async (newStatus: OrderStatus) => {
    if (user?.userType === 'admin' || user?.userType === 'rider' || 
       (user?.userType === 'customer' && newStatus === 'cancelled')) {
      await handleStatusChange(newStatus);
    } else {
      toast({
        title: "Not authorized",
        description: "You don't have permission to change order status.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Order #{order.id.slice(-6)}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">{formattedDate}</p>
              <p className="text-base mt-1">{order.storeName}</p>
              <p className="text-sm text-gray-600">{order.category}</p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
          
          <OrderItemsList items={order.items} />
          
          {order.total && (
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-medium">Total:</span>
              <span className="font-semibold text-jamcart-green">${order.total.toFixed(2)}</span>
            </div>
          )}
          
          {user?.userType === 'customer' && order.status === 'pending' && (
            <div className="pt-4 border-t">
              <Button
                onClick={() => handleStatusChangeWithAuth('cancelled')}
                variant="destructive"
                className="w-full"
                disabled={isSubmitting}
              >
                Cancel Order
              </Button>
            </div>
          )}
          
          {(user?.userType === 'admin' || user?.userType === 'rider') && (
            <OrderStatusActions
              currentStatus={order.status}
              onStatusChange={handleStatusChangeWithAuth}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
