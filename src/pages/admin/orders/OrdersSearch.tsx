
import { Search } from 'lucide-react';

interface OrdersSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const OrdersSearch = ({ searchTerm, setSearchTerm }: OrdersSearchProps) => {
  return (
    <div className="relative flex-grow">
      <input
        type="text"
        placeholder="Search orders by store, category, or ID..."
        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-jamcart-red/50"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Search className="h-5 w-5" />
      </div>
    </div>
  );
};

export default OrdersSearch;
