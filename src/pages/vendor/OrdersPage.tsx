
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useOrdersState } from '@/pages/admin/orders/useOrdersState';
import VendorLayout from '@/components/vendor/VendorLayout';
import { OrderStatus } from '@/components/ui/OrderItem';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import OrdersList from '@/pages/admin/orders/OrdersList';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    orders,
    filteredOrders,
    loading,
    updateOrderStatus,
  } = useOrdersState();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  useEffect(() => {
    if (!user || user.userType !== 'vendor') {
      navigate('/');
    }
  }, [user, navigate]);

  // Filter orders for this vendor
  const vendorOrders = filteredOrders.filter(order => 
    order.store && order.store.vendor === user?.id
  );

  // Further filter by search and status
  const displayOrders = vendorOrders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter = activeFilter === 'all' || order.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

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
          <h1 className="text-2xl font-bold mb-1">Orders</h1>
          <p className="text-gray-600">Manage and track all orders for your store</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search orders by ID or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={activeFilter} onValueChange={setActiveFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setActiveFilter('all');
            }}
          >
            Reset Filters
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-jamcart-green border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : displayOrders.length > 0 ? (
          <OrdersList 
            orders={displayOrders} 
            onViewDetails={handleViewDetails}
            onStatusChange={handleStatusChange}
            showUserInfo={true}
          />
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-lg text-gray-600">No orders found.</p>
            <p className="text-gray-500 mt-2">
              {searchTerm || activeFilter !== 'all' 
                ? "Try adjusting your search or filter criteria."
                : "When customers place orders at your store, they will appear here."}
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/vendor/dashboard')}
              className="mt-4"
            >
              Back to Dashboard
            </Button>
          </div>
        )}
      </div>
    </VendorLayout>
  );
};

export default OrdersPage;
