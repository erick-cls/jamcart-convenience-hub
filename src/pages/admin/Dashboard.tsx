import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Users, TrendingUp, Calendar, ChevronRight, Star, X, Check } from 'lucide-react';
import ActionButton from '@/components/ui/ActionButton';
import { useAuth } from '@/context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import OrderItem from '@/components/ui/OrderItem';

// Define OrderStatus type to match OrderItem component requirements
type OrderStatus = 'pending' | 'completed' | 'accepted' | 'declined';

// Mock data for dashboard
const mockStats = [
  { id: 'orders', label: 'Total Orders', value: 124, icon: ShoppingBag, color: 'bg-blue-500' },
  { id: 'users', label: 'Registered Users', value: 532, icon: Users, color: 'bg-green-500' },
  { id: 'revenue', label: 'Revenue (JMD)', value: '$15,480', icon: TrendingUp, color: 'bg-purple-500' },
  { id: 'today', label: 'Orders Today', value: 8, icon: Calendar, color: 'bg-jamcart-red' },
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

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pendingOrders, setPendingOrders] = useState(mockPendingOrders);
  const [recentOrders, setRecentOrders] = useState(mockRecentOrders);
  const [stats, setStats] = useState(mockStats);
  const [chartData, setChartData] = useState(mockChartData);
  
  useEffect(() => {
    // Check if user is admin
    if (!user?.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);
  
  const handleViewOrderDetails = (orderId: string) => {
    navigate(`/admin/orders/${orderId}`);
  };
  
  const handleAcceptOrder = (orderId: string) => {
    // Update pending orders
    const updatedPendingOrders = pendingOrders.filter(order => order.id !== orderId);
    setPendingOrders(updatedPendingOrders);
    
    // Add to recent orders with accepted status
    const acceptedOrder = pendingOrders.find(order => order.id === orderId);
    if (acceptedOrder) {
      const newOrder = { 
        ...acceptedOrder, 
        status: 'accepted' as OrderStatus,
        total: 0 // Adding a default total value to satisfy the type requirement
      };
      setRecentOrders([newOrder, ...recentOrders]);
    }
    
    // Update stats
    const updatedStats = [...stats];
    const todayOrdersStat = updatedStats.find(stat => stat.id === 'today');
    if (todayOrdersStat) {
      todayOrdersStat.value = (Number(todayOrdersStat.value) + 1);
    }
    setStats(updatedStats);
  };
  
  const handleDeclineOrder = (orderId: string) => {
    // Update pending orders
    const updatedPendingOrders = pendingOrders.filter(order => order.id !== orderId);
    setPendingOrders(updatedPendingOrders);
    
    // Add to recent orders with declined status
    const declinedOrder = pendingOrders.find(order => order.id === orderId);
    if (declinedOrder) {
      const newOrder = { 
        ...declinedOrder, 
        status: 'declined' as OrderStatus,
        total: 0 // Adding a default total value to satisfy the type requirement
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
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <div className={`${stat.color} rounded-full p-3 text-white mr-4`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm">{stat.label}</h3>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-green-600 font-medium mr-1">+12%</span>
                <span className="text-gray-500">since last month</span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-semibold text-lg">Pending Orders</h2>
                <button
                  className="text-sm text-jamcart-red flex items-center"
                  onClick={() => navigate('/admin/orders?filter=pending')}
                >
                  View all
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="p-5">
                {pendingOrders.length > 0 ? (
                  <div className="space-y-4">
                    {pendingOrders.map((order) => (
                      <div key={order.id} className="bg-jamcart-yellow/5 border border-jamcart-yellow/20 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">Order #{order.id.slice(-6)}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(order.date).toLocaleString()}
                            </p>
                          </div>
                          <div className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-medium flex items-center">
                            <Star className="h-3 w-3 mr-1" />
                            Pending
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="text-sm">
                            <span className="font-medium">Store:</span>
                            <span className="ml-1 text-gray-700">{order.storeName}</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Category:</span>
                            <span className="ml-1 text-gray-700">{order.category}</span>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-1">Items:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {order.items.map((item, index) => (
                              <li key={index} className="flex items-center">
                                <span className="h-1.5 w-1.5 rounded-full bg-jamcart-red mr-2"></span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex gap-3">
                          <ActionButton
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleViewOrderDetails(order.id)}
                          >
                            View Details
                          </ActionButton>
                          <ActionButton
                            variant="ghost"
                            size="sm"
                            className="flex-1 text-red-600 border border-red-200 hover:bg-red-50"
                            onClick={() => handleDeclineOrder(order.id)}
                            icon={<X className="h-4 w-4" />}
                          >
                            Decline
                          </ActionButton>
                          <ActionButton
                            variant="ghost"
                            size="sm"
                            className="flex-1 text-green-600 border border-green-200 hover:bg-green-50"
                            onClick={() => handleAcceptOrder(order.id)}
                            icon={<Check className="h-4 w-4" />}
                          >
                            Accept
                          </ActionButton>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-gray-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No Pending Orders</h3>
                    <p className="text-gray-500">All orders have been processed.</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Order Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h2 className="font-semibold text-lg">Orders This Week</h2>
              </div>
              <div className="p-5">
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#e4173e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Orders */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-semibold text-lg">Recent Orders</h2>
                <button
                  className="text-sm text-jamcart-red flex items-center"
                  onClick={() => navigate('/admin/orders')}
                >
                  View all
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="p-5">
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <OrderItem
                      key={order.id}
                      id={order.id}
                      storeName={order.storeName}
                      category={order.category}
                      date={order.date}
                      status={order.status}
                      items={order.items}
                      total={order.total}
                      onViewDetails={handleViewOrderDetails}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
