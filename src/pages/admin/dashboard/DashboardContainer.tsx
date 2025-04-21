
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader';
import StatCardsSection from '@/components/admin/dashboard/StatCardsSection';
import OrdersTabContent from '@/components/admin/dashboard/OrdersTabContent';
import UsersTabContent from '@/components/admin/dashboard/UsersTabContent';
import {
  mockStats,
  mockUserStats,
  mockRecentUsers,
  mockChartData,
  mockUserChartData,
  mockPendingOrders,
  mockRecentOrders,
  mockUserOverviewItems,
  mockQuickActions,
} from './dashboardMockData';

import { OrderStatus } from '@/components/ui/OrderItem';

const DashboardContainer = () => {
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

  const handleQuickAction = (actionLabel: string) => {
    if (actionLabel === 'Manage User Permissions') {
      navigate('/admin/users');
    }
  };

  return (
    <div className="py-6 px-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        <StatCardsSection stats={stats} userStats={userStats} activeTab={activeTab} />
        {activeTab === 'orders' ? (
          <OrdersTabContent
            pendingOrders={pendingOrders}
            recentOrders={recentOrders}
            chartData={chartData}
            onViewOrderDetails={handleViewOrderDetails}
            onAcceptOrder={handleAcceptOrder}
            onDeclineOrder={handleDeclineOrder}
          />
        ) : (
          <UsersTabContent
            recentUsers={recentUsers}
            userChartData={mockUserChartData}
            userOverviewItems={mockUserOverviewItems}
            quickActions={mockQuickActions}
            onQuickAction={handleQuickAction}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardContainer;
