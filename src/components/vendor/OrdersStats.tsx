
import { VendorStore } from '@/types/vendor.types';
import { Order } from '@/hooks/useUserOrdersState';
import { getVendorStats } from '@/services/vendor.service';
import { Card } from '@/components/ui/card';

interface OrdersStatsProps {
  store: VendorStore;
  allOrders: Order[];
}

const OrdersStats = ({ store, allOrders }: OrdersStatsProps) => {
  const stats = getVendorStats(store.id, allOrders);
  
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'JMD',
      minimumFractionDigits: 2,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#20a64f]/10 border-[#20a64f]/20 p-4">
          <h4 className="text-sm text-gray-400">Total Orders</h4>
          <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
        </Card>
        
        <Card className="bg-[#20a64f]/10 border-[#20a64f]/20 p-4">
          <h4 className="text-sm text-gray-400">Weekly Orders</h4>
          <p className="text-2xl font-bold text-white">{stats.weeklyOrders}</p>
        </Card>
        
        <Card className="bg-[#20a64f]/10 border-[#20a64f]/20 p-4">
          <h4 className="text-sm text-gray-400">Monthly Orders</h4>
          <p className="text-2xl font-bold text-white">{stats.monthlyOrders}</p>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#20a64f]/10 border-[#20a64f]/20 p-4">
          <h4 className="text-sm text-gray-400">Total Revenue</h4>
          <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
        </Card>
        
        <Card className="bg-[#20a64f]/10 border-[#20a64f]/20 p-4">
          <h4 className="text-sm text-gray-400">Weekly Revenue</h4>
          <p className="text-2xl font-bold text-white">{formatCurrency(stats.weeklyRevenue)}</p>
        </Card>
        
        <Card className="bg-[#20a64f]/10 border-[#20a64f]/20 p-4">
          <h4 className="text-sm text-gray-400">Commission Owed (This Week)</h4>
          <p className="text-2xl font-bold text-[#e6e172]">{formatCurrency(stats.commissionsOwed)}</p>
          <p className="text-xs text-gray-400">at {(store.commissionRate * 100).toFixed(1)}% commission rate</p>
        </Card>
      </div>
      
      <div className="bg-[#20a64f]/5 border border-[#20a64f]/20 rounded-md p-4">
        <h3 className="font-medium mb-3">Commission Information</h3>
        <p className="text-sm mb-2">
          JAMCart collects {(store.commissionRate * 100).toFixed(1)}% commission on all orders processed through your store. 
          Commissions are calculated weekly, and payments are processed every Monday.
        </p>
        <p className="text-sm">
          Total commissions paid to date: <span className="font-bold">{formatCurrency(stats.commissionsPaid)}</span>
        </p>
      </div>
      
      {stats.lastOrderDate && (
        <p className="text-sm text-gray-400">
          Last order received: {new Date(stats.lastOrderDate).toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default OrdersStats;
