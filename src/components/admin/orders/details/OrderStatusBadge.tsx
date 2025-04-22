
import { Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { OrderStatus } from '@/components/ui/OrderItem';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export const statusConfigs = {
  pending: {
    color: "text-yellow-500",
    icon: <Clock className="h-5 w-5" />,
    label: "Pending"
  },
  accepted: {
    color: "text-jamcart-green",
    icon: <CheckCircle className="h-5 w-5" />,
    label: "Accepted"
  },
  completed: {
    color: "text-blue-500",
    icon: <CheckCircle className="h-5 w-5" />,
    label: "Completed"
  },
  declined: {
    color: "text-gray-500",
    icon: <XCircle className="h-5 w-5" />,
    label: "Declined"
  },
  cancelled: {
    color: "text-gray-500",
    icon: <AlertTriangle className="h-5 w-5" />,
    label: "Cancelled"
  }
};

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const currentStatus = statusConfigs[status];
  
  return (
    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${currentStatus.color} bg-opacity-10`}>
      {currentStatus.icon}
      <span className="ml-1">{currentStatus.label}</span>
    </div>
  );
};

export default OrderStatusBadge;
