
import RecentUsers from "@/components/admin/dashboard/RecentUsers";
import UserRegistrationsChart from "@/components/admin/dashboard/UserRegistrationsChart";
import UserOverview from "@/components/admin/dashboard/UserOverview";
import QuickActions from "@/components/admin/dashboard/QuickActions";
import RidersManagement from "@/components/admin/dashboard/RidersManagement";

interface UsersTabContentProps {
  recentUsers: any[];
  userChartData: any[];
  userOverviewItems: any[];
  quickActions: any[];
  onQuickAction: (label: string) => void;
  userStats: any[]; // Added the missing userStats prop
}

const UsersTabContent = ({
  recentUsers,
  userChartData,
  userOverviewItems,
  quickActions,
  onQuickAction,
  userStats, // Added to the destructuring
}: UsersTabContentProps) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2">
      <RidersManagement />
      <RecentUsers users={recentUsers} />
      <UserRegistrationsChart chartData={userChartData} />
    </div>
    <div>
      <UserOverview progressItems={userOverviewItems} />
      <QuickActions actions={quickActions} onActionClick={onQuickAction} />
    </div>
  </div>
);

export default UsersTabContent;
