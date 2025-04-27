
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import VendorLayout from '@/components/vendor/VendorLayout';
import OrdersList from '@/pages/admin/orders/OrdersList';
import { useOrdersState } from '@/pages/admin/orders/useOrdersState';
import { OrderStatus } from '@/components/ui/OrderItem';
import { useToast } from '@/hooks/use-toast';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
  } = useOrdersState();

  // Filter orders for the specific vendor
  const vendorOrders = filteredOrders.filter(order => 
    order.store && order.store.vendor === user?.id
  );

  useEffect(() => {
    if (!user || user.userType !== 'vendor') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    
    toast({
      title: "Order updated",
      description: `Order #${orderId.slice(-6)} status changed to ${newStatus}`,
      variant: "default",
    });
  };

  const handleViewDetails = (id: string) => {
    navigate(`/vendor/orders/${id}`);
  };

  return (
    <VendorLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Vendor Dashboard</h1>
          <p className="text-gray-600">Manage and track all your store orders</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Store Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600">Total Orders</p>
              <p className="text-2xl font-bold">{vendorOrders.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600">Completed Orders</p>
              <p className="text-2xl font-bold">
                {vendorOrders.filter(order => order.status === 'completed').length}
              </p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <p className="text-sm text-amber-600">Pending Orders</p>
              <p className="text-2xl font-bold">
                {vendorOrders.filter(order => order.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-jamcart-green border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading orders...</p>
            </div>
          ) : vendorOrders.length > 0 ? (
            <OrdersList 
              orders={vendorOrders} 
              onViewDetails={handleViewDetails}
              onStatusChange={handleStatusChange}
              showUserInfo={true}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">No orders found.</p>
              <p className="text-gray-500">When customers place orders at your store, they will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </VendorLayout>
  );
};

export default VendorDashboard;
