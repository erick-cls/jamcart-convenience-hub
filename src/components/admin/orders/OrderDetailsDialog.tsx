
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { OrderStatus } from '@/components/ui/OrderItem';
import { useAuth } from '@/context/AuthContext';
import OrderStatusBadge from './details/OrderStatusBadge';
import OrderItemsList from './details/OrderItemsList';
import OrderStatusActions from './details/OrderStatusActions';
import OrderCancellationTimer from './details/OrderCancellationTimer';
import { useOrderStatus } from './hooks/useOrderStatus';
import { useEffect, useState } from 'react';

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
  
  // Use local state to track order status for immediate UI updates
  const [currentStatus, setCurrentStatus] = useState<OrderStatus | null>(null);
  
  // Update current status when order changes
  useEffect(() => {
    if (order) {
      setCurrentStatus(order.status);
      console.log(`OrderDetailsDialog: Order ${order.id} status is ${order.status}`);
    }
  }, [order]);
  
  // Call hooks before any conditional returns to comply with React's rules of hooks
  const { isSubmitting, handleStatusChange, handleCancellation } = useOrderStatus(
    order?.id || '', 
    (orderId, newStatus) => {
      // Update local state immediately
      setCurrentStatus(newStatus);
      // Call the parent handler
      onStatusChange(orderId, newStatus);
    },
    onClose
  );
  
  // Now we can safely return null if needed
  if (!isOpen || !order) return null;
  
  // Use our local status if available, otherwise fall back to the prop
  const displayStatus = currentStatus || order.status;
  
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

  const handleOrderCancellation = async () => {
    // Get elapsed time since order creation
    const orderCreationTime = new Date(order.date).getTime();
    const currentTime = Date.now();
    const elapsedMinutes = (currentTime - orderCreationTime) / (1000 * 60);
    
    // Check if cancellation is within free period (10 minutes)
    const isPenaltyFree = elapsedMinutes <= 10;
    
    // Process cancellation with appropriate penalty flag
    await handleCancellation(isPenaltyFree);
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
            <OrderStatusBadge status={displayStatus} />
          </div>
          
          <OrderItemsList items={order.items || []} />
          
          {order.total && (
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-medium">Total:</span>
              <span className="font-semibold text-jamcart-green">${order.total.toFixed(2)}</span>
            </div>
          )}
          
          {user?.userType === 'customer' && displayStatus === 'pending' && (
            <div className="pt-4 border-t">
              <OrderCancellationTimer 
                orderId={order.id}
                orderDate={order.date}
                onCancel={handleOrderCancellation}
                isSubmitting={isSubmitting}
              />
            </div>
          )}
          
          {(user?.userType === 'admin' || user?.userType === 'rider') && (
            <OrderStatusActions
              currentStatus={displayStatus}
              onStatusChange={handleStatusChangeWithAuth}
              isSubmitting={isSubmitting}
              isPastCancellationPeriod={(displayStatus === 'cancelled') ? 
                ((Date.now() - new Date(order.date).getTime()) > (10 * 60 * 1000)) : false}
              orderId={order.id}
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
