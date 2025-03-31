
import React from 'react';
import { ShoppingBag, X, Check, Star, ChevronRight } from 'lucide-react';
import ActionButton from '@/components/ui/ActionButton';
import { useNavigate } from 'react-router-dom';
import { OrderStatus } from '@/components/ui/OrderItem';

interface OrderItem {
  id: string;
  storeName: string;
  category: string;
  date: string;
  status: OrderStatus;
  items: string[];
}

interface PendingOrdersCardProps {
  pendingOrders: OrderItem[];
  onViewDetails: (orderId: string) => void;
  onAcceptOrder: (orderId: string) => void;
  onDeclineOrder: (orderId: string) => void;
}

const PendingOrdersCard = ({ 
  pendingOrders, 
  onViewDetails, 
  onAcceptOrder, 
  onDeclineOrder 
}: PendingOrdersCardProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
        <h2 className="font-semibold text-lg">Pending Orders</h2>
        <button
          className="text-sm text-jamcart-green flex items-center"
          onClick={() => navigate('/admin/orders?filter=pending')}
        >
          View all
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
      <div className="p-5">
        {pendingOrders.length > 0 ? (
          <div className="space-y-4">
            {pendingOrders.map((order) => (
              <div key={order.id} className="bg-jamcart-yellow/5 border border-jamcart-yellow/20 rounded-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">Order #{order.id.slice(-6)}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.date).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-jamcart-yellow/20 text-jamcart-dark text-xs px-2 py-1 rounded-full font-medium flex items-center">
                    <Star className="h-3 w-3 mr-1 text-jamcart-yellow" />
                    Pending
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="text-sm">
                    <span className="font-medium">Store:</span>
                    <span className="ml-1 text-gray-700">{order.storeName}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Category:</span>
                    <span className="ml-1 text-gray-700">{order.category}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-1">Items:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-jamcart-green mr-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex gap-3">
                  <ActionButton
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onViewDetails(order.id)}
                  >
                    View Details
                  </ActionButton>
                  <ActionButton
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-jamcart-dark border border-jamcart-dark/20 hover:bg-jamcart-dark/10"
                    onClick={() => onDeclineOrder(order.id)}
                    icon={<X className="h-4 w-4" />}
                  >
                    Decline
                  </ActionButton>
                  <ActionButton
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-jamcart-green border border-jamcart-green/20 hover:bg-jamcart-green/10"
                    onClick={() => onAcceptOrder(order.id)}
                    icon={<Check className="h-4 w-4" />}
                  >
                    Accept
                  </ActionButton>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="bg-gray-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-1">No Pending Orders</h3>
            <p className="text-gray-500">All orders have been processed.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingOrdersCard;
