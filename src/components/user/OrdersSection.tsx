
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
  // Local state to track orders and force updates when status changes
  const [localOrders, setLocalOrders] = useState<Order[]>(orders);
  const [updateKey, setUpdateKey] = useState<number>(Date.now());
  
  // Update localOrders when props change
  useEffect(() => {
    setLocalOrders([...orders]);
    // Force re-render when orders change
    setUpdateKey(Date.now());
  }, [orders]);

  // Listen for order status changes and force re-render
  useEffect(() => {
    const handleOrderStatusChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      
      // If we have detail data, use it for targeted updates
      if (customEvent.detail && customEvent.detail.orderId) {
        const { orderId, newStatus } = customEvent.detail;
        
        // Immediately update specific order if it exists in our list
        setLocalOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status: newStatus } 
              : order
          )
        );
        
        // Always force re-render when status changes
        setUpdateKey(Date.now());
        console.log(`OrdersSection: Updated order ${orderId} to ${newStatus}, new key: ${Date.now()}`);
      } else {
        // Fall back to full refresh if no specific data and force re-render
        setLocalOrders(prevOrders => [...prevOrders]);
        setUpdateKey(Date.now());
      }
    };
    
    // Listen for multiple event types to ensure we catch all updates
    window.addEventListener('order-status-change', handleOrderStatusChange);
    window.addEventListener('storage', handleOrderStatusChange);
    
    return () => {
      window.removeEventListener('order-status-change', handleOrderStatusChange);
      window.removeEventListener('storage', handleOrderStatusChange);
    };
  }, []);
  
  if (localOrders.length === 0) return null;
  
  return (
    <div className="mb-8" key={`orders-section-${updateKey}`}>
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {localOrders.map((order) => (
          <OrderItem
            key={`${order.id}-${order.status}-${updateKey}`}
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
