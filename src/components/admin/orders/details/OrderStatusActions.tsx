
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { OrderStatus } from '@/components/ui/OrderItem';
import { useToast } from '@/hooks/use-toast';

interface OrderStatusActionsProps {
  currentStatus: OrderStatus;
  onStatusChange: (status: OrderStatus) => void;
  isSubmitting: boolean;
  isPastCancellationPeriod?: boolean;
  orderId?: string;
}

const OrderStatusActions = ({ 
  currentStatus, 
  onStatusChange, 
  isSubmitting,
  isPastCancellationPeriod = false,
  orderId
}: OrderStatusActionsProps) => {
  const { toast } = useToast();
  const [isChargingPenalty, setIsChargingPenalty] = useState(false);

  const statusActions = [
    { status: 'accepted', label: 'Accept Order', disabled: ['accepted', 'completed', 'declined', 'cancelled'].includes(currentStatus) },
    { status: 'completed', label: 'Mark as Completed', disabled: ['completed', 'declined', 'cancelled'].includes(currentStatus) },
    { status: 'declined', label: 'Decline Order', disabled: ['completed', 'declined', 'cancelled'].includes(currentStatus) },
    { status: 'cancelled', label: 'Cancel Order', disabled: ['completed', 'declined', 'cancelled'].includes(currentStatus) }
  ];

  const handleChargePenalty = async () => {
    setIsChargingPenalty(true);
    try {
      // Simulate API call to charge card
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Penalty charged",
        description: `$1000 JMD penalty fee has been charged for order #${orderId?.slice(-6)}`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error charging penalty",
        description: "There was a problem processing the penalty charge.",
        variant: "destructive",
      });
    } finally {
      setIsChargingPenalty(false);
    }
  };

  return (
    <div className="pt-4 border-t">
      <h3 className="text-sm font-medium mb-3">Update Order Status</h3>
      <div className="grid grid-cols-2 gap-3">
        {statusActions.map((action) => (
          <Button
            key={action.status}
            onClick={() => onStatusChange(action.status as OrderStatus)}
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
      
      {currentStatus === 'cancelled' && isPastCancellationPeriod && (
        <div className="mt-4">
          <Button
            onClick={handleChargePenalty}
            disabled={isChargingPenalty}
            variant="destructive"
            className="w-full"
          >
            {isChargingPenalty ? 'Processing...' : 'Charge $1000 JMD Penalty'}
          </Button>
          <p className="text-xs text-gray-500 mt-1">
            This order was cancelled after the 10-minute free cancellation period.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderStatusActions;
