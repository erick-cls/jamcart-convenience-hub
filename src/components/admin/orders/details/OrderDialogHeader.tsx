
import { OrderStatus } from '@/components/ui/OrderItem';
import OrderStatusBadge from './OrderStatusBadge';

interface OrderDialogHeaderProps {
  orderId: string;
  storeName: string;
  category: string;
  date: string;
  status: OrderStatus;
}

const OrderDialogHeader = ({
  orderId,
  storeName,
  category,
  date,
  status
}: OrderDialogHeaderProps) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500">{formattedDate}</p>
        <p className="text-base mt-1">{storeName}</p>
        <p className="text-sm text-gray-600">{category}</p>
      </div>
      <OrderStatusBadge status={status} />
    </div>
  );
};

export default OrderDialogHeader;
