
import { Button } from '@/components/ui/button';
import { OrderStatus } from '@/components/ui/OrderItem';

interface OrderStatusActionsProps {
  currentStatus: OrderStatus;
  onStatusChange: (status: OrderStatus) => void;
  isSubmitting: boolean;
}

const OrderStatusActions = ({ currentStatus, onStatusChange, isSubmitting }: OrderStatusActionsProps) => {
  const statusActions = [
    { status: 'accepted', label: 'Accept Order', disabled: ['accepted', 'completed', 'declined', 'cancelled'].includes(currentStatus) },
    { status: 'completed', label: 'Mark as Completed', disabled: ['completed', 'declined', 'cancelled'].includes(currentStatus) },
    { status: 'declined', label: 'Decline Order', disabled: ['completed', 'declined', 'cancelled'].includes(currentStatus) },
    { status: 'cancelled', label: 'Cancel Order', disabled: ['completed', 'declined', 'cancelled'].includes(currentStatus) }
  ];

  return (
    <div className="pt-4 border-t">
      <h3 className="text-sm font-medium mb-3">Update Order Status</h3>
      <div className="grid grid-cols-2 gap-3">
        {statusActions.map((action) => (
          <Button
            key={action.status}
            onClick={() => onStatusChange(action.status as OrderStatus)}
            disabled={action.disabled || isSubmitting}
            variant={action.status === 'declined' || action.status === 'cancelled' ? 'outline' : 'default'}
            className={
              action.status === 'declined' || action.status === 'cancelled'
                ? 'border-gray-200 text-gray-700'
                : action.status === 'accepted'
                ? 'bg-jamcart-green hover:bg-jamcart-green/90'
                : ''
            }
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusActions;
