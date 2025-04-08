
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ActionButtons = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center">
      <Button 
        className="mx-2" 
        variant="outline"
        onClick={() => navigate('/categories')}
      >
        Continue Shopping
      </Button>
      <Button 
        onClick={() => navigate('/orders')}
        className="mx-2"
      >
        View Order History
      </Button>
    </div>
  );
};

export default ActionButtons;
