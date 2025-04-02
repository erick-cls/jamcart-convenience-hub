
import { useEffect } from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Bell,
} from 'lucide-react';
import AnimatedLogo from '@/components/ui/AnimatedLogo';
import { Badge } from '@/components/ui/badge';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen bg-gray-50">
        <Sidebar>
          <SidebarHeader className="flex items-center justify-between">
            <div className="flex items-center">
              <AnimatedLogo size="sm" />
              <div className="ml-2 flex items-center">
                <span className="font-semibold text-sm mr-1">JAMCart</span>
                <span className="text-xs bg-jamcart-green px-2 py-0.5 rounded text-white">Admin</span>
              </div>
            </div>
            <SidebarTrigger />
          </SidebarHeader>
          
          <SidebarContent className="space-y-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate('/admin/dashboard')}
                  isActive={window.location.pathname === '/admin/dashboard'}
                  tooltip="Dashboard"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                  <Badge className="ml-auto bg-blue-500 py-0 px-1.5 text-[10px]">2 new</Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate('/admin/orders')}
                  isActive={window.location.pathname.includes('/admin/orders')}
                  tooltip="Orders"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Orders</span>
                  <Badge className="ml-auto bg-jamcart-red py-0 px-1.5 text-[10px]">New</Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate('/admin/users')}
                  isActive={window.location.pathname.includes('/admin/users')}
                  tooltip="Users"
                >
                  <Users className="h-4 w-4" />
                  <span>Users</span>
                  <Badge className="ml-auto bg-blue-500 py-0 px-1.5 text-[10px]">2 new</Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate('/admin/settings')}
                  isActive={window.location.pathname === '/admin/settings'}
                  tooltip="Settings"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleLogout}
                  tooltip="Logout"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate('/')}
                  tooltip="Back to site"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back to Site</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
