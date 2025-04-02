
import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Bike, Home, LogOut, Package, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import AnimatedLogo from '@/components/ui/AnimatedLogo';

const RiderLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if not a rider or not logged in
    if (!user) {
      toast({
        title: "Access Denied",
        description: "You need to be logged in to access this area.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    if (!user.isRider) {
      toast({
        title: "Access Denied",
        description: "You need rider permissions to access this area.",
        variant: "destructive"
      });
      navigate('/auth');
    }
  }, [user, navigate, toast]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
    navigate('/auth');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header - only visible on small screens */}
      <div className="md:hidden bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <AnimatedLogo size="sm" />
          <span className="ml-2 text-jamcart-green font-semibold">Rider</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/')}
            className="px-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Site
          </Button>
        </div>
      </div>
      
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 hidden md:flex items-center">
          <AnimatedLogo size="sm" />
          <h1 className="ml-2 text-xl font-bold text-jamcart-green">Rider</h1>
        </div>
        
        <div className="py-4 flex-1">
          <nav className="px-2 space-y-1">
            <Button
              variant={location.pathname === '/rider/dashboard' ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => navigate('/rider/dashboard')}
            >
              <Home className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
            
            <Button
              variant={location.pathname === '/rider/orders' ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => navigate('/rider/orders')}
            >
              <Package className="mr-2 h-5 w-5" />
              Orders
            </Button>
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
                <Bike className="h-5 w-5 text-gray-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">Rider</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button 
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/')}
            >
              <ChevronLeft className="mr-2 h-5 w-5" />
              Back to Site
            </Button>
            
            <Button 
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default RiderLayout;
