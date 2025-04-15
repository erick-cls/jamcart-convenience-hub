import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useOrderDetails } from '@/hooks/useOrderDetails';
import ThankYouHeader from '@/components/order/ThankYouHeader';
import OrderConfirmation from '@/components/order/OrderConfirmation';
import OrderDetails from '@/components/order/OrderDetails';
import DeliveryInformation from '@/components/order/DeliveryInformation';
import ActionButtons from '@/components/order/ActionButtons';
import GoogleMap from '@/components/maps/GoogleMap';

const ThankYouPage = () => {
  const orderDetails = useOrderDetails();
  const [customerLocation, setCustomerLocation] = useState({ lat: 18.0179, lng: -76.8099 });
  const [riderLocation, setRiderLocation] = useState({ lat: 18.0250, lng: -76.8150 });

  // Simulate rider movement toward customer location
  useEffect(() => {
    if (!orderDetails.rider) return;
    
    const simulateMovement = setInterval(() => {
      setRiderLocation(prev => {
        const latDiff = customerLocation.lat - prev.lat;
        const lngDiff = customerLocation.lng - prev.lng;
        
        // Move rider closer to customer
        return {
          lat: prev.lat + latDiff * 0.1,
          lng: prev.lng + lngDiff * 0.1
        };
      });
    }, 5000);
    
    return () => clearInterval(simulateMovement);
  }, [orderDetails.rider, customerLocation]);
  
  // Get user's current location if permission granted
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCustomerLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Geolocation error:", error);
          // Keep default location for Kingston, Jamaica
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ThankYouHeader />

      <main className="flex-1 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <OrderConfirmation />
          <OrderDetails orderDetails={orderDetails} />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8"
          >
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-medium">Track Your Delivery</h3>
            </div>
            <DeliveryInformation 
              delivery={orderDetails.delivery} 
              rider={orderDetails.rider} 
            />
            
            {/* Google Map replacing the animation */}
            <div className="p-4">
              <GoogleMap 
                customerLocation={customerLocation}
                riderLocation={riderLocation}
                height="300px"
              />
            </div>
          </motion.div>

          <ActionButtons />
        </div>
      </main>
    </div>
  );
};

export default ThankYouPage;
