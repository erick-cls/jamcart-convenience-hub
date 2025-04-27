
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/pages/admin/orders/types';

interface OrderSummaryCardProps {
  order: Order;
}

const OrderSummaryCard = ({ order }: OrderSummaryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-2">
          <span>Subtotal:</span>
          <span>${order.price.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Delivery Fee:</span>
          <span>${(order.price * 0.1).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>${(order.price * 1.1).toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummaryCard;
