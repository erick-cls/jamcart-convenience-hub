
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AnimatedLogo from '@/components/ui/AnimatedLogo';

const ThankYouHeader = () => {
  const navigate = useNavigate();
  
  return (
    <header className="bg-white py-4 px-6 border-b border-gray-200">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <AnimatedLogo size="sm" />
        <Button 
          variant="ghost" 
          className="text-gray-600"
          onClick={() => navigate('/categories')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shopping
        </Button>
      </div>
    </header>
  );
};

export default ThankYouHeader;
