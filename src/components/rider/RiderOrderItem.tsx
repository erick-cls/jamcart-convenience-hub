
import { CheckCircle, Clock, MapPin, XCircle, ChevronRight, Bike, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrderStatus } from '@/components/ui/OrderItem';

interface Order {
  id: string;
  storeName: string;
  category: string;
  date: string;
  status: OrderStatus;
  items: string[];
  total: number;
  assignedTo?: string;
}

interface RiderOrderItemProps {
  order: Order;
  onViewDetails: (id: string) => void;
  onTakeOrder: (id: string) => void;
  onCompleteOrder: (id: string) => void;
}

const RiderOrderItem = ({ order, onViewDetails, onTakeOrder, onCompleteOrder }: RiderOrderItemProps) => {
  const { id, storeName, category, date, status, items, total, assignedTo } = order;
  
  // Format the date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Determine if this order is assigned to the current rider
  // In a real app, we would compare assignedTo with the current rider's ID
  const isAssignedToThisRider = assignedTo === 'rider-123';
  
  // Status badge configuration
  const statusConfig = {
    pending: {
      icon: <Clock className="h-4 w-4" />,
      label: 'Pending',
      color: 'text-orange-500 bg-orange-100'
    },
    accepted: {
      icon: <CheckCircle className="h-4 w-4" />,
      label: 'In Progress',
      color: 'text-blue-500 bg-blue-100'
    },
    completed: {
      icon: <CheckCheck className="h-4 w-4" />,
      label: 'Completed',
      color: 'text-jamcart-green bg-green-100'
    },
    declined: {
      icon: <XCircle className="h-4 w-4" />,
      label: 'Declined',
      color: 'text-gray-500 bg-gray-100'
    },
    cancelled: {
      icon: <XCircle className="h-4 w-4" />,
      label: 'Cancelled',
      color: 'text-gray-500 bg-gray-100'
    }
  };
  
  const currentStatus = statusConfig[status];
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header with date and status */}
      <div className="p-4 flex justify-between items-center border-b border-gray-100">
        <span className="text-sm text-gray-500">{formattedDate}</span>
        <span className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${currentStatus.color}`}>
          {currentStatus.icon}
          <span className="ml-1">{currentStatus.label}</span>
        </span>
      </div>
      
      {/* Order details */}
      <div className="p-4">
        <h3 className="font-medium">{storeName}</h3>
        <p className="text-sm text-gray-600 mb-2">{category}</p>
        
        <div className="flex items-start space-x-1 text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mt-0.5" />
          <span>Delivering to customer in Kingston</span>
        </div>
        
        {/* Items */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-1">Items</p>
          <div className="bg-gray-50 rounded p-2">
            <ul className="text-sm">
              {items.slice(0, 2).map((item, index) => (
                <li key={index} className="mb-1">{item}</li>
              ))}
              {items.length > 2 && (
                <li className="text-gray-500">+{items.length - 2} more items</li>
              )}
            </ul>
          </div>
        </div>
        
        {/* Total */}
        <div className="flex justify-between items-center font-medium mb-4">
          <span>Total:</span>
          <span className="text-jamcart-green">${total.toFixed(2)}</span>
        </div>
        
        {/* Actions */}
        <div className="space-y-2">
          {status === 'pending' && (
            <Button
              className="w-full bg-jamcart-green hover:bg-jamcart-green/90"
              onClick={() => onTakeOrder(id)}
            >
              <Bike className="mr-2 h-4 w-4" />
              Take Order
            </Button>
          )}
          
          {status === 'accepted' && isAssignedToThisRider && (
            <Button
              className="w-full bg-jamcart-green hover:bg-jamcart-green/90"
              onClick={() => onCompleteOrder(id)}
            >
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark as Delivered
            </Button>
          )}
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onViewDetails(id)}
          >
            View Details
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RiderOrderItem;
