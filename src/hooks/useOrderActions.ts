
import { OrderStatus } from '@/components/ui/OrderItem';
import { useToast } from '@/hooks/use-toast';

interface UseOrderActionsProps {
  status: OrderStatus;
  onStatusChange: (newStatus: OrderStatus) => void;
}

export const useOrderActions = ({ status, onStatusChange }: UseOrderActionsProps) => {
  const { toast } = useToast();

  const handleStatusChange = (newStatus: OrderStatus) => {
    onStatusChange(newStatus);
    toast({
      title: "Order status updated",
      description: `Order status changed to ${newStatus}`,
      variant: "default",
    });
  };

  return {
    handleStatusChange,
    isAcceptDisabled: status !== 'pending',
    isCompleteDisabled: status !== 'accepted',
    isDeclineDisabled: ['completed', 'cancelled', 'declined'].includes(status)
  };
};
