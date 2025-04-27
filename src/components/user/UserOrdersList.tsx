import React from 'react';
import OrderItem from '@/components/ui/OrderItem';
import { Order as AdminOrder } from '@/pages/admin/orders/types';
import { Order as UserOrder } from '@/hooks/useUserOrdersState';

interface UserOrdersListProps {
  orders: UserOrder[];
  onViewDetails: (orderId: string) => void;
}

const UserOrdersList = ({ orders, onViewDetails }: UserOrdersListProps) => {
  // Convert UserOrder[] to AdminOrder[] by ensuring required fields
  const convertedOrders: AdminOrder[] = orders.map(order => ({
    ...order,
    userId: order.userId || '',  // Provide default value for required field
    userName: order.userName || '',
    store: order.store || { vendor: '' },
    user: order.user || { name: '', email: '', phone: '' },
    address: order.address || '',
    price: order.price || 0,
  }));

  return (
    <div className="space-y-4">
      {convertedOrders.map((order) => (
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

export default UserOrdersList;
