
import { useState } from 'react';
import OrdersTabContent from '@/components/admin/dashboard/OrdersTabContent';
import {
  mockStats,
  mockChartData,
  mockPendingOrders,
  mockRecentOrders,
} from './dashboardMockData';
import { OrderStatus } from '@/components/ui/OrderItem';

interface OrdersDashboardProps {
  onNavigateToOrderDetails: (orderId: string) => void;
}

const OrdersDashboard = ({ onNavigateToOrderDetails }: OrdersDashboardProps) => {
  const [pendingOrders, setPendingOrders] = useState(mockPendingOrders);
  const [recentOrders, setRecentOrders] = useState(mockRecentOrders);
  const [stats, setStats] = useState(mockStats);
  const [chartData] = useState(mockChartData);

  const handleViewOrderDetails = (orderId: string) => {
    onNavigateToOrderDetails(orderId);
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
    <OrdersTabContent
      pendingOrders={pendingOrders}
      recentOrders={recentOrders}
      chartData={chartData}
      onViewOrderDetails={handleViewOrderDetails}
      onAcceptOrder={handleAcceptOrder}
      onDeclineOrder={handleDeclineOrder}
    />
  );
};

export default OrdersDashboard;
