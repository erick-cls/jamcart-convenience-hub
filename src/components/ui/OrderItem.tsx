
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import ActionButton from './ActionButton';
import { ReactNode } from 'react';
import { OrderItem as OrderItemType } from '@/pages/admin/orders/types';

export type OrderStatus = 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';

interface OrderItemProps {
  id: string;
  storeName: string;
  category: string;
  date: string;
  status: OrderStatus;
  items: OrderItemType[];
  total?: number;
  onViewDetails: (id: string) => void;
  isNew?: boolean;
  metadata?: { label: string; value: string }[];
  actionButton?: ReactNode;
}

// Using non-memoized component with forced render key to ensure immediate updates
const OrderItem = ({ 
  id, 
  storeName, 
  category, 
  date, 
  status, 
  items, 
  total, 
  onViewDetails,
  isNew,
  metadata,
  actionButton
}: OrderItemProps) => {
  const statusConfig = {
    pending: {
      icon: <Clock className="h-5 w-5" />,
      color: 'text-yellow-500 bg-yellow-50',
      text: 'Pending'
    },
    accepted: {
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'text-green-500 bg-green-50',
      text: 'Accepted'
    },
    declined: {
      icon: <XCircle className="h-5 w-5" />,
      color: 'text-red-500 bg-red-50',
      text: 'Declined'
    },
    completed: {
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'text-blue-500 bg-blue-50',
      text: 'Completed'
    },
    cancelled: {
      icon: <AlertTriangle className="h-5 w-5" />,
      color: 'text-gray-500 bg-gray-50',
      text: 'Cancelled'
    }
  };
  
  const displayStatus = statusConfig[status] ? statusConfig[status] : statusConfig.pending;
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Create a unique instance key that changes with every status update
  const instanceKey = `order-item-${id}-${status}-${Date.now()}`;
  
  return (
    <motion.div 
      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      data-order-id={id}
      data-order-status={status}
      key={instanceKey} // Force re-render whenever props change
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Order #{id.slice(-6)}</h3>
            <p className="text-sm text-gray-500">{formattedDate}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${displayStatus.color}`}
               data-test-status={status} // For testing/debugging
               data-status-timestamp={Date.now()}>
            {displayStatus.icon}
            <span className="ml-1">{displayStatus.text}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <span className="font-medium">Store:</span>
            <span className="ml-2">{storeName}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">Category:</span>
            <span className="ml-2">{category}</span>
          </div>
        </div>
        
        {metadata && metadata.length > 0 && (
          <div className="mb-4">
            {metadata.map((item, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600 mb-1">
                <span className="font-medium">{item.label}:</span>
                <span className="ml-2">{item.value}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Items:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {items.slice(0, 3).map((item, index) => (
              <li key={index} className="flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-jamcart-red mr-2"></span>
                {item.name} (${item.price.toFixed(2)} × {item.quantity})
              </li>
            ))}
            {items.length > 3 && (
              <li className="text-gray-500 italic">+{items.length - 3} more items</li>
            )}
          </ul>
        </div>
        
        {total && (
          <div className="flex justify-between items-center mb-4 text-sm">
            <span className="font-medium text-gray-700">Total:</span>
            <span className="font-semibold text-jamcart-red">${total.toFixed(2)}</span>
          </div>
        )}
        
        {actionButton ? (
          <div className="mt-2">{actionButton}</div>
        ) : (
          <ActionButton 
            variant="outline" 
            size="sm" 
            className="w-full mt-2"
            onClick={() => onViewDetails(id)}
          >
            View Details
          </ActionButton>
        )}
      </div>
    </motion.div>
  );
};

export default OrderItem;
