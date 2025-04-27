
import { OrderStatus } from '@/components/ui/OrderItem';
import { OrderItem } from '@/pages/admin/orders/types';
import OrderDialogHeader from './OrderDialogHeader';
import OrderItemsList from './OrderItemsList';
import OrderStatusActions from './OrderStatusActions';
import OrderCancellationTimer from './OrderCancellationTimer';

interface OrderDialogContentProps {
  order: {
    id: string;
    storeName: string;
    category: string;
    date: string;
    status: OrderStatus;
    items: OrderItem[];
    total?: number;
  };
  currentStatus: OrderStatus | null;
  user: any;
  onStatusChange: (newStatus: OrderStatus) => void;
  onCancellation: (isPenaltyFree: boolean) => void;
  isDialogOpen: boolean;
}

const OrderDialogContent = ({
  order,
  currentStatus,
  user,
  onStatusChange,
  onCancellation,
  isDialogOpen
}: OrderDialogContentProps) => {
  const displayStatus = currentStatus || order.status;
  
  return (
    <div className="mt-4 space-y-6">
      <OrderDialogHeader
        orderId={order.id}
        storeName={order.storeName}
        category={order.category}
        date={order.date}
        status={displayStatus}
      />
      
      <OrderItemsList items={order.items || []} />
      
      {order.total && (
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="font-medium">Total:</span>
          <span className="font-semibold text-jamcart-green">
            ${order.total.toFixed(2)}
          </span>
        </div>
      )}
      
      {user?.userType === 'customer' && displayStatus === 'pending' && (
        <div className="pt-4 border-t">
          <OrderCancellationTimer
            orderId={order.id}
            orderDate={order.date}
            onCancel={onCancellation}
            isDialogOpen={isDialogOpen}
          />
        </div>
      )}
      
      {(user?.userType === 'admin' || user?.userType === 'rider') && (
        <OrderStatusActions
          currentStatus={displayStatus}
          onStatusChange={onStatusChange}
          isSubmitting={false}
          isPastCancellationPeriod={(displayStatus === 'cancelled') ? 
            ((Date.now() - new Date(order.date).getTime()) > (10 * 60 * 1000)) : false}
          orderId={order.id}
        />
      )}
    </div>
  );
};

export default OrderDialogContent;
