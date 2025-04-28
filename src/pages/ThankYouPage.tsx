
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useOrderDetails } from '@/hooks/useOrderDetails';
import ThankYouHeader from '@/components/order/ThankYouHeader';
import OrderConfirmation from '@/components/order/OrderConfirmation';
import OrderDetails from '@/components/order/OrderDetails';
import DeliveryTracking from '@/components/order/DeliveryTracking';
import ActionButtons from '@/components/order/ActionButtons';
import { useGoogleMapsSetup } from '@/hooks/useGoogleMapsSetup';
import { useLocationTracking } from '@/hooks/useLocationTracking';

const ThankYouPage = () => {
  const { orderId } = useParams();
  const orderDetails = useOrderDetails();
  const { mapError, setMapError, handleAddTestApiKey } = useGoogleMapsSetup();
  const { customerLocation, riderLocation } = useLocationTracking(orderDetails.rider);

  // Log the current orderId for debugging
  useEffect(() => {
    console.log("Order confirmed:", orderId);
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ThankYouHeader />

      <main className="flex-1 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <OrderConfirmation />
          <OrderDetails orderDetails={orderDetails} />
          
          <DeliveryTracking 
            delivery={orderDetails.delivery}
            rider={orderDetails.rider}
            customerLocation={customerLocation}
            riderLocation={riderLocation}
            mapError={mapError}
            onAddTestApiKey={handleAddTestApiKey}
          />

          <ActionButtons />
        </div>
      </main>
    </div>
  );
};

export default ThankYouPage;
