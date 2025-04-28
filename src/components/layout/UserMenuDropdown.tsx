
import { Link } from "react-router-dom";
import { ShoppingCart, LogOut, Bike, Package, Store } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserMenuDropdownProps {
  user: any;
  handleLogout: () => void;
  getUserInitials: () => string;
}

const UserMenuDropdown = ({ user, handleLogout, getUserInitials }: UserMenuDropdownProps) => {
  return (
    <div className="flex items-center space-x-4">
      <Link to="/orders" className="text-gray-800 hover:text-jamcart-red">
        <ShoppingCart className="h-5 w-5" color="#fced87" />
      </Link>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none">
            <Avatar className="h-8 w-8">
              {user.storeImage ? (
                <AvatarImage src={user.storeImage} alt={user.name} />
              ) : null}
              <AvatarFallback className="bg-jamcart-red text-white text-xs">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profile" className="cursor-pointer">
              Your Profile
            </Link>
          </DropdownMenuItem>
          {user.isAdmin && (
            <DropdownMenuItem asChild>
              <Link to="/admin/dashboard" className="cursor-pointer">
                Admin Dashboard
              </Link>
            </DropdownMenuItem>
          )}
          {user.userType === 'vendor' && (
            <DropdownMenuItem asChild>
              <Link to="/vendor/dashboard" className="cursor-pointer">
                <Store className="mr-2 h-4 w-4" />
                Vendor Dashboard
              </Link>
            </DropdownMenuItem>
          )}
          {user.isRider && (
            <>
              <DropdownMenuItem asChild>
                <Link to="/rider/dashboard" className="cursor-pointer">
                  <Bike className="mr-2 h-4 w-4" />
                  Rider Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/rider/orders" className="cursor-pointer">
                  <Package className="mr-2 h-4 w-4" />
                  Rider Orders
                </Link>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenuDropdown;
