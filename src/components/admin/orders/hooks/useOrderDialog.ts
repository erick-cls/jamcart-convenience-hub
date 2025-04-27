
import { useState, useEffect, useCallback } from 'react';
import { OrderStatus } from '@/components/ui/OrderItem';
import { useOrderStatus } from './useOrderStatus';

interface UseOrderDialogProps {
  order: {
    id: string;
    status: OrderStatus;
  } | null;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onClose: () => void;
}

export const useOrderDialog = ({ 
  order, 
  onStatusChange, 
  onClose 
}: UseOrderDialogProps) => {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus | null>(null);
  
  useEffect(() => {
    if (order) {
      setCurrentStatus(order.status);
    }
  }, [order]);

  const handleClose = useCallback(() => {
    if (order && currentStatus) {
      window.dispatchEvent(new CustomEvent('order-status-change', {
        detail: { 
          orderId: order.id,
          newStatus: currentStatus,
          timestamp: Date.now(),
          action: 'dialog-close',
          source: 'dialog-close'
        }
      }));
      
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
      onStatusChange(orderId, newStatus);
    },
    handleClose
  );

  return {
    currentStatus,
    isSubmitting,
    handleClose,
    handleStatusChange,
    handleOrderCancellation: handleCancellation
  };
};
