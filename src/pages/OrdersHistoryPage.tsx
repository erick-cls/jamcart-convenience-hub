
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import UserOrdersList from '@/components/user/UserOrdersList';
import { useOrdersState, Order } from '@/pages/admin/orders/useOrdersState';
import { useToast } from '@/hooks/use-toast';

const OrdersHistoryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getUserOrders } = useOrdersState();
  const { toast } = useToast();
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now());

  const fetchUserOrders = useCallback(() => {
    if (user) {
      setIsRefreshing(true);
      try {
        console.log("Fetching orders for user:", user.id);
        const orders = getUserOrders(user.id);
        console.log("Found", orders.length, "orders for user", user.id, ":", 
          orders.map(o => `${o.id.slice(-6)}: ${o.status}`).join(', '));
        
        // Update state more aggressively - always update on fetch
        setUserOrders(orders);
        setLastRefresh(Date.now());
      } catch (error) {
        console.error("Error fetching user orders:", error);
        toast({
          title: "Error refreshing orders",
          description: "There was a problem updating your orders. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsRefreshing(false);
      }
    }
  }, [user, getUserOrders, toast]);

  // Force refresh of orders
  const forceRefresh = useCallback(() => {
    fetchUserOrders();
    toast({
      title: "Orders refreshed",
      description: "Your order list has been updated with the latest status.",
    });
  }, [fetchUserOrders, toast]);

  useEffect(() => {
    if (!user) {
      navigate('/auth?mode=login');
      return;
    }
    
    fetchUserOrders();
    
    // Add an event listener for storage changes to refresh orders when updated
    const handleStorageChange = () => {
      console.log("Storage change detected, refreshing orders...");
      fetchUserOrders();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Set up more frequent refresh every 1 second for more responsive updates
    const refreshInterval = setInterval(fetchUserOrders, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(refreshInterval);
    };
  }, [user, navigate, fetchUserOrders]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="app-container pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Orders</h1>
            <button 
              onClick={forceRefresh}
              disabled={isRefreshing}
              className="text-sm px-4 py-2 bg-jamcart-green text-white rounded-md hover:bg-jamcart-green/90 disabled:opacity-50"
            >
              {isRefreshing ? "Refreshing..." : "Refresh Orders"}
            </button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>View and track all your orders</CardDescription>
            </CardHeader>
            <CardContent>
              <UserOrdersList 
                orders={userOrders} 
                onOrderUpdate={fetchUserOrders} 
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrdersHistoryPage;
