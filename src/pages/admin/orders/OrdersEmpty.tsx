
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import ActionButton from '@/components/ui/ActionButton';
import { useNavigate } from 'react-router-dom';

interface OrdersEmptyProps {
  searchTerm: string;
  activeFilter: string;
  onClearFilters?: () => void;
  onBackToDashboard?: () => void;
}

const OrdersEmpty = ({ 
  searchTerm, 
  activeFilter, 
  onClearFilters, 
  onBackToDashboard 
}: OrdersEmptyProps) => {
  const navigate = useNavigate();
  
  const handleClearFilters = () => {
    if (onClearFilters) {
      onClearFilters();
    }
  };
  
  const handleBackToDashboard = () => {
    if (onBackToDashboard) {
      onBackToDashboard();
    } else {
      navigate('/admin/dashboard');
    }
  };
  
  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
        <Search className="h-10 w-10 text-gray-400" />
      </div>
      <h2 className="text-xl font-semibold mb-2">No Orders Found</h2>
      <p className="text-gray-600 mb-6">
        {searchTerm
          ? `No orders matching "${searchTerm}" with the selected filter.`
          : `No ${activeFilter !== 'all' ? activeFilter : ''} orders found.`}
      </p>
      <div className="flex justify-center gap-4">
        <ActionButton
          variant="outline"
          size="md"
          onClick={handleClearFilters}
        >
          Clear Filters
        </ActionButton>
        <ActionButton
          variant="primary"
          size="md"
          onClick={handleBackToDashboard}
        >
          Back to Dashboard
        </ActionButton>
      </div>
    </motion.div>
  );
};

export default OrdersEmpty;
