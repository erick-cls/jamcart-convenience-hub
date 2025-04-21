
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, User, LogOut } from "lucide-react";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Categories", path: "/categories" },
  { name: "How It Works", path: "/how-it-works" },
  { name: "About", path: "/about" },
];

export function DesktopNav() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <nav className="hidden md:flex items-center space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`text-sm font-medium transition-colors hover:text-primary ${
            location.pathname === item.path
              ? "text-primary"
              : "text-gray-700"
          }`}
        >
          {item.name}
        </Link>
      ))}

      {user ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[300px] sm:w-[400px]">
            <div className="py-6">
              <div className="flex items-center mb-6">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.name?.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="space-y-1">
                <Link to="/profile">
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </Button>
                </Link>
                <Link to="/orders">
                  <Button variant="ghost" className="w-full justify-start">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    My Orders
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <div className="hidden md:block">
          <Link to="/auth">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link to="/auth?tab=register">
            <Button>Sign up</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
