
import { Check } from 'lucide-react';
import AnimatedLogo from '@/components/ui/AnimatedLogo';

const BrandingSection = () => {
  return (
    <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-jamcart-green to-jamcart-green/80 p-12 flex-col justify-between text-white">
      <div>
        <AnimatedLogo size="md" className="mb-12" />
        <h1 className="text-4xl font-bold mb-4">Welcome to JAMCart</h1>
        <p className="text-white/90 text-lg mb-8">
          Your one-stop convenience hub for all your daily needs.
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-start">
          <div className="bg-white/20 p-2 rounded-full mr-4">
            <Check className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Fast Delivery</h3>
            <p className="text-white/80 text-sm">Get your items delivered in under an hour</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="bg-white/20 p-2 rounded-full mr-4">
            <Check className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Multiple Categories</h3>
            <p className="text-white/80 text-sm">From groceries to bill payments, all in one app</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="bg-white/20 p-2 rounded-full mr-4">
            <Check className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Secure Payments</h3>
            <p className="text-white/80 text-sm">Pay securely with multiple payment options</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingSection;
