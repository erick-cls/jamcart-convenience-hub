
import { Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { OrderStatus } from '@/components/ui/OrderItem';
import { useEffect, useState } from 'react';

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
  // Use local state to ensure updates
  const [displayStatus, setDisplayStatus] = useState<OrderStatus>(status);
  
  // Update display status when props change
  useEffect(() => {
    console.log(`OrderStatusBadge: Status updated from ${displayStatus} to ${status}`);
    setDisplayStatus(status);
  }, [status, displayStatus]);
  
  // Ensure status is a valid key or default to pending
  const currentStatus = statusConfigs[displayStatus] || statusConfigs.pending;
  
  return (
    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${currentStatus.color} bg-opacity-10`}>
      {currentStatus.icon}
      <span className="ml-1">{currentStatus.label}</span>
    </div>
  );
};

export default OrderStatusBadge;
