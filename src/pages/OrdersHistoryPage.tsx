
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import UserOrdersList from '@/components/user/UserOrdersList';
import UserWallet from '@/components/wallet/UserWallet';
import { useOrdersState } from '@/pages/admin/orders/useOrdersState';
import { Order as AdminOrder } from '@/pages/admin/orders/types';
import { Order as UserOrder } from '@/hooks/useUserOrdersState';
import { useToast } from '@/hooks/use-toast';
import { OrderStatus } from '@/components/ui/OrderItem';
import { RefreshCcw } from 'lucide-react';

const OrdersHistoryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getUserOrders } = useOrdersState();
  const { toast } = useToast();
  const [userOrders, setUserOrders] = useState<UserOrder[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(Date.now());

  const fetchUserOrders = useCallback(() => {
    if (user) {
      setIsRefreshing(true);
      try {
        console.log("Fetching orders for user:", user.id);
        const orders = getUserOrders(user.id);
        console.log("Found", orders.length, "orders for user", user.id);
        
        // Transform AdminOrder to UserOrder
        const transformedOrders: UserOrder[] = orders.map(order => ({
          id: order.id,
          storeName: order.storeName,
          category: order.category,
          date: order.date,
          status: order.status,
          items: order.items,
          total: order.total,
          userId: order.userId,
          userName: order.userName,
          riderId: order.riderId,
          riderName: order.riderName,
          isNew: order.isNew,
          store: order.store,
          user: order.user,
          address: order.address,
          price: order.price,
          notes: order.notes,
          estimatedTime: order.estimatedTime
        }));
        
        setUserOrders(transformedOrders);
        setLastRefreshed(Date.now());
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
    
    const handleStorageChange = (e) => {
      if (e && e.key === 'jamcart_orders') {
        console.log("Storage change detected in orders, refreshing...");
        fetchUserOrders();
      } else {
        console.log("Generic storage event detected, refreshing orders...");
        fetchUserOrders();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    const intervalId = setInterval(() => {
      console.log("Automatic refresh interval triggered");
      fetchUserOrders();
    }, 10000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [user, navigate, fetchUserOrders]);
  
  useEffect(() => {
    const handleLocalUpdate = () => {
      console.log("Local update triggered, refreshing orders");
      fetchUserOrders();
    };
    
    window.addEventListener('order-status-change', handleLocalUpdate);
    
    return () => {
      window.removeEventListener('order-status-change', handleLocalUpdate);
    };
  }, [fetchUserOrders]);

  const handleOrderUpdate = useCallback(() => {
    console.log("OrdersHistoryPage: Order update detected, refreshing orders");
    fetchUserOrders();
    
    window.dispatchEvent(new Event('order-status-change'));
  }, [fetchUserOrders]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="app-container pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#e6e172]">My Orders</h1>
              <p className="text-sm text-white mt-1">
                Last updated: {new Date(lastRefreshed).toLocaleTimeString()}
              </p>
            </div>
            <button 
              onClick={forceRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 text-sm px-4 py-2 bg-[#20a64f] text-white rounded-md hover:bg-[#20a64f]/90 disabled:opacity-50 transition-all"
            >
              <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? "Refreshing..." : "Refresh Orders"}
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1 [&_button]:text-black [&_button:hover]:bg-[#0d9539] [&_button:hover]:text-white sticky top-24 max-h-[calc(100vh-8rem)] overflow-auto">
              <UserWallet onReload={forceRefresh} />
            </div>
            
            <div className="lg:col-span-1">
              <Card className="bg-black border-[#20a64f]/20">
                <CardHeader>
                  <CardTitle className="text-white">Order History</CardTitle>
                  <CardDescription className="text-white">View and track all your orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <UserOrdersList 
                    orders={userOrders} 
                    onOrderUpdate={handleOrderUpdate} 
                    key={`orders-list-${lastRefreshed}`} 
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersHistoryPage;
