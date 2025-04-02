
import { useEffect, useState } from 'react';
import { Bike, Clock, CheckCircle, CheckCheck, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const RiderDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pendingAssignments: 3,
    inProgressOrders: 2,
    completedOrders: 15,
    cancelledOrders: 1,
  });

  useEffect(() => {
    // In a real app, you would fetch stats from an API
    console.log('Fetching rider stats');
  }, []);

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold mb-1">Rider Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600">Welcome back, {user?.name}! Manage your deliveries here.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg flex items-center">
                <Clock className="mr-2 h-4 w-4 md:h-5 md:w-5 text-orange-500" />
                Pending
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">Orders waiting assignment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">{stats.pendingAssignments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg flex items-center">
                <Bike className="mr-2 h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                In Progress
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">Orders you're delivering</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">{stats.inProgressOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg flex items-center">
                <CheckCheck className="mr-2 h-4 w-4 md:h-5 md:w-5 text-jamcart-green" />
                Completed
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">Successfully delivered</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">{stats.completedOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg flex items-center">
                <XCircle className="mr-2 h-4 w-4 md:h-5 md:w-5 text-gray-500" />
                Cancelled
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">Cancelled orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">{stats.cancelledOrders}</div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 md:mb-8">
          <div className="p-4 md:p-5 border-b border-gray-100">
            <h2 className="font-semibold text-base md:text-lg">Quick Actions</h2>
          </div>
          <div className="p-4 md:p-5 space-y-3">
            <Button
              variant="default"
              className="w-full justify-start bg-jamcart-green hover:bg-jamcart-green/90"
              onClick={() => navigate('/rider/orders')}
            >
              View All Orders
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/rider/orders?status=pending')}
            >
              Check Pending Orders
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 md:p-5 border-b border-gray-100">
            <h2 className="font-semibold text-base md:text-lg">Today's Schedule</h2>
          </div>
          <div className="p-4 md:p-5">
            <div className="text-center py-6 md:py-8 text-gray-500 text-sm md:text-base">
              No deliveries scheduled for today yet.
              <br />
              Check back later or view all orders.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;
