
import { Order } from '../types';
import OrderItem from '@/components/ui/OrderItem';
import { Button } from '@/components/ui/button';

interface AcceptedOrdersSectionProps {
  orders: Order[];
  onViewDetails: (id: string) => void;
  onAssignRider: (order: Order) => void;
  showUserInfo?: boolean;
}

const AcceptedOrdersSection = ({ 
  orders, 
  onViewDetails, 
  onAssignRider,
  showUserInfo 
}: AcceptedOrdersSectionProps) => {
  if (orders.length === 0) return null;

  return (
    <div className="mb-10">
      <h2 className="font-semibold text-lg mb-4">In Progress</h2>
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
            actionButton={
              showUserInfo && !order.riderId ? (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAssignRider(order);
                  }}
                >
                  Assign Rider
                </Button>
              ) : undefined
            }
          />
        ))}
      </div>
    </div>
  );
};

export default AcceptedOrdersSection;
