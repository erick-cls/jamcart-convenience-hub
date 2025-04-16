
import { MapPin, Bike } from 'lucide-react';

interface DeliveryInformationProps {
  delivery: string;
  rider: {
    name: string;
    phone: string;
  };
}

const DeliveryInformation = ({ delivery, rider }: DeliveryInformationProps) => {
  return (
    <>
      <div className="p-6 border-b border-gray-100">
        <h3 className="font-medium mb-3">Delivery Information</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
            <div>
              <p className="font-medium">Estimated Delivery Time</p>
              <p className="text-gray-600">{delivery}</p>
            </div>
          </div>
          <div className="flex items-start">
            <Bike className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
            <div>
              <p className="font-medium">Your Delivery Rider</p>
              <p className="text-gray-600">{rider.name} • {rider.phone}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Removed the animated SVG div */}
    </>
  );
};

export default DeliveryInformation;
