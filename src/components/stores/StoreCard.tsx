
import { motion } from 'framer-motion';
import { MapPin, Star, Clock } from 'lucide-react';
import { Store } from '@/types/store.types';
import { ActionButton } from '@/components/ui/ActionButton';

interface StoreCardProps {
  store: Store;
  onSelect: (id: string) => void;
}

export const StoreCard = ({ store, onSelect }: StoreCardProps) => {
  return (
    <motion.div 
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 h-full flex flex-col"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-48">
        <img 
          src={store.image} 
          alt={store.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-3 left-3 bg-white rounded-full px-2 py-1 flex items-center text-xs font-medium shadow-sm">
          <Clock className="h-3 w-3 mr-1 text-jamcart-red" />
          {store.estimatedTime}
        </div>
      </div>
      
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{store.name}</h3>
          <div className="flex items-center bg-jamcart-yellow/10 text-yellow-700 px-2 py-1 rounded-md text-sm">
            <Star className="h-3.5 w-3.5 fill-yellow-500 stroke-yellow-500 mr-1" />
            {store.rating}
          </div>
        </div>
        
        <div className="flex items-start mb-3">
          <MapPin className="h-4 w-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <p className="text-gray-600 text-sm">{store.address}</p>
            <p className="text-gray-500 text-xs">{store.distance} away</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 pt-0 mt-auto">
        <ActionButton
          variant="primary"
          size="md"
          className="w-full"
          onClick={() => onSelect(store.id)}
        >
          Select Store
        </ActionButton>
      </div>
    </motion.div>
  );
};
