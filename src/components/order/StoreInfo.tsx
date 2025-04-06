
import { Star, MapPin, Clock } from 'lucide-react';

interface StoreInfoProps {
  store: {
    name: string;
    image: string;
    rating: number;
    address: string;
    distance: string;
    estimatedTime: string;
  };
  category: {
    name: string;
    icon: string;
  };
}

const StoreInfo = ({ store, category }: StoreInfoProps) => {
  return (
    <div className="sticky top-24">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-6">
        <img 
          src={store.image} 
          alt={store.name} 
          className="w-full h-48 object-cover"
        />
        
        <div className="p-4">
          <div className="flex items-center mb-3">
            <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
            <span className="ml-1 font-medium">{store.rating}</span>
            <span className="mx-1 text-gray-400">•</span>
            <span className="text-gray-600 text-sm">100+ ratings</span>
          </div>
          
          <div className="flex items-start mb-3">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
            <div>
              <p className="text-gray-700">{store.address}</p>
              <p className="text-gray-500 text-sm">{store.distance} away</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-500 mr-2" />
            <div>
              <p className="text-gray-700">Estimated delivery time</p>
              <p className="text-gray-500 text-sm">{store.estimatedTime}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-3">Need help?</h3>
        <p className="text-gray-600 text-sm mb-3">
          You can add your shopping list in the notepad. Be specific with brands, quantities, and sizes when possible.
        </p>
        <div className="bg-jamcart-red/10 rounded-lg p-3">
          <h4 className="font-medium text-jamcart-red mb-1">Tips for faster service</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li className="flex items-start">
              <span className="h-1.5 w-1.5 rounded-full bg-jamcart-red mt-1.5 mr-2"></span>
              Be specific with brands and quantities
            </li>
            <li className="flex items-start">
              <span className="h-1.5 w-1.5 rounded-full bg-jamcart-red mt-1.5 mr-2"></span>
              Mention alternatives if possible
            </li>
            <li className="flex items-start">
              <span className="h-1.5 w-1.5 rounded-full bg-jamcart-red mt-1.5 mr-2"></span>
              Add any special instructions
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StoreInfo;
