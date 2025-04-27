
import { useState, useCallback } from 'react';
import { OrderStatus } from '@/components/ui/OrderItem';
import OrderDetailsDialog from '@/components/admin/orders/OrderDetailsDialog';
import { Order } from '@/hooks/useUserOrdersState';

interface OrderDetailsViewProps {
  isOpen: boolean;
  selectedOrder: Order | null;
  onClose: () => void;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

const OrderDetailsView = ({ 
  isOpen, 
  selectedOrder, 
  onClose, 
  onStatusChange 
}: OrderDetailsViewProps) => {

  const handleCloseDialog = useCallback(() => {
    onClose();
    
    // Dispatch custom event to ensure all components are notified
    window.dispatchEvent(new CustomEvent('order-status-change', {
      detail: {
        action: 'dialog-closed',
        timestamp: Date.now()
      }
    }));
    
    // Also dispatch storage event for components listening to that
    window.dispatchEvent(new CustomEvent('storage'));
  }, [onClose]);
  
  return (
    <>
      {selectedOrder && (
        <OrderDetailsDialog
          isOpen={isOpen}
          onClose={handleCloseDialog}
          order={selectedOrder}
          onStatusChange={onStatusChange}
        />
      )}
    </>
  );
};

export default OrderDetailsView;
