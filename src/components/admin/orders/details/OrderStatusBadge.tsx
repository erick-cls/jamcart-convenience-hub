
import { Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { OrderStatus } from '@/components/ui/OrderItem';
import { memo } from 'react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export const statusConfigs = {
  pending: {
    color: "text-yellow-500 bg-yellow-50",
    icon: <Clock className="h-5 w-5" />,
    label: "Pending"
  },
  accepted: {
    color: "text-jamcart-green bg-green-50",
    icon: <CheckCircle className="h-5 w-5" />,
    label: "Accepted"
  },
  completed: {
    color: "text-blue-500 bg-blue-50",
    icon: <CheckCircle className="h-5 w-5" />,
    label: "Completed"
  },
  declined: {
    color: "text-gray-500 bg-gray-50",
    icon: <XCircle className="h-5 w-5" />,
    label: "Declined"
  },
  cancelled: {
    color: "text-gray-500 bg-gray-50",
    icon: <AlertTriangle className="h-5 w-5" />,
    label: "Cancelled"
  }
};

const OrderStatusBadge = memo(({ status }: OrderStatusBadgeProps) => {
  const currentStatus = statusConfigs[status] || statusConfigs.pending;
  
  return (
    <div 
      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${currentStatus.color}`}
    >
      {currentStatus.icon}
      <span className="ml-1">{currentStatus.label}</span>
    </div>
  );
});

OrderStatusBadge.displayName = 'OrderStatusBadge';

export default OrderStatusBadge;
