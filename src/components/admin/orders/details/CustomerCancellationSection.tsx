
import OrderCancellationTimer from './OrderCancellationTimer';

interface CustomerCancellationSectionProps {
  orderId: string;
  orderDate: string;
  onCancellation: (isPenaltyFree: boolean) => void;
  isDialogOpen: boolean;
}

const CustomerCancellationSection = ({
  orderId,
  orderDate,
  onCancellation,
  isDialogOpen
}: CustomerCancellationSectionProps) => {
  return (
    <div className="pt-4 border-t">
      <OrderCancellationTimer
        orderId={orderId}
        orderDate={orderDate}
        onCancel={onCancellation}
        isDialogOpen={isDialogOpen}
      />
    </div>
  );
};

export default CustomerCancellationSection;
