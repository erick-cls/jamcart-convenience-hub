
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader';
import StatCardsSection from '@/components/admin/dashboard/StatCardsSection';
import OrdersDashboard from './OrdersDashboard';
import UsersDashboard from './UsersDashboard';
import { mockStats, mockUserStats } from './dashboardMockData';

const DashboardContainer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');

  // State to hold stats for orders and users, for StatCardsSection usage
  const [stats, setStats] = useState(mockStats);
  const [userStats] = useState(mockUserStats);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleViewOrderDetails = (orderId: string) => {
    navigate(`/admin/orders/${orderId}`);
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
          <OrdersDashboard onNavigateToOrderDetails={handleViewOrderDetails} />
        ) : (
          <UsersDashboard onQuickAction={handleQuickAction} />
        )}
      </div>
    </div>
  );
};

export default DashboardContainer;
