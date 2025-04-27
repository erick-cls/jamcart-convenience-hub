
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Order } from '@/pages/admin/orders/types';
import { OrderStatus } from '@/components/ui/OrderItem';

interface OrderActionsCardProps {
  order: Order;
  onStatusChange: (newStatus: OrderStatus) => void;
}

const OrderActionsCard = ({ order, onStatusChange }: OrderActionsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button 
          onClick={() => onStatusChange('accepted')} 
          className="w-full"
          disabled={order.status !== 'pending'}
          variant="default"
        >
          Accept Order
        </Button>
        <Button 
          onClick={() => onStatusChange('completed')} 
          className="w-full"
          disabled={order.status !== 'accepted'}
          variant="default"
        >
          Mark as Completed
        </Button>
        <Button 
          onClick={() => onStatusChange('declined')} 
          className="w-full"
          disabled={['completed', 'cancelled', 'declined'].includes(order.status)}
          variant="destructive"
        >
          Decline Order
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrderActionsCard;
