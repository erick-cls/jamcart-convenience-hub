
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyOrdersStateProps {
  activeFilter: string;
  onClearFilters: () => void;
}

const EmptyOrdersState = ({ activeFilter, onClearFilters }: EmptyOrdersStateProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8 text-center">
      <div className="mb-4">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
          <XCircle className="h-6 w-6 text-gray-500" />
        </div>
      </div>
      <h3 className="text-base md:text-lg font-medium mb-2">No orders found</h3>
      <p className="text-sm md:text-base text-gray-500 mb-4 md:mb-6">
        {activeFilter !== 'all' ? (
          `There are no orders with the "${activeFilter}" status.`
        ) : (
          "There are no orders available at this time."
        )}
      </p>
      {activeFilter !== 'all' && (
        <Button
          variant="outline"
          onClick={onClearFilters}
        >
          View All Orders
        </Button>
      )}
    </div>
  );
};

export default EmptyOrdersState;
