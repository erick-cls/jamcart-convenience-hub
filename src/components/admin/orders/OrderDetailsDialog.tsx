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
import { useEffect, useState, useCallback } from 'react';
import { OrderItem } from '@/pages/admin/orders/types';

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

const OrderDetailsDialog = ({ isOpen, onClose, order, onStatusChange }: OrderDetailsDialogProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [renderKey, setRenderKey] = useState<number>(Date.now());
  
  const [currentStatus, setCurrentStatus] = useState<OrderStatus | null>(null);
  
  useEffect(() => {
    if (order) {
      setCurrentStatus(order.status);
      setRenderKey(Date.now());
      console.log(`OrderDetailsDialog: Initialized with order status ${order.status}, key: ${renderKey}`);
    }
  }, [order]);
  
  const handleClose = useCallback(() => {
    console.log("OrderDetailsDialog: Dialog closing, broadcasting status update events");
    
    if (order && currentStatus) {
      const closeEvent = new CustomEvent('order-status-change', {
        detail: { 
          orderId: order.id,
          newStatus: currentStatus,
          timestamp: Date.now(),
          action: 'dialog-close',
          source: 'dialog-close'
        }
      });
      window.dispatchEvent(closeEvent);
      
      window.dispatchEvent(new CustomEvent('storage', { 
        detail: { 
          orderId: order.id,
          newStatus: currentStatus,
          timestamp: Date.now(),
          action: 'dialog-close',
          source: 'dialog-close'
        } 
      }));
    }
    
    setCurrentStatus(null);
    onClose();
  }, [onClose, order, currentStatus]);
  
  const { isSubmitting, handleStatusChange, handleCancellation } = useOrderStatus(
    order?.id || '', 
    (orderId, newStatus) => {
      setCurrentStatus(newStatus);
      const newRenderKey = Date.now();
      setRenderKey(newRenderKey);
      
      console.log(`OrderDetailsDialog: Status changed to ${newStatus}, new key: ${newRenderKey}`);
      
      onStatusChange(orderId, newStatus);
      
      const updateEvent = new CustomEvent('order-status-change', {
        detail: { 
          orderId, 
          newStatus, 
          timestamp: Date.now(),
          source: 'dialog-status-change',
          key: newRenderKey
        }
      });
      window.dispatchEvent(updateEvent);
      
      window.dispatchEvent(new CustomEvent('storage', { 
        detail: { 
          orderId, 
          newStatus, 
          timestamp: Date.now(),
          source: 'dialog-status-change',
          key: newRenderKey
        } 
      }));
    },
    handleClose
  );
  
  if (!isOpen || !order) return null;
  
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
    const orderCreationTime = new Date(order.date).getTime();
    const currentTime = Date.now();
    const elapsedMinutes = (currentTime - orderCreationTime) / (1000 * 60);
    
    const isPenaltyFree = elapsedMinutes <= 10;
    
    console.log(`OrderDetailsDialog: Processing cancellation, isPenaltyFree: ${isPenaltyFree}`);
    
    await handleCancellation(isPenaltyFree);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
            <div key={`status-badge-wrapper-${renderKey}`}>
              <OrderStatusBadge 
                status={displayStatus} 
                key={`status-badge-${renderKey}`}
              />
            </div>
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
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
