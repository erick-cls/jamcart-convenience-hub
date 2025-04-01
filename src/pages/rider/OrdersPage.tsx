
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { OrderStatus } from '@/components/ui/OrderItem';
import { useToast } from '@/hooks/use-toast';
import RiderOrdersList from '@/components/rider/RiderOrdersList';
import { Bike, CheckCircle, XCircle, FilterX } from 'lucide-react';

interface Order {
  id: string;
  storeName: string;
  category: string;
  date: string;
  status: OrderStatus;
  items: string[];
  total: number;
  assignedTo?: string;
}

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Completed', value: 'completed' },
  { label: 'Declined', value: 'declined' },
  { label: 'Cancelled', value: 'cancelled' },
];

// Mock orders data
const mockOrders: Order[] = [
  {
    id: 'order-1',
    storeName: 'Quick Stop Mini Mart',
    category: 'Mini Mart',
    date: '2023-06-15T14:30:00',
    status: 'accepted',
    items: ['Bread', 'Milk', 'Eggs'],
    total: 15.99,
    assignedTo: 'rider-123',
  },
  {
    id: 'order-2',
    storeName: 'FreshMart Supermarket',
    category: 'Supermarket',
    date: '2023-06-15T10:15:00',
    status: 'pending',
    items: ['Rice', 'Chicken', 'Vegetables'],
    total: 32.50,
  },
  {
    id: 'order-3',
    storeName: 'Island Pharmacy',
    category: 'Pharmacy',
    date: '2023-06-14T16:45:00',
    status: 'completed',
    items: ['Pain reliever', 'Band-aids', 'Vitamins'],
    total: 24.75,
    assignedTo: 'rider-123',
  },
  {
    id: 'order-4',
    storeName: 'Island Flavors Restaurant',
    category: 'Restaurant',
    date: '2023-06-14T12:30:00',
    status: 'pending',
    items: ['Jerk Chicken', 'Rice and Peas', 'Festival'],
    total: 28.99,
  },
  {
    id: 'order-5',
    storeName: 'Quick Stop Mini Mart',
    category: 'Mini Mart',
    date: '2023-06-13T15:20:00',
    status: 'declined',
    items: ['Chips', 'Soda', 'Candy'],
    total: 8.50,
  },
];

const RiderOrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const initialStatus = searchParams.get('status') || 'all';
  const [activeFilter, setActiveFilter] = useState<string>(initialStatus);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);
  
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === activeFilter));
    }
  }, [activeFilter, orders]);
  
  useEffect(() => {
    // Update URL when filter changes
    if (activeFilter === 'all') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', activeFilter);
    }
    setSearchParams(searchParams);
  }, [activeFilter, searchParams, setSearchParams]);
  
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      )
    );
    
    toast({
      title: "Order updated",
      description: `Order #${orderId.slice(-6)} status changed to ${newStatus}`,
    });
  };
  
  const handleSetFilter = (value: string) => {
    setActiveFilter(value);
  };
  
  const handleClearFilters = () => {
    setActiveFilter('all');
  };
  
  const handleTakeOrder = (orderId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'accepted', assignedTo: 'rider-123' } 
          : order
      )
    );
    
    toast({
      title: "Order accepted",
      description: `You've taken order #${orderId.slice(-6)}`,
    });
  };
  
  const handleCompleteOrder = (orderId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'completed' } 
          : order
      )
    );
    
    toast({
      title: "Order completed",
      description: `Order #${orderId.slice(-6)} has been marked as completed`,
    });
  };
  
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Orders</h1>
          <p className="text-gray-600">View and manage all customer orders</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(option => (
              <Button
                key={option.value}
                variant={activeFilter === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSetFilter(option.value)}
                className={activeFilter === option.value ? 'bg-jamcart-green hover:bg-jamcart-green/90' : ''}
              >
                {option.label}
              </Button>
            ))}
            
            {activeFilter !== 'all' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="ml-auto"
              >
                <FilterX className="h-4 w-4 mr-1" />
                Clear Filter
              </Button>
            )}
          </div>
        </div>
        
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-8 text-center">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                <XCircle className="h-6 w-6 text-gray-500" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">
              {activeFilter !== 'all' ? (
                `There are no orders with the "${activeFilter}" status.`
              ) : (
                "There are no orders available at this time."
              )}
            </p>
            {activeFilter !== 'all' && (
              <Button
                variant="outline"
                onClick={handleClearFilters}
              >
                View All Orders
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RiderOrdersPage;
