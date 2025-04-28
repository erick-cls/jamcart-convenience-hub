
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import GoogleMap from '@/components/maps/GoogleMap';
import DeliveryInformation from './DeliveryInformation';

interface DeliveryTrackingProps {
  delivery: string;
  rider: {
    name: string;
    phone: string;
  } | null;
  customerLocation: { lat: number; lng: number };
  riderLocation: { lat: number; lng: number };
  mapError: boolean;
  onAddTestApiKey: () => void;
}

const DeliveryTracking = ({
  delivery,
  rider,
  customerLocation,
  riderLocation,
  mapError,
  onAddTestApiKey
}: DeliveryTrackingProps) => {
  return (
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
        delivery={delivery} 
        rider={rider} 
      />
      
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
                    onClick={onAddTestApiKey}
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
            riderName={rider?.name || "Rider"}
            height="300px"
          />
        )}
      </div>
    </motion.div>
  );
};

export default DeliveryTracking;
