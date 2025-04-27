
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface OrderCancellationTimerProps {
  orderId: string;
  orderDate: string;
  onCancel: (isPenaltyFree: boolean) => void;
  isDialogOpen: boolean;
}

const OrderCancellationTimer = ({ 
  orderId, 
  orderDate, 
  onCancel,
  isDialogOpen 
}: OrderCancellationTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isPenaltyFree, setIsPenaltyFree] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Format seconds into MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  useEffect(() => {
    // Calculate time elapsed since order creation
    const orderCreationTime = new Date(orderDate).getTime();
    const currentTime = Date.now();
    const elapsedSeconds = Math.floor((currentTime - orderCreationTime) / 1000);
    
    // Free cancellation period is 10 minutes (600 seconds)
    const freeCancellationPeriod = 600;
    
    // Calculate remaining time
    const remaining = Math.max(0, freeCancellationPeriod - elapsedSeconds);
    setTimeRemaining(remaining);
    setIsPenaltyFree(remaining > 0);
    
    // Set up a timer to countdown
    const timerId = setInterval(() => {
      setTimeRemaining(prevTime => {
        const newTime = Math.max(0, prevTime - 1);
        if (newTime === 0) {
          // When countdown reaches 0, set penalty flag
          setIsPenaltyFree(false);
          clearInterval(timerId);
        }
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [orderDate]);
  
  const handleCancel = () => {
    onCancel(isPenaltyFree);
  };
  
  return (
    <Button
      onClick={handleCancel}
      variant="destructive"
      className="w-full"
      disabled={isSubmitting}
    >
      {isPenaltyFree ? (
        <>
          Cancel Order (Free: {formatTime(timeRemaining)})
        </>
      ) : (
        <>
          Cancel Order ($1000 JMD penalty)
        </>
      )}
    </Button>
  );
};

export default OrderCancellationTimer;
