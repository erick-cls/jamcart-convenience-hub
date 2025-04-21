
import PendingOrdersCard from "@/components/admin/dashboard/PendingOrdersCard";
import OrdersChart from "@/components/admin/dashboard/OrdersChart";
import RecentOrdersCard from "@/components/admin/dashboard/RecentOrdersCard";

interface OrdersTabContentProps {
  pendingOrders: any[];
  recentOrders: any[];
  chartData: any[];
  onViewOrderDetails: (id: string) => void;
  onAcceptOrder: (id: string) => void;
  onDeclineOrder: (id: string) => void;
}

const OrdersTabContent = ({
  pendingOrders,
  recentOrders,
  chartData,
  onViewOrderDetails,
  onAcceptOrder,
  onDeclineOrder,
}: OrdersTabContentProps) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2">
      <PendingOrdersCard
        pendingOrders={pendingOrders}
        onViewDetails={onViewOrderDetails}
        onAcceptOrder={onAcceptOrder}
        onDeclineOrder={onDeclineOrder}
      />
      <OrdersChart chartData={chartData} />
    </div>
    <div>
      <RecentOrdersCard recentOrders={recentOrders} onViewDetails={onViewOrderDetails} />
    </div>
  </div>
);

export default OrdersTabContent;
