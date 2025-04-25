
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { OrderStatus } from '@/components/ui/OrderItem';
import { useToast } from '@/hooks/use-toast';
import RiderOrdersList from '@/components/rider/RiderOrdersList';
import OrderFilterButtons from '@/components/rider/orders/OrderFilterButtons';
import EmptyOrdersState from '@/components/rider/orders/EmptyOrdersState';
import { useRiderOrders } from '@/hooks/useRiderOrders';

const OrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  
  const initialStatus = searchParams.get('status') || 'all';
  const [activeFilter, setActiveFilter] = useState<string>(initialStatus);
  
  const { 
    filteredOrders, 
    loading, 
    updateOrderStatus 
  } = useRiderOrders(activeFilter);
  
  const handleSetFilter = (value: string) => {
    setActiveFilter(value);
    if (value === 'all') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', value);
    }
    setSearchParams(searchParams);
  };
  
  const handleClearFilters = () => {
    setActiveFilter('all');
    searchParams.delete('status');
    setSearchParams(searchParams);
  };
  
  const handleTakeOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'accepted');
    toast({
      title: "Order accepted",
      description: `You've taken order #${orderId.slice(-6)}`,
    });
  };
  
  const handleCompleteOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'completed');
    toast({
      title: "Order completed",
      description: `Order #${orderId.slice(-6)} has been marked as completed`,
    });
  };
  
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    toast({
      title: "Order updated",
      description: `Order #${orderId.slice(-6)} status changed to ${newStatus}`,
    });
  };
  
  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold mb-1">Orders</h1>
          <p className="text-sm md:text-base text-gray-600">View and manage all customer orders</p>
        </div>
        
        <OrderFilterButtons
          activeFilter={activeFilter}
          onFilterChange={handleSetFilter}
          onClearFilters={handleClearFilters}
        />
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-jamcart-green border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <RiderOrdersList 
            orders={filteredOrders}
            onStatusChange={handleStatusChange}
            onTakeOrder={handleTakeOrder}
            onCompleteOrder={handleCompleteOrder}
          />
        ) : (
          <EmptyOrdersState 
            activeFilter={activeFilter} 
            onClearFilters={handleClearFilters} 
          />
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
