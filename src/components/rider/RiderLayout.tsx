
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Bike, Home, LogOut, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const RiderLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not a rider or not logged in
    if (!user || !user.isRider) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (!user || !user.isRider) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-jamcart-green">JamCart Rider</h1>
        </div>
        
        <div className="py-4 flex-1">
          <nav className="px-2 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate('/rider/dashboard')}
            >
              <Home className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
            
            <Button
              variant="ghost"
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
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default RiderLayout;
