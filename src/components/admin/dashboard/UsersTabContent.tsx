
import RecentUsers from "@/components/admin/dashboard/RecentUsers";
import UserRegistrationsChart from "@/components/admin/dashboard/UserRegistrationsChart";
import UserOverview from "@/components/admin/dashboard/UserOverview";
import QuickActions from "@/components/admin/dashboard/QuickActions";
import StatCard from "@/components/admin/dashboard/StatCard";

interface UsersTabContentProps {
  recentUsers: any[];
  userChartData: any[];
  userOverviewItems: any[];
  quickActions: any[];
  onQuickAction: (label: string) => void;
  userStats: any[];
}

const UsersTabContent = ({
  recentUsers,
  userChartData,
  userOverviewItems,
  quickActions,
  onQuickAction,
  userStats,
}: UsersTabContentProps) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {userStats.map((stat) => (
          <StatCard
            key={stat.id}
            id={stat.id}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            color={stat.color}
          />
        ))}
      </div>
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
