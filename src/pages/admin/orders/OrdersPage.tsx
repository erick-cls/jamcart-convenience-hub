
import { useNavigate } from 'react-router-dom';
import { useOrdersState } from "./useOrdersState";
import OrdersSearch from "./OrdersSearch";
import OrdersFilter from "./OrdersFilter";
import OrdersList from "./OrdersList";
import OrdersEmpty from "./OrdersEmpty";

const OrdersPage = () => {
  const navigate = useNavigate();
  const {
    orders,
    filteredOrders,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    loading,
  } = useOrdersState();

  const handleClearFilters = () => {
    setSearchTerm('');
    setActiveFilter('all');
  };

  const handleViewDetails = (id: string) => {
    console.log(`Viewing details for order ${id}`);
    // In a real app, this would navigate to a details page
    // navigate(`/admin/orders/${id}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Orders</h1>
        <p className="text-gray-600">Manage and track all customer orders</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <OrdersSearch 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />
        <OrdersFilter 
          activeFilter={activeFilter} 
          setActiveFilter={setActiveFilter} 
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-jamcart-red border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      ) : filteredOrders.length > 0 ? (
        <OrdersList 
          orders={filteredOrders} 
          onViewDetails={handleViewDetails} 
        />
      ) : (
        <OrdersEmpty 
          searchTerm={searchTerm} 
          activeFilter={activeFilter} 
          onClearFilters={handleClearFilters}
          onBackToDashboard={() => navigate('/admin/dashboard')}
        />
      )}
    </div>
  );
};

export default OrdersPage;
