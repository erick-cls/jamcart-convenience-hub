
import { VendorStore } from '@/types/vendor.types';

interface StoreDetailsProps {
  store: VendorStore;
}

const StoreDetails = ({ store }: StoreDetailsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Store Information</h3>
      
      <div className="space-y-2">
        <div>
          <label className="block text-sm text-gray-400">Store Name</label>
          <p className="text-white">{store.name}</p>
        </div>
        
        <div>
          <label className="block text-sm text-gray-400">Category</label>
          <p className="text-white">{store.category}</p>
        </div>
        
        <div>
          <label className="block text-sm text-gray-400">Description</label>
          <p className="text-white">{store.description}</p>
        </div>
        
        <div>
          <label className="block text-sm text-gray-400">Address</label>
          <p className="text-white">{store.address}</p>
        </div>
        
        <div>
          <label className="block text-sm text-gray-400">Commission Rate</label>
          <p className="text-white">{(store.commissionRate * 100).toFixed(1)}%</p>
        </div>
        
        <div>
          <label className="block text-sm text-gray-400">Status</label>
          <p className={`${store.isActive ? 'text-green-500' : 'text-red-500'}`}>
            {store.isActive ? 'Active' : 'Inactive'}
          </p>
        </div>
        
        <div>
          <label className="block text-sm text-gray-400">Date Created</label>
          <p className="text-white">{new Date(store.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default StoreDetails;
