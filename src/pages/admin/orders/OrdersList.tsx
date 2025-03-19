
import OrderItem, { OrderStatus } from '@/components/ui/OrderItem';

interface Order {
  id: string;
  storeName: string;
  category: string;
  date: string;
  status: OrderStatus;
  items: string[];
  total: number;
}

interface OrdersListProps {
  orders: Order[];
  onViewDetails: (id: string) => void;
}

const OrdersList = ({ orders, onViewDetails }: OrdersListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map((order) => (
        <OrderItem
          key={order.id}
          id={order.id}
          storeName={order.storeName}
          category={order.category}
          date={order.date}
          status={order.status}
          items={order.items}
          total={order.total}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default OrdersList;
