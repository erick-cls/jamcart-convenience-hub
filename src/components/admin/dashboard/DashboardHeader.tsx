
import { ShoppingBag, Users } from 'lucide-react';

interface DashboardHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardHeader = ({ activeTab, setActiveTab }: DashboardHeaderProps) => (
  <div className="flex flex-wrap items-center justify-between mb-8">
    <div>
      <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
      <p className="text-gray-600">Monitor orders, users, and business performance</p>
    </div>
    <div className="flex space-x-4 bg-white rounded-lg shadow-sm p-1 border border-gray-100">
      <button
        onClick={() => setActiveTab('orders')}
        className={`px-4 py-2 rounded-md transition-colors ${
          activeTab === 'orders'
            ? 'bg-jamcart-red text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center">
          <ShoppingBag className="h-4 w-4 mr-2" />
          Orders
        </div>
      </button>
      <button
        onClick={() => setActiveTab('users')}
        className={`px-4 py-2 rounded-md transition-colors ${
          activeTab === 'users'
            ? 'bg-jamcart-red text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-2" />
          Users
        </div>
      </button>
    </div>
  </div>
);

export default DashboardHeader;
