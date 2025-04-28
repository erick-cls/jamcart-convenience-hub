import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/pages/admin/orders/types';
import { useVendorCommissions } from '@/hooks/useVendorCommissions';

interface OrderSummaryCardProps {
  order: Order;
  vendorId?: string;
}

const OrderSummaryCard = ({ order, vendorId }: OrderSummaryCardProps) => {
  // Ensure price exists and is a number before using toFixed
  const price = typeof order.price === 'number' ? order.price : 0;
  const deliveryFee = price * 0.1;
  
  const { calculateCommissionForOrder } = useVendorCommissions();
  const [commission, setCommission] = useState(0);
  
  useEffect(() => {
    if (vendorId) {
      const calculatedCommission = calculateCommissionForOrder(vendorId, price);
      setCommission(calculatedCommission);
    }
  }, [vendorId, price, calculateCommissionForOrder]);
  
  const total = price + deliveryFee;
  const vendorEarnings = vendorId ? (price - commission) : 0;

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
        
        {vendorId && (
          <>
            <div className="flex justify-between mb-2 text-orange-600">
              <span>Platform Fee:</span>
              <span>-${commission.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2 text-green-600 font-medium">
              <span>Vendor Earnings:</span>
              <span>${vendorEarnings.toFixed(2)}</span>
            </div>
            <div className="border-t my-2"></div>
          </>
        )}
        
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummaryCard;
