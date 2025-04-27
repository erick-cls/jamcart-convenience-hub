
import { useState, useCallback, useEffect } from 'react';
import { OrderStatus } from '@/components/ui/OrderItem';
import OrderDetailsDialog from '@/components/admin/orders/OrderDetailsDialog';
import FileComplaintDialog from './FileComplaintDialog';
import { Order } from '@/hooks/useUserOrdersState';
import { getOrderComplaints } from '@/services/complaint.service';
import { Button } from '@/components/ui/button';
import { Flag } from 'lucide-react';

interface OrderDetailsViewProps {
  isOpen: boolean;
  selectedOrder: Order | null;
  onClose: () => void;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

const OrderDetailsView = ({ 
  isOpen, 
  selectedOrder, 
  onClose, 
  onStatusChange 
}: OrderDetailsViewProps) => {
  const [isComplaintDialogOpen, setIsComplaintDialogOpen] = useState(false);
  const [hasComplaint, setHasComplaint] = useState(false);

  useEffect(() => {
    if (selectedOrder) {
      const complaints = getOrderComplaints(selectedOrder.id);
      setHasComplaint(complaints.length > 0);
    }
  }, [selectedOrder, isOpen]);

  const handleCloseDialog = useCallback(() => {
    onClose();
    
    // Dispatch custom event to ensure all components are notified
    window.dispatchEvent(new CustomEvent('order-status-change', {
      detail: {
        action: 'dialog-closed',
        timestamp: Date.now()
      }
    }));
    
    // Also dispatch storage event for components listening to that
    window.dispatchEvent(new CustomEvent('storage'));
  }, [onClose]);
  
  const handleOpenComplaintDialog = () => {
    setIsComplaintDialogOpen(true);
  };
  
  const handleComplaintFiled = () => {
    setHasComplaint(true);
    // Dispatch event to update any components showing complaints
    window.dispatchEvent(new CustomEvent('complaint-filed', {
      detail: { orderId: selectedOrder?.id }
    }));
  };
  
  return (
    <>
      {selectedOrder && (
        <>
          <OrderDetailsDialog
            isOpen={isOpen}
            onClose={handleCloseDialog}
            order={selectedOrder}
            onStatusChange={onStatusChange}
            extraActions={
              selectedOrder.status === 'completed' && !hasComplaint ? (
                <Button 
                  variant="outline" 
                  onClick={handleOpenComplaintDialog}
                  className="flex items-center"
                >
                  <Flag className="h-4 w-4 mr-2 text-red-500" />
                  File Complaint
                </Button>
              ) : null
            }
            showComplaintBadge={hasComplaint}
          />
          
          {selectedOrder && (
            <FileComplaintDialog 
              isOpen={isComplaintDialogOpen}
              onClose={() => setIsComplaintDialogOpen(false)}
              order={selectedOrder}
              onComplaintFiled={handleComplaintFiled}
            />
          )}
        </>
      )}
    </>
  );
};

export default OrderDetailsView;
