
import OrderStatusActions from './OrderStatusActions';
import { OrderStatus } from '@/pages/admin/orders/types';

interface AdminActionsSectionProps {
  currentStatus: OrderStatus;
  onStatusChange: (newStatus: OrderStatus) => void;
  isSubmitting: boolean;
  isPastCancellationPeriod: boolean;
  orderId: string;
}

const AdminActionsSection = ({
  currentStatus,
  onStatusChange,
  isSubmitting,
  isPastCancellationPeriod,
  orderId
}: AdminActionsSectionProps) => {
  return (
    <OrderStatusActions
      currentStatus={currentStatus}
      onStatusChange={onStatusChange}
      isSubmitting={isSubmitting}
      isPastCancellationPeriod={isPastCancellationPeriod}
      orderId={orderId}
    />
  );
};

export default AdminActionsSection;
