
import { Button } from '@/components/ui/button';
import { FilterX } from 'lucide-react';

interface OrderFilterButtonsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onClearFilters: () => void;
}

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Completed', value: 'completed' },
  { label: 'Declined', value: 'declined' },
  { label: 'Cancelled', value: 'cancelled' },
];

const OrderFilterButtons = ({ 
  activeFilter, 
  onFilterChange, 
  onClearFilters 
}: OrderFilterButtonsProps) => {
  return (
    <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 mb-4 md:mb-6 overflow-x-auto">
      <div className="flex flex-nowrap gap-2 md:flex-wrap">
        {filterOptions.map(option => (
          <Button
            key={option.value}
            variant={activeFilter === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange(option.value)}
            className={`${activeFilter === option.value ? 'bg-jamcart-green hover:bg-jamcart-green/90' : ''} whitespace-nowrap`}
          >
            {option.label}
          </Button>
        ))}
        
        {activeFilter !== 'all' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="ml-auto whitespace-nowrap"
          >
            <FilterX className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderFilterButtons;
