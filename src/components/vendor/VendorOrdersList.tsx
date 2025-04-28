
import { useState } from 'react';
import { Order, OrderStatus } from '@/pages/admin/orders/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Eye, Truck } from 'lucide-react';
import OrderSummaryCard from './orders/OrderSummaryCard';

interface VendorOrdersListProps {
  orders: Order[];
  onViewDetails: (id: string) => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}

const VendorOrdersList = ({ orders, onViewDetails, onStatusChange }: VendorOrdersListProps) => {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  const toggleOrderExpand = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };
  
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'accepted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'declined': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <>
              <TableRow key={order.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleOrderExpand(order.id)}>
                <TableCell className="font-medium">#{order.id.slice(-6)}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>{order.user?.name || 'Anonymous'}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" variant="ghost" onClick={() => onViewDetails(order.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {order.status === 'pending' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-green-600 border-green-200 hover:bg-green-50" 
                        onClick={() => onStatusChange(order.id, 'accepted')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                    )}
                    
                    {order.status === 'accepted' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-blue-600 border-blue-200 hover:bg-blue-50" 
                        onClick={() => onStatusChange(order.id, 'completed')}
                      >
                        <Truck className="h-4 w-4 mr-1" />
                        Fulfill
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
              
              {expandedOrder === order.id && (
                <TableRow>
                  <TableCell colSpan={6} className="p-0 border-t-0">
                    <div className="bg-gray-50 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Order Items:</h4>
                          <ul className="space-y-1 text-sm">
                            {order.items.map((item, index) => (
                              <li key={index} className="flex justify-between">
                                <span>
                                  {item.name} x {item.quantity}
                                </span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                          
                          {order.notes && (
                            <div className="mt-4">
                              <h4 className="font-medium mb-1">Order Notes:</h4>
                              <p className="text-sm text-gray-600">{order.notes}</p>
                            </div>
                          )}
                        </div>
                        
                        <OrderSummaryCard order={order} vendorId={order.store?.vendor} />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VendorOrdersList;
