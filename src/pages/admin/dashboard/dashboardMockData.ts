
import { ShoppingBag, Users, TrendingUp, Calendar } from "lucide-react";
import { OrderStatus } from "@/components/ui/OrderItem";

export const mockStats = [
  { id: 'orders', label: 'Total Orders', value: 124, icon: ShoppingBag, color: 'bg-blue-500' },
  { id: 'users', label: 'Registered Users', value: 532, icon: Users, color: 'bg-green-500' },
  { id: 'revenue', label: 'Revenue (JMD)', value: '$15,480', icon: TrendingUp, color: 'bg-purple-500' },
  { id: 'today', label: 'Orders Today', value: 8, icon: Calendar, color: 'bg-jamcart-red' },
];

export const mockUserStats = [
  { id: 'total', label: 'Total Users', value: 532, icon: Users, color: 'bg-green-500' },
  { id: 'new', label: 'New This Week', value: 48, icon: Users, color: 'bg-blue-500' },
  { id: 'active', label: 'Active Users', value: 326, icon: Users, color: 'bg-purple-500' },
  { id: 'verified', label: 'Verified Users', value: 498, icon: Users, color: 'bg-jamcart-red' },
];

export const mockRecentUsers = [
  { id: 'user-1', name: 'John Doe', email: 'john.doe@example.com', dateJoined: '2023-06-10T14:30:00', status: 'active', orders: 12 },
  { id: 'user-2', name: 'Jane Smith', email: 'jane.smith@example.com', dateJoined: '2023-06-09T10:15:00', status: 'active', orders: 8 },
  { id: 'user-3', name: 'Robert Johnson', email: 'robert.j@example.com', dateJoined: '2023-06-08T16:45:00', status: 'inactive', orders: 3 },
  { id: 'user-4', name: 'Maria Garcia', email: 'maria.g@example.com', dateJoined: '2023-06-07T09:30:00', status: 'active', orders: 5 },
  { id: 'user-5', name: 'David Williams', email: 'david.w@example.com', dateJoined: '2023-06-06T11:20:00', status: 'active', orders: 7 },
];

export const mockChartData = [
  { name: 'Mon', orders: 4 },
  { name: 'Tue', orders: 3 },
  { name: 'Wed', orders: 7 },
  { name: 'Thu', orders: 5 },
  { name: 'Fri', orders: 8 },
  { name: 'Sat', orders: 12 },
  { name: 'Sun', orders: 6 },
];

export const mockUserChartData = [
  { name: 'Mon', users: 7 },
  { name: 'Tue', users: 5 },
  { name: 'Wed', users: 12 },
  { name: 'Thu', users: 8 },
  { name: 'Fri', users: 10 },
  { name: 'Sat', users: 4 },
  { name: 'Sun', users: 2 },
];

export const mockPendingOrders = [
  {
    id: 'order-123456',
    storeName: 'FreshMart Supermarket',
    category: 'Supermarket',
    date: '2023-06-10T14:30:00',
    status: 'pending' as OrderStatus,
    items: ['2 loaves of bread', '1 gallon of milk', '5 apples', 'Box of cereal']
  },
  {
    id: 'order-123457',
    storeName: 'Island Pharmacy',
    category: 'Pharmacy',
    date: '2023-06-10T15:45:00',
    status: 'pending' as OrderStatus,
    items: ['Paracetamol', 'Bandages', 'Antiseptic solution']
  }
];

export const mockRecentOrders = [
  {
    id: 'order-123452',
    storeName: 'Quick Stop Mini Mart',
    category: 'Mini Mart',
    date: '2023-06-09T10:15:00',
    status: 'completed' as OrderStatus,
    items: ['Snacks', 'Soft drinks', 'Cigarettes'],
    total: 35.50
  },
  {
    id: 'order-123453',
    storeName: 'Island Flavors Restaurant',
    category: 'Restaurant',
    date: '2023-06-09T12:30:00',
    status: 'completed' as OrderStatus,
    items: ['Jerk chicken', 'Rice and peas', 'Festival'],
    total: 85.75
  },
  {
    id: 'order-123454',
    storeName: 'Hardware Express',
    category: 'Hardware',
    date: '2023-06-08T14:00:00',
    status: 'declined' as OrderStatus,
    items: ['Paint brushes', 'Screwdriver set', 'Light bulbs'],
    total: 42.20
  }
];

export const mockUserOverviewItems = [
  { label: 'Verified Users', percentage: '94%', color: 'bg-green-500' },
  { label: 'Active Users', percentage: '61%', color: 'bg-blue-500' },
  { label: 'Returning Users', percentage: '73%', color: 'bg-purple-500' },
  { label: 'Mobile Users', percentage: '85%', color: 'bg-jamcart-red' },
];

export const mockQuickActions = [
  { label: 'Export User Data', variant: 'outline' as const },
  { label: 'Send Mass Email', variant: 'outline' as const },
  { label: 'Manage User Permissions', variant: 'outline' as const, className: 'text-red-600 border-red-100 hover:bg-red-50' },
];
