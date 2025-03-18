
import AnimatedLogo from '@/components/ui/AnimatedLogo';

const MobileHeader = () => {
  return (
    <div className="md:hidden mb-8">
      <AnimatedLogo size="md" className="mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-center mb-2">Welcome to JAMCart</h1>
      <p className="text-gray-600 text-center">
        Your one-stop convenience hub
      </p>
    </div>
  );
};

export default MobileHeader;
