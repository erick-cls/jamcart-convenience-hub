
import StoreCard from './StoreCard';
import { Store } from '@/types/store';

interface StoreListProps {
  stores: Store[];
  searchTerm: string;
  isLoading: boolean;
  onStoreSelect: (id: string) => void;
}

const StoreList = ({ stores, searchTerm, isLoading, onStoreSelect }: StoreListProps) => {
  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
              <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredStores.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold mb-2">No Stores Found</h3>
        <p className="text-gray-600">
          We couldn't find any stores matching "{searchTerm}".
        </p>
        {searchTerm && (
          <button
            className="mt-4 text-jamcart-red font-medium hover:underline"
            onClick={() => onStoreSelect('')}
          >
            Clear search
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredStores.map((store) => (
        <StoreCard key={store.id} store={store} onSelect={onStoreSelect} />
      ))}
    </div>
  );
};

export default StoreList;
