
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/pages/admin/orders/types';

interface CustomerInfoCardProps {
  order: Order;
}

const CustomerInfoCard = ({ order }: CustomerInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
      </CardHeader>
      <CardContent>
        {order?.user && (
          <>
            <p className="font-medium">{order.user.name}</p>
            <p className="text-gray-600">{order.user.email}</p>
            <p className="text-gray-600">{order.user.phone}</p>
            <p className="text-gray-600 mt-2">{order.address}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerInfoCard;
