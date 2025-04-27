
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order, OrderStatus } from '@/pages/admin/orders/types';
import { useOrderActions } from '@/hooks/useOrderActions';
import ActionButton from './actions/ActionButton';

interface OrderActionsCardProps {
  order: Order;
  onStatusChange: (newStatus: OrderStatus) => void;
}

const OrderActionsCard = ({ order, onStatusChange }: OrderActionsCardProps) => {
  const { 
    handleStatusChange, 
    isAcceptDisabled, 
    isCompleteDisabled, 
    isDeclineDisabled 
  } = useOrderActions({
    status: order.status,
    onStatusChange
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <ActionButton 
          onClick={() => handleStatusChange('accepted')} 
          disabled={isAcceptDisabled}
        >
          Accept Order
        </ActionButton>
        
        <ActionButton 
          onClick={() => handleStatusChange('completed')} 
          disabled={isCompleteDisabled}
        >
          Mark as Completed
        </ActionButton>
        
        <ActionButton 
          onClick={() => handleStatusChange('declined')} 
          disabled={isDeclineDisabled}
          variant="destructive"
        >
          Decline Order
        </ActionButton>
      </CardContent>
    </Card>
  );
};

export default OrderActionsCard;
