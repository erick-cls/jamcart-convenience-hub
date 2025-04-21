
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useOrderDetails } from '@/hooks/useOrderDetails';
import { toast } from '@/hooks/use-toast';
import ThankYouHeader from '@/components/order/ThankYouHeader';
import OrderConfirmation from '@/components/order/OrderConfirmation';
import OrderDetails from '@/components/order/OrderDetails';
import DeliveryInformation from '@/components/order/DeliveryInformation';
import ActionButtons from '@/components/order/ActionButtons';
import GoogleMap from '@/components/maps/GoogleMap';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const ThankYouPage = () => {
  const orderDetails = useOrderDetails();
  const [customerLocation, setCustomerLocation] = useState({ lat: 18.0179, lng: -76.8099 });
  const [riderLocation, setRiderLocation] = useState({ lat: 18.0250, lng: -76.8150 });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Check if API key exists
  useEffect(() => {
    const savedKeys = localStorage.getItem('apiKeys');
    if (!savedKeys) {
      setMapError(true);
      toast({
        title: "Google Maps API key missing",
        description: "Please add your Google Maps API key in Admin Settings",
        variant: "destructive",
      });
    } else {
      const parsedKeys = JSON.parse(savedKeys);
      if (!parsedKeys.googleMaps) {
        setMapError(true);
        toast({
          title: "Google Maps API key missing",
          description: "Please add your Google Maps API key in Admin Settings",
          variant: "destructive",
        });
      }
    }
  }, []);

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

  // Function to add a test API key
  const handleAddTestApiKey = () => {
    const testApiKey = {
      googleMaps: "TEST_API_KEY_FOR_DEVELOPMENT"
    };
    localStorage.setItem('apiKeys', JSON.stringify(testApiKey));
    window.location.reload();
  };

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
            
            {/* Google Map for tracking delivery */}
            <div className="p-4">
              {mapError ? (
                <div className="bg-gray-100 rounded-lg p-6 text-center">
                  <p className="text-gray-600 mb-4">
                    Google Maps couldn't be loaded. Please add a Google Maps API key in the Admin Settings.
                  </p>
                  
                  <Sheet>
                    <SheetTrigger asChild>
                      <button 
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                      >
                        Add Test API Key
                      </button>
                    </SheetTrigger>
                    <SheetContent>
                      <div className="py-6">
                        <h3 className="text-lg font-medium mb-4">Add API Key</h3>
                        <p className="text-gray-600 mb-4">
                          This will add a test API key for development purposes only.
                          In production, please obtain a valid Google Maps API key.
                        </p>
                        <button
                          onClick={handleAddTestApiKey}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                        >
                          Add Test Key & Reload
                        </button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              ) : (
                <GoogleMap 
                  customerLocation={customerLocation}
                  riderLocation={riderLocation}
                  customerName="You"
                  riderName={orderDetails.rider?.name || "Rider"}
                  height="300px"
                  onLoad={() => setMapLoaded(true)}
                  onError={() => setMapError(true)}
                />
              )}
            </div>
          </motion.div>

          <ActionButtons />
        </div>
      </main>
    </div>
  );
};

export default ThankYouPage;
