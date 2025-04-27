
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardContainer from './dashboard/DashboardContainer';
import OrdersDashboard from './dashboard/OrdersDashboard';
import UsersDashboard from './dashboard/UsersDashboard';
import ComplaintsManagement from '@/components/admin/complaints/ComplaintsManagement';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('orders');

  const handleNavigateToOrderDetails = (orderId: string) => {
    navigate(`/admin/orders?id=${orderId}`);
  };
  
  const handleQuickAction = useCallback((actionLabel: string) => {
    switch (actionLabel) {
      case 'View All Users':
        navigate('/admin/users');
        break;
      case 'Add New User':
        toast({
          title: "Feature coming soon",
          description: "The ability to add new users directly will be available soon.",
        });
        break;
      case 'Export User Data':
        toast({
          title: "Exporting data",
          description: "User data export has been initiated.",
        });
        break;
      default:
        console.log(`Quick action: ${actionLabel}`);
        break;
    }
  }, [navigate, toast]);

  return (
    <AdminLayout>
      <DashboardContainer activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'orders' && (
          <OrdersDashboard onNavigateToOrderDetails={handleNavigateToOrderDetails} />
        )}
        {activeTab === 'users' && <UsersDashboard onQuickAction={handleQuickAction} />}
        {activeTab === 'complaints' && <ComplaintsManagement />}
      </DashboardContainer>
    </AdminLayout>
  );
};

export default Dashboard;
