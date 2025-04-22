
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import UserOrdersList from '@/components/user/UserOrdersList';
import { useOrdersState, Order } from '@/pages/admin/orders/useOrdersState';

const OrdersHistoryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getUserOrders } = useOrdersState();
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/auth?mode=login');
      return;
    }
    
    // Get orders for the current user and set state
    const fetchUserOrders = () => {
      const orders = getUserOrders(user.id);
      setUserOrders(orders);
      console.log("User orders fetched:", orders, "for user:", user.id);
    };
    
    fetchUserOrders();
    
    // Add an event listener for storage changes to refresh orders when updated
    const handleStorageChange = () => {
      fetchUserOrders();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Set up periodic refresh every 30 seconds
    const refreshInterval = setInterval(fetchUserOrders, 30000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(refreshInterval);
    };
  }, [user, navigate, getUserOrders]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="app-container pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>View and track all your orders</CardDescription>
            </CardHeader>
            <CardContent>
              <UserOrdersList orders={userOrders} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrdersHistoryPage;
