
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Search, Filter, Download } from 'lucide-react';
import OrderItem, { OrderStatus } from '@/components/ui/OrderItem';
import ActionButton from '@/components/ui/ActionButton';
import { useAuth } from '@/context/AuthContext';

// Mock orders data
const mockOrders = [
  {
    id: 'order-123452',
    storeName: 'Quick Stop Mini Mart',
    category: 'Mini Mart',
    date: '2023-06-10T10:15:00',
    status: 'completed' as OrderStatus,
    items: ['Snacks', 'Soft drinks', 'Cigarettes'],
    total: 35.50
  },
  {
    id: 'order-123453',
    storeName: 'Island Flavors Restaurant',
    category: 'Restaurant',
    date: '2023-06-10T12:30:00',
    status: 'completed' as OrderStatus,
    items: ['Jerk chicken', 'Rice and peas', 'Festival'],
    total: 85.75
  },
  {
    id: 'order-123454',
    storeName: 'Hardware Express',
    category: 'Hardware',
    date: '2023-06-09T14:00:00',
    status: 'declined' as OrderStatus,
    items: ['Paint brushes', 'Screwdriver set', 'Light bulbs'],
    total: 42.20
  },
  {
    id: 'order-123455',
    storeName: 'Water Solutions',
    category: 'Water Filtration',
    date: '2023-06-09T15:30:00',
    status: 'cancelled' as OrderStatus,
    items: ['Water filter', 'Filter replacement', 'Installation service'],
    total: 120.00
  },
  {
    id: 'order-123456',
    storeName: 'FreshMart Supermarket',
    category: 'Supermarket',
    date: '2023-06-08T14:30:00',
    status: 'accepted' as OrderStatus,
    items: ['2 loaves of bread', '1 gallon of milk', '5 apples', 'Box of cereal'],
    total: 55.25
  },
  {
    id: 'order-123457',
    storeName: 'Island Pharmacy',
    category: 'Pharmacy',
    date: '2023-06-08T15:45:00',
    status: 'pending' as OrderStatus,
    items: ['Paracetamol', 'Bandages', 'Antiseptic solution'],
    total: 28.80
  },
  {
    id: 'order-123458',
    storeName: 'Corner Market',
    category: 'Mini Mart',
    date: '2023-06-07T11:20:00',
    status: 'accepted' as OrderStatus,
    items: ['Eggs', 'Bread', 'Milk', 'Sugar'],
    total: 32.15
  },
  {
    id: 'order-123459',
    storeName: 'Sea Breeze Dining',
    category: 'Restaurant',
    date: '2023-06-07T13:10:00',
    status: 'completed' as OrderStatus,
    items: ['Grilled fish', 'Steamed vegetables', 'Rice'],
    total: 95.50
  },
  {
    id: 'order-123460',
    storeName: 'Bills Express',
    category: 'Bill Pay',
    date: '2023-06-06T16:30:00',
    status: 'completed' as OrderStatus,
    items: ['Electricity bill', 'Water bill'],
    total: 150.00
  }
];

// Order status options
const statusOptions = [
  { label: 'All Orders', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Completed', value: 'completed' },
  { label: 'Declined', value: 'declined' },
  { label: 'Cancelled', value: 'cancelled' }
];

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'all';
  const [orders, setOrders] = useState(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState(mockOrders);
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // Check if user is admin
    if (!user?.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);
  
  useEffect(() => {
    let result = orders;
    
    // Apply status filter
    if (activeFilter !== 'all') {
      result = result.filter(order => order.status === activeFilter);
    }
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        order => 
          order.storeName.toLowerCase().includes(term) ||
          order.category.toLowerCase().includes(term) ||
          order.id.toLowerCase().includes(term)
      );
    }
    
    setFilteredOrders(result);
  }, [orders, activeFilter, searchTerm]);
  
  const handleViewOrderDetails = (orderId: string) => {
    navigate(`/admin/orders/${orderId}`);
  };
  
  const handleExportCSV = () => {
    // In a real app, this would generate and download a CSV file
    alert('Export functionality would be implemented here');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="app-container">
        <div className="flex items-center mb-8">
          <button
            className="p-2 rounded-full hover:bg-gray-200 mr-3"
            onClick={() => navigate('/admin/dashboard')}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold mb-1">Orders Management</h1>
            <p className="text-gray-600">View and manage all customer orders</p>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="p-5 flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search orders by store, category, or ID..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-jamcart-red/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="h-5 w-5" />
              </div>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 md:overflow-visible flex-nowrap">
              <div className="p-2 bg-gray-100 rounded-lg flex items-center text-gray-500 text-sm font-medium">
                <Filter className="h-4 w-4 mr-1" />
                <span>Filter:</span>
              </div>
              
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                    activeFilter === option.value
                      ? 'bg-jamcart-red text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveFilter(option.value)}
                >
                  {option.label}
                </button>
              ))}
              
              <ActionButton
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={handleExportCSV}
                icon={<Download className="h-4 w-4" />}
              >
                Export
              </ActionButton>
            </div>
          </div>
        </div>
        
        {/* Orders Grid */}
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <OrderItem
                key={order.id}
                id={order.id}
                storeName={order.storeName}
                category={order.category}
                date={order.date}
                status={order.status}
                items={order.items}
                total={order.total}
                onViewDetails={handleViewOrderDetails}
              />
            ))}
          </div>
        ) : (
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gray-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Orders Found</h2>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? `No orders matching "${searchTerm}" with the selected filter.`
                : `No ${activeFilter !== 'all' ? activeFilter : ''} orders found.`}
            </p>
            <div className="flex justify-center gap-4">
              <ActionButton
                variant="outline"
                size="md"
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilter('all');
                }}
              >
                Clear Filters
              </ActionButton>
              <ActionButton
                variant="primary"
                size="md"
                onClick={() => navigate('/admin/dashboard')}
              >
                Back to Dashboard
              </ActionButton>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Orders;
