
import { Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { OrderStatus } from '@/components/ui/OrderItem';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export const statusConfigs = {
  pending: {
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    icon: <Clock className="h-4 w-4 mr-1" />,
    label: "Pending"
  },
  accepted: {
    color: "bg-green-100 text-green-800 hover:bg-green-100",
    icon: <CheckCircle className="h-4 w-4 mr-1" />,
    label: "Accepted"
  },
  completed: {
    color: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    icon: <CheckCircle className="h-4 w-4 mr-1" />,
    label: "Completed"
  },
  declined: {
    color: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    icon: <XCircle className="h-4 w-4 mr-1" />,
    label: "Declined"
  },
  cancelled: {
    color: "bg-red-100 text-red-800 hover:bg-red-100",
    icon: <AlertTriangle className="h-4 w-4 mr-1" />,
    label: "Cancelled"
  }
};

// Non-memoized component to ensure it updates on status changes
const OrderStatusBadge = ({ status, className = '' }: OrderStatusBadgeProps) => {
  const currentStatus = statusConfigs[status] || statusConfigs.pending;
  
  return (
    <Badge 
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full font-medium", 
        currentStatus.color, 
        className
      )}
      variant="outline"
      data-status={status}
    >
      {currentStatus.icon}
      <span>{currentStatus.label}</span>
    </Badge>
  );
};

export default OrderStatusBadge;
