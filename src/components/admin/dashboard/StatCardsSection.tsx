
import StatCard from "./StatCard";

interface StatCardsSectionProps {
  stats: any[];
  userStats: any[];
  activeTab: string;
}

const StatCardsSection = ({ stats, userStats, activeTab }: StatCardsSectionProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    {activeTab === 'orders'
      ? stats.map((stat) => (
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
      : userStats.map((stat) => (
          <StatCard
            key={stat.id}
            id={stat.id}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            percentChange="+8%"
          />
        ))}
  </div>
);

export default StatCardsSection;
