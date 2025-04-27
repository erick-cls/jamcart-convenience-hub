import { useState, useEffect } from 'react';
import { OrderStatus } from '@/components/ui/OrderItem';
import OrderItem from '@/components/ui/OrderItem';
import { Order } from '@/hooks/useUserOrdersState';

interface OrdersSectionProps {
  title: string;
  orders: Order[];
  onViewDetails: (id: string) => void;
}

const OrdersSection = ({ title, orders, onViewDetails }: OrdersSectionProps) => {
  const [localOrders, setLocalOrders] = useState<Order[]>(orders);
  const [updateKey, setUpdateKey] = useState<number>(Date.now());
  
  useEffect(() => {
    const updatedOrders = orders.map(order => {
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
    setUpdateKey(Date.now());
    console.log(`OrdersSection: Updated with ${orders.length} orders, key: ${Date.now()}`);
  }, [orders]);

  useEffect(() => {
    const handleOrderStatusChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      
      if (customEvent.detail && customEvent.detail.orderId) {
        const { orderId, newStatus, forceUpdate } = customEvent.detail;
        
        setLocalOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status: newStatus } 
              : order
          )
        );
        
        const newKey = Date.now();
        setUpdateKey(newKey);
        console.log(`OrdersSection: Updated order ${orderId} to ${newStatus}, new key: ${newKey}`);
      } else {
        setLocalOrders(prevOrders => {
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
      <h3 className={`text-lg font-medium mb-4 ${title === 'Today' ? 'text-white' : 'text-[#0d9539]'}`}>
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {localOrders.map((order) => {
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
