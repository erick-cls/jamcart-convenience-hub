
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OrderStatus } from '@/components/ui/OrderItem';

interface OrderDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    storeName: string;
    category: string;
    date: string;
    status: OrderStatus;
    items: string[];
    total?: number;
  } | null;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

const OrderDetailsDialog = ({ isOpen, onClose, order, onStatusChange }: OrderDetailsDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  if (!order) return null;
  
  const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onStatusChange(order.id, newStatus);
      
      toast({
        title: "Order status updated",
        description: `Order #${order.id.slice(-6)} has been marked as ${newStatus}`,
        variant: "default",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error updating order",
        description: "There was a problem updating the order status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const statusConfigs = {
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
  
  const currentStatus = statusConfigs[order.status];
  
  const statusActions = [
    { status: 'accepted', label: 'Accept Order', disabled: ['accepted', 'completed', 'declined', 'cancelled'].includes(order.status) },
    { status: 'completed', label: 'Mark as Completed', disabled: ['completed', 'declined', 'cancelled'].includes(order.status) },
    { status: 'declined', label: 'Decline Order', disabled: ['completed', 'declined', 'cancelled'].includes(order.status) },
    { status: 'cancelled', label: 'Cancel Order', disabled: ['completed', 'declined', 'cancelled'].includes(order.status) }
  ];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Order #{order.id.slice(-6)}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">{formattedDate}</p>
              <p className="text-base mt-1">{order.storeName}</p>
              <p className="text-sm text-gray-600">{order.category}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${currentStatus.color} bg-opacity-10`}>
              {currentStatus.icon}
              <span className="ml-1">{currentStatus.label}</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Order Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {order.total && (
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-medium">Total:</span>
              <span className="font-semibold text-jamcart-green">${order.total.toFixed(2)}</span>
            </div>
          )}
          
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-3">Update Order Status</h3>
            <div className="grid grid-cols-2 gap-3">
              {statusActions.map((action) => (
                <Button
                  key={action.status}
                  onClick={() => handleStatusChange(action.status as OrderStatus)}
                  disabled={action.disabled || isSubmitting}
                  variant={action.status === 'declined' || action.status === 'cancelled' ? 'outline' : 'default'}
                  className={
                    action.status === 'declined' || action.status === 'cancelled'
                      ? 'border-gray-200 text-gray-700'
                      : action.status === 'accepted'
                      ? 'bg-jamcart-green hover:bg-jamcart-green/90'
                      : ''
                  }
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
