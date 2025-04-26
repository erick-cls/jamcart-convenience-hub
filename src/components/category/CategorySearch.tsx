
import { Search, Filter } from 'lucide-react';

interface CategorySearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const CategorySearch = ({ searchTerm, onSearchChange }: CategorySearchProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Search stores..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-jamcart-red/50"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search className="h-5 w-5" />
        </div>
      </div>
      
      <button className="px-4 py-3 bg-white border border-gray-200 rounded-xl flex items-center gap-2 hover:bg-gray-50">
        <Filter className="h-5 w-5 text-gray-500" />
        <span>Filter</span>
      </button>
    </div>
  );
};

export default CategorySearch;
