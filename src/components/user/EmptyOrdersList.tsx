
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const EmptyOrdersList = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8 text-center">
      <h3 className="text-base md:text-lg font-medium mb-2">No orders found</h3>
      <p className="text-sm md:text-base text-gray-500 mb-4 md:mb-6">
        You haven't placed any orders yet.
      </p>
      <Button onClick={() => navigate('/categories')}>Browse Categories</Button>
    </div>
  );
};

export default EmptyOrdersList;
