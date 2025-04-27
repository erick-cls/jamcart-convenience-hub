
import { useOrderStatusUpdate } from './useOrderStatusUpdate';
import { useOrderCancellation } from './useOrderCancellation';
import { OrderStatus } from '@/pages/admin/orders/types';

export const useOrderStatus = (
  orderId: string,
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void,
  onClose: () => void
) => {
  const { isSubmitting: isStatusSubmitting, handleStatusChange } = useOrderStatusUpdate(
    orderId,
    onStatusChange,
    onClose
  );
  
  const { isSubmitting: isCancellationSubmitting, handleCancellation } = useOrderCancellation(
    orderId,
    onStatusChange,
    onClose
  );

  return {
    isSubmitting: isStatusSubmitting || isCancellationSubmitting,
    handleStatusChange,
    handleCancellation
  };
};
