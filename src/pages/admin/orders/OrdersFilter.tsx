
import { Filter, Download } from 'lucide-react';
import ActionButton from '@/components/ui/ActionButton';

interface OrdersFilterProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  onExport?: () => void; // Made onExport optional
}

// Order status options
const statusOptions = [
  { label: 'All Orders', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Completed', value: 'completed' },
  { label: 'Declined', value: 'declined' },
  { label: 'Cancelled', value: 'cancelled' }
];

const OrdersFilter = ({ activeFilter, setActiveFilter, onExport }: OrdersFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 md:overflow-visible flex-nowrap">
      <div className="p-2 bg-gray-100 rounded-lg flex items-center text-gray-500 text-sm font-medium">
        <Filter className="h-4 w-4 mr-1" />
        <span>Filter:</span>
      </div>
      
      {statusOptions.map((option) => (
        <button
          key={option.value}
          className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
            activeFilter === option.value
              ? 'bg-jamcart-green text-white'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => setActiveFilter(option.value)}
        >
          {option.label}
        </button>
      ))}
      
      {onExport && (
        <ActionButton
          variant="outline"
          size="sm"
          className="ml-2"
          onClick={onExport}
          icon={<Download className="h-4 w-4" />}
        >
          Export
        </ActionButton>
      )}
    </div>
  );
};

export default OrdersFilter;
