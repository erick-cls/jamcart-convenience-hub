
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ActionButton from '@/components/ui/ActionButton';
import { ArrowRight, ClipboardList, ShoppingCart, Sparkles } from 'lucide-react';

const HowItWorksSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 bg-black">
      <div className="app-container">
        <div className="text-center mb-12">
          <span className="inline-block bg-[#fdf7d5] text-white rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">How JAMCart Works</h2>
          <p className="text-[#1da751] max-w-2xl mx-auto">
            Getting what you need delivered is as easy as 1-2-3
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <StepCard
            step={1}
            title="1. Create an Account"
            description="Sign up with your name, address, and phone number for verification."
            icon={<ClipboardList className="h-8 w-8" />}
            delay={0.1}
          />
          <StepCard
            step={2}
            title="2. Select Categories"
            description="Choose from our variety of categories and create your shopping list."
            icon={<ShoppingCart className="h-8 w-8" />}
            delay={0.2}
          />
          <StepCard
            step={3}
            title="3. Enjoy Delivery"
            description="Confirm your order and get your items delivered to your doorstep."
            icon={<Sparkles className="h-8 w-8" />}
            delay={0.3}
          />
        </div>
        
        <div className="text-center mt-12">
          <ActionButton 
            onClick={() => navigate('/how-it-works')}
            variant="outline"
            icon={<ArrowRight className="h-5 w-5" />}
            iconPosition="right"
            className="border-white text-white hover:bg-[#1da751] hover:border-[#1da751]"
          >
            Learn More
          </ActionButton>
        </div>
      </div>
    </section>
  );
};

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

const StepCard = ({ step, title, description, icon, delay }: StepCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="text-center"
  >
    <div className="w-16 h-16 bg-[#e8f5e9] rounded-full flex items-center justify-center mx-auto mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-[#1da751]">{title}</h3>
    <p className="text-white">{description}</p>
  </motion.div>
);

export default HowItWorksSection;
