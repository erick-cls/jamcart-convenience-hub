
import React from 'react';
import { ChevronRight } from 'lucide-react';
import OrderItem, { OrderStatus } from '@/components/ui/OrderItem';
import { useNavigate } from 'react-router-dom';
import { OrderItemType } from '@/pages/admin/orders/types';

interface Order {
  id: string;
  storeName: string;
  category: string;
  date: string;
  status: OrderStatus;
  items: OrderItemType[];
  total?: number;
}

interface RecentOrdersCardProps {
  recentOrders: Order[];
  onViewDetails: (orderId: string) => void;
}

const RecentOrdersCard = ({ recentOrders, onViewDetails }: RecentOrdersCardProps) => {
  const navigate = useNavigate();
  
  // Make sure orders have valid total values
  const validatedOrders = recentOrders.map(order => ({
    ...order,
    total: typeof order.total === 'number' ? order.total : 0
  }));
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
        <h2 className="font-semibold text-lg">Recent Orders</h2>
        <button
          className="text-sm text-jamcart-green flex items-center"
          onClick={() => navigate('/admin/orders')}
        >
          View all
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
      <div className="p-5">
        <div className="space-y-4">
          {validatedOrders.map((order) => (
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
      </div>
    </div>
  );
};

export default RecentOrdersCard;
