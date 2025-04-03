
import { useNavigate } from 'react-router-dom';
import { useOrdersState } from "./useOrdersState";
import OrdersSearch from "./OrdersSearch";
import OrdersFilter from "./OrdersFilter";
import OrdersList from "./OrdersList";
import OrdersEmpty from "./OrdersEmpty";
import { OrderStatus } from '@/components/ui/OrderItem';
import { useToast } from '@/hooks/use-toast';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    orders,
    filteredOrders,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    loading,
    updateOrderStatus,
    assignRider,
  } = useOrdersState();

  const handleClearFilters = () => {
    setSearchTerm('');
    setActiveFilter('all');
  };

  const handleViewDetails = (id: string) => {
    console.log(`Viewing details for order ${id}`);
  };
  
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    
    toast({
      title: "Order updated",
      description: `Order #${orderId.slice(-6)} status changed to ${newStatus}`,
    });
  };

  const handleAssignRider = (orderId: string, riderId: string) => {
    assignRider(orderId, riderId);
    
    toast({
      title: "Rider assigned",
      description: `Rider has been assigned to order #${orderId.slice(-6)}`,
    });
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
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-jamcart-green border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      ) : filteredOrders.length > 0 ? (
        <OrdersList 
          orders={filteredOrders} 
          onViewDetails={handleViewDetails}
          onStatusChange={handleStatusChange}
          onAssignRider={handleAssignRider}
          showUserInfo={true}
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
