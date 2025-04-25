
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ActionButton from '@/components/ui/ActionButton';
import { ArrowRight } from 'lucide-react';
import AnimatedLogo from '@/components/ui/AnimatedLogo';
import { useAuth } from '@/context/AuthContext';

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleGetStarted = () => {
    if (user) {
      navigate('/categories');
    } else {
      navigate('/auth?mode=register');
    }
  };
  
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden bg-black">
      <div className="app-container relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <span className="inline-block bg-jamcart-red/10 text-jamcart-red rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              Convenience at your fingertips
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
              Your One-Stop <br className="hidden md:block" />
              <span className="text-jamcart-red">Convenience Hub</span>
            </h1>
            <p className="text-lg text-white mb-8 max-w-lg mx-auto lg:mx-0">
              Get groceries, food, pharmaceuticals, and more delivered right to your doorstep with a simple click.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <ActionButton 
                size="lg" 
                onClick={handleGetStarted}
                icon={<ArrowRight className="h-5 w-5" />}
                iconPosition="right"
              >
                Get Started
              </ActionButton>
              <ActionButton 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/how-it-works')}
                className="border-white text-white hover:bg-[#1da751] hover:border-[#1da751]"
              >
                How It Works
              </ActionButton>
            </div>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden"
                  >
                    <span className="text-xs font-bold text-gray-500">
                      {String.fromCharCode(64 + i)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <span className="text-white font-semibold">500+ people</span>
                <span className="text-[#1da751] ml-1">already using JAMCart</span>
              </div>
            </div>
          </motion.div>
          
          <HeroPreview />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
