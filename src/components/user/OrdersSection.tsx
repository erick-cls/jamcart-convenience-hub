
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
  
  // Update localOrders and force re-render when props change
  useEffect(() => {
    const updatedOrders = orders.map(order => {
      // Check if there's a persisted status in localStorage
      try {
        const persistedStatus = localStorage.getItem(`order_${order.id}_status`);
        if (persistedStatus) {
          return {
            ...order,
            status: persistedStatus as OrderStatus
          };
        }
      } catch (e) {
        console.warn('Error checking localStorage status:', e);
      }
      return order;
    });
    
    setLocalOrders(updatedOrders);
    // Force re-render when orders change
    setUpdateKey(Date.now());
    console.log(`OrdersSection: Updated with ${orders.length} orders, key: ${Date.now()}`);
  }, [orders]);

  // Listen for order status changes and force re-render
  useEffect(() => {
    const handleOrderStatusChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      
      // If we have detail data, use it for targeted updates
      if (customEvent.detail && customEvent.detail.orderId) {
        const { orderId, newStatus, forceUpdate } = customEvent.detail;
        
        // Update specific order if it exists in our list
        setLocalOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status: newStatus } 
              : order
          )
        );
        
        // Always force re-render when status changes
        const newKey = Date.now();
        setUpdateKey(newKey);
        console.log(`OrdersSection: Updated order ${orderId} to ${newStatus}, new key: ${newKey}`);
      } else {
        // Fall back to full refresh and force re-render
        setLocalOrders(prevOrders => {
          // Check localStorage for any persisted statuses
          return prevOrders.map(order => {
            try {
              const persistedStatus = localStorage.getItem(`order_${order.id}_status`);
              if (persistedStatus) {
                return {
                  ...order,
                  status: persistedStatus as OrderStatus
                };
              }
            } catch (e) {
              console.warn('Error checking localStorage status:', e);
            }
            return order;
          });
        });
        
        const newKey = Date.now();
        setUpdateKey(newKey);
        console.log(`OrdersSection: Generic update triggered, new key: ${newKey}`);
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
        {localOrders.map((order) => {
          // Check localStorage one more time before rendering
          let currentStatus = order.status;
          try {
            const persistedStatus = localStorage.getItem(`order_${order.id}_status`);
            if (persistedStatus) {
              currentStatus = persistedStatus as OrderStatus;
            }
          } catch (e) {
            console.warn('Error checking localStorage status:', e);
          }
          
          const orderKey = `${order.id}-${currentStatus}-${updateKey}`;
          console.log(`Rendering order ${order.id} with status ${currentStatus}, key: ${orderKey}`);
          
          return (
            <OrderItem
              key={orderKey}
              id={order.id}
              storeName={order.storeName}
              category={order.category}
              date={order.date}
              status={currentStatus}
              items={order.items}
              total={order.total}
              onViewDetails={onViewDetails}
              isNew={order.isNew}
            />
          );
        })}
      </div>
    </div>
  );
};

export default OrdersSection;
