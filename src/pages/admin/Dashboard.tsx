import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Users, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import StatCard from '@/components/admin/dashboard/StatCard';
import PendingOrdersCard from '@/components/admin/dashboard/PendingOrdersCard';
import OrdersChart from '@/components/admin/dashboard/OrdersChart';
import RecentOrdersCard from '@/components/admin/dashboard/RecentOrdersCard';
import RecentUsers from '@/components/admin/dashboard/RecentUsers';
import UserRegistrationsChart from '@/components/admin/dashboard/UserRegistrationsChart';
import UserOverview from '@/components/admin/dashboard/UserOverview';
import QuickActions from '@/components/admin/dashboard/QuickActions';
import { OrderStatus } from '@/components/ui/OrderItem';

type OrderItem = {
  id: string;
  storeName: string;
  category: string;
  date: string;
  status: OrderStatus;
  items: string[];
  total?: number;
};

const mockStats = [
  { id: 'orders', label: 'Total Orders', value: 124, icon: ShoppingBag, color: 'bg-jamcart-green' },
  { id: 'users', label: 'Registered Users', value: 532, icon: Users, color: 'bg-jamcart-green' },
  { id: 'revenue', label: 'Revenue (JMD)', value: '$15,480', icon: TrendingUp, color: 'bg-jamcart-yellow' },
  { id: 'today', label: 'Orders Today', value: 8, icon: Calendar, color: 'bg-jamcart-dark' },
];

const mockUserStats = [
  { id: 'total', label: 'Total Users', value: 532, icon: Users, color: 'bg-jamcart-green' },
  { id: 'new', label: 'New This Week', value: 48, icon: Users, color: 'bg-jamcart-green' },
  { id: 'active', label: 'Active Users', value: 326, icon: Users, color: 'bg-jamcart-yellow' },
  { id: 'verified', label: 'Verified Users', value: 498, icon: Users, color: 'bg-jamcart-dark' },
];

const mockRecentUsers = [
  { id: 'user-1', name: 'John Doe', email: 'john.doe@example.com', dateJoined: '2023-06-10T14:30:00', status: 'active', orders: 12 },
  { id: 'user-2', name: 'Jane Smith', email: 'jane.smith@example.com', dateJoined: '2023-06-09T10:15:00', status: 'active', orders: 8 },
  { id: 'user-3', name: 'Robert Johnson', email: 'robert.j@example.com', dateJoined: '2023-06-08T16:45:00', status: 'inactive', orders: 3 },
  { id: 'user-4', name: 'Maria Garcia', email: 'maria.g@example.com', dateJoined: '2023-06-07T09:30:00', status: 'active', orders: 5 },
  { id: 'user-5', name: 'David Williams', email: 'david.w@example.com', dateJoined: '2023-06-06T11:20:00', status: 'active', orders: 7 },
];

const mockChartData = [
  { name: 'Mon', orders: 4 },
  { name: 'Tue', orders: 3 },
  { name: 'Wed', orders: 7 },
  { name: 'Thu', orders: 5 },
  { name: 'Fri', orders: 8 },
  { name: 'Sat', orders: 12 },
  { name: 'Sun', orders: 6 },
];

const mockUserChartData = [
  { name: 'Mon', users: 7 },
  { name: 'Tue', users: 5 },
  { name: 'Wed', users: 12 },
  { name: 'Thu', users: 8 },
  { name: 'Fri', users: 10 },
  { name: 'Sat', users: 4 },
  { name: 'Sun', users: 2 },
];

const mockPendingOrders = [
  {
    id: 'order-123456',
    storeName: 'FreshMart Supermarket',
    category: 'Supermarket',
    date: '2023-06-10T14:30:00',
    status: 'pending' as OrderStatus,
    items: ['2 loaves of bread', '1 gallon of milk', '5 apples', 'Box of cereal']
  },
  {
    id: 'order-123457',
    storeName: 'Island Pharmacy',
    category: 'Pharmacy',
    date: '2023-06-10T15:45:00',
    status: 'pending' as OrderStatus,
    items: ['Paracetamol', 'Bandages', 'Antiseptic solution']
  }
];

const mockRecentOrders = [
  {
    id: 'order-123452',
    storeName: 'Quick Stop Mini Mart',
    category: 'Mini Mart',
    date: '2023-06-09T10:15:00',
    status: 'completed' as OrderStatus,
    items: ['Snacks', 'Soft drinks', 'Cigarettes'],
    total: 35.50
  },
  {
    id: 'order-123453',
    storeName: 'Island Flavors Restaurant',
    category: 'Restaurant',
    date: '2023-06-09T12:30:00',
    status: 'completed' as OrderStatus,
    items: ['Jerk chicken', 'Rice and peas', 'Festival'],
    total: 85.75
  },
  {
    id: 'order-123454',
    storeName: 'Hardware Express',
    category: 'Hardware',
    date: '2023-06-08T14:00:00',
    status: 'declined' as OrderStatus,
    items: ['Paint brushes', 'Screwdriver set', 'Light bulbs'],
    total: 42.20
  }
];

const mockUserOverviewItems = [
  { label: 'Verified Users', percentage: '94%', color: 'bg-jamcart-green' },
  { label: 'Active Users', percentage: '61%', color: 'bg-jamcart-green' },
  { label: 'Returning Users', percentage: '73%', color: 'bg-jamcart-yellow' },
  { label: 'Mobile Users', percentage: '85%', color: 'bg-jamcart-dark' },
];

const mockQuickActions = [
  { label: 'Export User Data', variant: 'outline' as const },
  { label: 'Send Mass Email', variant: 'outline' as const },
  { label: 'Manage User Permissions', variant: 'outline' as const, className: 'text-jamcart-dark border-jamcart-dark/10 hover:bg-jamcart-dark/5' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pendingOrders, setPendingOrders] = useState(mockPendingOrders);
  const [recentOrders, setRecentOrders] = useState(mockRecentOrders);
  const [stats, setStats] = useState(mockStats);
  const [chartData, setChartData] = useState(mockChartData);
  const [userStats, setUserStats] = useState(mockUserStats);
  const [recentUsers, setRecentUsers] = useState(mockRecentUsers);
  const [activeTab, setActiveTab] = useState('orders');
  
  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);
  
  const handleViewOrderDetails = (orderId: string) => {
    navigate(`/admin/orders/${orderId}`);
  };
  
  const handleAcceptOrder = (orderId: string) => {
    const updatedPendingOrders = pendingOrders.filter(order => order.id !== orderId);
    setPendingOrders(updatedPendingOrders);
    
    const acceptedOrder = pendingOrders.find(order => order.id === orderId);
    if (acceptedOrder) {
      const newOrder = { 
        ...acceptedOrder, 
        status: 'accepted' as OrderStatus,
        total: 0
      };
      setRecentOrders([newOrder, ...recentOrders]);
    }
    
    const updatedStats = [...stats];
    const todayOrdersStat = updatedStats.find(stat => stat.id === 'today');
    if (todayOrdersStat) {
      todayOrdersStat.value = (Number(todayOrdersStat.value) + 1);
    }
    setStats(updatedStats);
  };
  
  const handleDeclineOrder = (orderId: string) => {
    const updatedPendingOrders = pendingOrders.filter(order => order.id !== orderId);
    setPendingOrders(updatedPendingOrders);
    
    const declinedOrder = pendingOrders.find(order => order.id === orderId);
    if (declinedOrder) {
      const newOrder = { 
        ...declinedOrder, 
        status: 'declined' as OrderStatus,
        total: 0
      };
      setRecentOrders([newOrder, ...recentOrders]);
    }
  };
  
  return (
    <div className="py-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
            <p className="text-gray-600">Monitor orders, users, and business performance</p>
          </div>
          
          <div className="flex space-x-4 bg-white rounded-lg shadow-sm p-1 border border-gray-100">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'orders' 
                  ? 'bg-jamcart-green text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Orders
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'users' 
                  ? 'bg-jamcart-green text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Users
              </div>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {activeTab === 'orders' ? (
            stats.map((stat) => (
              <StatCard
                key={stat.id}
                id={stat.id}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                percentChange="+12%"
              />
            ))
          ) : (
            userStats.map((stat) => (
              <StatCard
                key={stat.id}
                id={stat.id}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                percentChange="+8%"
              />
            ))
          )}
        </div>
        
        {activeTab === 'orders' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PendingOrdersCard
                pendingOrders={pendingOrders}
                onViewDetails={handleViewOrderDetails}
                onAcceptOrder={handleAcceptOrder}
                onDeclineOrder={handleDeclineOrder}
              />
              
              <OrdersChart chartData={chartData} />
            </div>
            
            <div>
              <RecentOrdersCard
                recentOrders={recentOrders}
                onViewDetails={handleViewOrderDetails}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <RecentUsers users={recentUsers} />
              
              <UserRegistrationsChart chartData={mockUserChartData} />
            </div>
            
            <div>
              <UserOverview progressItems={mockUserOverviewItems} />
              
              <QuickActions actions={mockQuickActions} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
