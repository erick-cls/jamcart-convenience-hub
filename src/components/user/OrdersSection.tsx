
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
  const [forceUpdateKey, setForceUpdateKey] = useState<number>(Date.now());
  
  // Update displayed orders whenever parent orders change - immediate effect
  useEffect(() => {
    console.log(`OrdersSection (${title}): Received ${orders.length} orders with statuses:`, 
      orders.map(o => `${o.id.slice(-6)}: ${o.status}`).join(', '));
    
    // Create completely new array with status timestamps to force re-render
    const updatedOrders = orders.map(order => ({
      ...order,
      _statusTimestamp: Date.now() // Add internal tracking property
    }));
    
    setDisplayedOrders(updatedOrders);
    setForceUpdateKey(Date.now()); // Force section re-render
  }, [orders, title]);

  // Additional force refresh effect with very frequent checks
  useEffect(() => {
    // Set up storage event listener for external changes
    const handleStorageEvent = () => {
      console.log(`OrdersSection (${title}): Force refresh triggered`);
      setForceUpdateKey(Date.now()); // Force a complete re-render
    };
    
    window.addEventListener('storage', handleStorageEvent);
    
    // Also set up periodic refresh for extra safety (every 500ms)
    const refreshInterval = setInterval(() => {
      setForceUpdateKey(Date.now());
    }, 500);
    
    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      clearInterval(refreshInterval);
    };
  }, [title]);
  
  if (displayedOrders.length === 0) return null;
  
  return (
    <div className="mb-8" key={`section-${title}-${forceUpdateKey}`}>
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedOrders.map((order) => (
          <OrderItem
            key={`${order.id}-${order.status}-${forceUpdateKey}`}
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
