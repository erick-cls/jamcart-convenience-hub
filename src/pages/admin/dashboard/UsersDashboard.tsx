
import { useState } from 'react';
import UsersTabContent from '@/components/admin/dashboard/UsersTabContent';
import {
  mockUserStats,
  mockRecentUsers,
  mockUserChartData,
  mockUserOverviewItems,
  mockQuickActions,
} from './dashboardMockData';

interface UsersDashboardProps {
  onQuickAction: (actionLabel: string) => void;
}

const UsersDashboard = ({ onQuickAction }: UsersDashboardProps) => {
  const [userStats] = useState(mockUserStats);
  const [recentUsers] = useState(mockRecentUsers);

  return (
    <UsersTabContent
      recentUsers={recentUsers}
      userChartData={mockUserChartData}
      userOverviewItems={mockUserOverviewItems}
      quickActions={mockQuickActions}
      onQuickAction={onQuickAction}
      userStats={userStats}
    />
  );
};

export default UsersDashboard;
