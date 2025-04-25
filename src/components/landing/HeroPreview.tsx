
import { motion } from 'framer-motion';
import { ShoppingCart, PackageCheck, Clock, MapPin, StarIcon } from 'lucide-react';
import AnimatedLogo from '@/components/ui/AnimatedLogo';

const HeroPreview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="relative mx-auto max-w-md lg:max-w-none"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-jamcart-red/20 to-jamcart-yellow/20 rounded-3xl transform rotate-3 scale-105"></div>
        <div className="glass-card rounded-3xl p-6 relative">
          <div className="flex justify-between items-center mb-6">
            <AnimatedLogo size="md" />
            <div className="flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></span>
              <span className="text-sm font-medium">Online</span>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <PreviewOrderCard />
            <PreviewTrackingCard />
          </div>
          
          <PreviewSpecialOffer />
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-xs text-gray-500">Delivery to Kingston</span>
            </div>
            <div className="flex items-center">
              <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-xs font-medium">4.9</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PreviewOrderCard = () => (
  <div className="bg-gray-50 rounded-lg p-4">
    <h3 className="font-semibold mb-2">Recent Order</h3>
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="bg-jamcart-yellow/20 rounded-full p-2 mr-3">
          <ShoppingCart className="h-4 w-4 text-jamcart-red" />
        </div>
        <div>
          <p className="text-sm font-medium">Supermarket Order</p>
          <p className="text-xs text-gray-500">15 mins ago</p>
        </div>
      </div>
      <span className="text-sm font-semibold">$42.50</span>
    </div>
  </div>
);

const PreviewTrackingCard = () => (
  <div className="bg-gray-50 rounded-lg p-4">
    <div className="flex items-center mb-3">
      <div className="bg-jamcart-green/20 rounded-full p-2 mr-3">
        <PackageCheck className="h-4 w-4 text-jamcart-green" />
      </div>
      <p className="text-sm font-medium">Your order is on the way!</p>
    </div>
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <Clock className="h-4 w-4 text-gray-500 mr-1" />
        <span className="text-xs text-gray-500">Arriving in 20-30 min</span>
      </div>
      <button className="text-xs text-jamcart-red font-medium">Track</button>
    </div>
  </div>
);

const PreviewSpecialOffer = () => (
  <div className="bg-gradient-to-r from-jamcart-red to-jamcart-red/80 text-white rounded-xl p-4 mb-6">
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-semibold">Special Offer</h3>
      <span className="text-xs bg-white text-jamcart-red rounded-full px-2 py-0.5">Limited</span>
    </div>
    <p className="text-sm mb-3">Get 15% off your first 3 orders with code:</p>
    <div className="bg-white/20 rounded-lg px-3 py-2 text-center mb-3">
      <span className="font-mono font-bold tracking-wider">WELCOME15</span>
    </div>
    <button className="bg-white text-jamcart-red text-sm font-medium rounded-lg py-2 w-full">
      Claim Offer
    </button>
  </div>
);

export default HeroPreview;
