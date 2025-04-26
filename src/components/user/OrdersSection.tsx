
import { memo, useEffect, useState } from 'react';
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

// Using React.memo with a custom comparison function to ensure proper re-rendering
const OrdersSection = memo(({ title, orders, onViewDetails }: OrdersSectionProps) => {
  // Local state to track orders and force updates when status changes
  const [localOrders, setLocalOrders] = useState<Order[]>(orders);
  
  // Update localOrders when props change
  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  // Listen for order status changes
  useEffect(() => {
    const handleOrderStatusChange = () => {
      // Force re-render with current orders
      setLocalOrders([...orders]);
    };
    
    window.addEventListener('order-status-change', handleOrderStatusChange);
    
    return () => {
      window.removeEventListener('order-status-change', handleOrderStatusChange);
    };
  }, [orders]);
  
  if (localOrders.length === 0) return null;
  
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-lov-id="src/components/user/OrdersSection.tsx:29:6">
        {localOrders.map((order) => (
          <OrderItem
            key={`${order.id}-${order.status}`}
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
}, (prevProps, nextProps) => {
  // Custom comparison function to ensure component re-renders when order status changes
  if (prevProps.orders.length !== nextProps.orders.length) {
    return false; // Not equal, should re-render
  }
  
  // Compare each order's id and status
  for (let i = 0; i < prevProps.orders.length; i++) {
    if (prevProps.orders[i].id !== nextProps.orders[i].id ||
        prevProps.orders[i].status !== nextProps.orders[i].status) {
      return false; // Not equal, should re-render
    }
  }
  
  return true; // Equal, no need to re-render
});

OrdersSection.displayName = 'OrdersSection';

export default OrdersSection;
