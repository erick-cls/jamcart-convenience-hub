
import OrderItem, { OrderStatus } from '@/components/ui/OrderItem';
import { useNavigate } from 'react-router-dom';

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
  onViewDetails?: (id: string) => void;
}

const OrdersList = ({ orders, onViewDetails }: OrdersListProps) => {
  const navigate = useNavigate();
  
  const handleViewDetails = (id: string) => {
    if (onViewDetails) {
      onViewDetails(id);
    } else {
      // Default behavior if onViewDetails is not provided
      console.log(`View details for order ${id}`);
    }
  };
  
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
          onViewDetails={handleViewDetails}
        />
      ))}
    </div>
  );
};

export default OrdersList;
