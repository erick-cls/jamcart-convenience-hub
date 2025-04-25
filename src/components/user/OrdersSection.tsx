
import { useState, useEffect } from 'react';
import { OrderStatus } from '@/components/ui/OrderItem';
import OrderItem from '@/components/ui/OrderItem';

interface Order {
  id: string;
  storeName: string;
  category: string;
  date: string;
  status: OrderStatus;
  items: string[];
  total: number;
  isNew?: boolean;
}

interface OrdersSectionProps {
  title: string;
  orders: Order[];
  onViewDetails: (id: string) => void;
}

const OrdersSection = ({ title, orders, onViewDetails }: OrdersSectionProps) => {
  const [displayedOrders, setDisplayedOrders] = useState<Order[]>([]);
  
  // Update displayed orders only when orders prop changes
  useEffect(() => {
    console.log(`OrdersSection (${title}): Received ${orders.length} orders`);
    setDisplayedOrders(orders);
  }, [orders, title]);

  if (displayedOrders.length === 0) return null;
  
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedOrders.map((order) => (
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
            isNew={order.isNew}
          />
        ))}
      </div>
    </div>
  );
};

export default OrdersSection;
