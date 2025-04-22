
import { Order } from '../types';
import OrderItem from '@/components/ui/OrderItem';

interface CompletedOrdersSectionProps {
  orders: Order[];
  onViewDetails: (id: string) => void;
  showUserInfo?: boolean;
}

const CompletedOrdersSection = ({ 
  orders, 
  onViewDetails,
  showUserInfo 
}: CompletedOrdersSectionProps) => {
  if (orders.length === 0) return null;

  return (
    <div>
      <h2 className="font-semibold text-lg mb-4">Completed Orders</h2>
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
            metadata={
              showUserInfo && order.userName 
                ? [
                    { label: "Customer", value: order.userName },
                    order.riderId 
                      ? { label: "Rider", value: order.riderName || 'Unassigned' }
                      : { label: "Rider", value: 'Unassigned' }
                  ]
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
};

export default CompletedOrdersSection;
