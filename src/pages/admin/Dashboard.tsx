
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardContainer from './dashboard/DashboardContainer';
import OrdersDashboard from './dashboard/OrdersDashboard';
import UsersDashboard from './dashboard/UsersDashboard';
import ComplaintsManagement from '@/components/admin/complaints/ComplaintsManagement';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');

  const handleNavigateToOrderDetails = (orderId: string) => {
    navigate(`/admin/orders?id=${orderId}`);
  };

  return (
    <AdminLayout>
      <DashboardContainer activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'orders' && (
          <OrdersDashboard onNavigateToOrderDetails={handleNavigateToOrderDetails} />
        )}
        {activeTab === 'users' && <UsersDashboard />}
        {activeTab === 'complaints' && <ComplaintsManagement />}
      </DashboardContainer>
    </AdminLayout>
  );
};

export default Dashboard;
