
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import VendorLayout from '@/components/vendor/VendorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderStatus } from '@/components/ui/OrderItem';
import { useToast } from '@/hooks/use-toast';
import { useVendorCommissions } from '@/hooks/useVendorCommissions';
import VendorOrdersList from '@/components/vendor/VendorOrdersList';
import StoreInfoCard from '@/components/vendor/StoreInfoCard';
import { useVendorOrdersState } from '@/hooks/useVendorOrdersState';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { commissions, getVendorCommission } = useVendorCommissions();
  
  const {
    orders,
    filteredOrders,
    isRefreshing,
    handleOrderUpdate,
    refreshOrders
  } = useVendorOrdersState(user?.id || '');
  
  // Filter orders for the specific vendor
  const vendorOrders = filteredOrders.filter(order => 
    order.store && order.store.vendor === user?.id
  );
  
  const [userCommission, setUserCommission] = useState<number>(0);
  
  useEffect(() => {
    if (!user || user.userType !== 'vendor') {
      navigate('/');
      return;
    }
    
    if (user.id) {
      const vendorCommission = getVendorCommission(user.id);
      setUserCommission(vendorCommission?.rate || 15); // Default to 15% if not set
    }
  }, [user, navigate, commissions, getVendorCommission]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    handleOrderUpdate(orderId, newStatus);
    
    toast({
      title: "Order updated",
      description: `Order #${orderId.slice(-6)} status changed to ${newStatus}`,
      variant: "default",
    });
  };

  const handleViewDetails = (id: string) => {
    navigate(`/vendor/orders/${id}`);
  };
  
  const pendingOrders = vendorOrders.filter(order => order.status === 'pending').length;
  const completedOrders = vendorOrders.filter(order => order.status === 'completed').length;
  const totalRevenue = vendorOrders.reduce((sum, order) => sum + order.total, 0);
  const totalFees = (totalRevenue * (userCommission / 100)).toFixed(2);

  return (
    <VendorLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Vendor Dashboard</h1>
          <p className="text-gray-600">Manage your store and orders</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Store Information</CardTitle>
            </CardHeader>
            <CardContent>
              <StoreInfoCard />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Business Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600">Orders</p>
                  <p className="text-2xl font-bold">{vendorOrders.length}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600">Completed</p>
                  <p className="text-2xl font-bold">{completedOrders}</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-4">
                  <p className="text-sm text-amber-600">Pending</p>
                  <p className="text-2xl font-bold">{pendingOrders}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-600">Revenue</p>
                  <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm font-medium flex justify-between">
                  <span>Platform Fee ({userCommission}%):</span>
                  <span className="text-amber-600">${totalFees}</span>
                </p>
                <p className="text-sm font-medium flex justify-between mt-1">
                  <span>Your Earnings:</span>
                  <span className="text-green-600">${(totalRevenue - parseFloat(totalFees)).toFixed(2)}</span>
                </p>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => refreshOrders()} 
                disabled={isRefreshing}
                className="w-full"
              >
                {isRefreshing ? "Refreshing..." : "Refresh Orders"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {isRefreshing ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-jamcart-green border-r-transparent"></div>
                <p className="mt-4 text-gray-600">Refreshing orders...</p>
              </div>
            ) : vendorOrders.length > 0 ? (
              <VendorOrdersList 
                orders={vendorOrders} 
                onViewDetails={handleViewDetails}
                onStatusChange={handleStatusChange}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-lg text-gray-600">No orders found for your store.</p>
                <p className="text-gray-500 mt-1">When customers place orders with your store, they will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  );
};

export default VendorDashboard;
