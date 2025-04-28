
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/pages/admin/orders/types';

interface OrderSummaryCardProps {
  order: Order;
}

const OrderSummaryCard = ({ order }: OrderSummaryCardProps) => {
  // Ensure price exists and is a number before using toFixed
  const price = typeof order.price === 'number' ? order.price : 0;
  const deliveryFee = price * 0.1;
  const total = price + deliveryFee;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-2">
          <span>Subtotal:</span>
          <span>${price.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Delivery Fee:</span>
          <span>${deliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummaryCard;
