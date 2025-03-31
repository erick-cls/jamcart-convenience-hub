
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  id: string;
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  percentChange?: string;
  changeText?: string;
}

const StatCard = ({ id, label, value, icon: Icon, color, percentChange, changeText = 'since last month' }: StatCardProps) => {
  return (
    <motion.div
      key={id}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-4">
        <div className={`${color} rounded-full p-3 text-white mr-4`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-gray-500 text-sm">{label}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
      {percentChange && (
        <div className="flex items-center text-sm">
          <span className="text-green-600 font-medium mr-1">{percentChange}</span>
          <span className="text-gray-500">{changeText}</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
