
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import OrdersSearch from './OrdersSearch';
import OrdersFilter from './OrdersFilter';
import OrdersList from './OrdersList';
import OrdersEmpty from './OrdersEmpty';
import { useOrdersState } from './useOrdersState';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    filteredOrders, 
    searchTerm, 
    setSearchTerm, 
    activeFilter, 
    setActiveFilter 
  } = useOrdersState();
  
  useEffect(() => {
    // Check if user is admin
    if (!user?.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);
  
  const handleViewOrderDetails = (orderId: string) => {
    navigate(`/admin/orders/${orderId}`);
  };
  
  const handleExportCSV = () => {
    // In a real app, this would generate and download a CSV file
    alert('Export functionality would be implemented here');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="app-container">
        <div className="flex items-center mb-8">
          <button
            className="p-2 rounded-full hover:bg-gray-200 mr-3"
            onClick={() => navigate('/admin/dashboard')}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold mb-1">Orders Management</h1>
            <p className="text-gray-600">View and manage all customer orders</p>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="p-5 flex flex-col md:flex-row justify-between gap-4">
            <OrdersSearch 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
            />
            
            <OrdersFilter 
              activeFilter={activeFilter} 
              setActiveFilter={setActiveFilter}
              onExport={handleExportCSV}
            />
          </div>
        </div>
        
        {/* Orders Grid */}
        {filteredOrders.length > 0 ? (
          <OrdersList 
            orders={filteredOrders} 
            onViewDetails={handleViewOrderDetails} 
          />
        ) : (
          <OrdersEmpty 
            searchTerm={searchTerm}
            activeFilter={activeFilter}
            onClearFilters={() => {
              setSearchTerm('');
              setActiveFilter('all');
            }}
            onBackToDashboard={() => navigate('/admin/dashboard')}
          />
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
