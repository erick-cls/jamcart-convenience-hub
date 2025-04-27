import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { User, ShoppingCart, LogOut, Bike, Package } from "lucide-react";
import ActionButton from "../ui/ActionButton";
import { useEffect } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  navigationItems: Array<{ name: string; path: string }>;
  user: any;
  handleLogout: () => void;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, navigationItems, user, handleLogout, onClose }: MobileMenuProps) => {
  const location = useLocation();
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('fixed')) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      window.addEventListener('click', handleClickOutside);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      className="fixed inset-0 z-40 bg-white pt-20"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="app-container py-5 flex flex-col space-y-6">
        <nav className="flex flex-col space-y-5">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-lg font-medium transition-colors ${
                location.pathname === item.path ? "text-jamcart-red" : "text-gray-800"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-100 pt-5">
          {user ? (
            <div className="flex flex-col space-y-4">
              <Link
                to="/profile"
                className="flex items-center text-lg font-medium text-gray-800"
              >
                <User className="h-5 w-5 mr-3" />
                Your Profile
              </Link>
              <Link
                to="/orders"
                className="flex items-center text-lg font-medium text-gray-800"
              >
                <ShoppingCart className="h-5 w-5 mr-3" />
                Your Orders
              </Link>
              {user.isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center text-lg font-medium text-gray-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Admin Dashboard
                </Link>
              )}
              {user.isRider && (
                <>
                  <Link
                    to="/rider/dashboard"
                    className="flex items-center text-lg font-medium text-gray-800"
                  >
                    <Bike className="h-5 w-5 mr-3" />
                    Rider Dashboard
                  </Link>
                  <Link
                    to="/rider/orders"
                    className="flex items-center text-lg font-medium text-gray-800"
                  >
                    <Package className="h-5 w-5 mr-3" />
                    Rider Orders
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center text-lg font-medium text-jamcart-red"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-3">
              <Link to="/auth?mode=login">
                <ActionButton variant="outline" size="lg" className="w-full">
                  Sign In
                </ActionButton>
              </Link>
              <Link to="/auth?mode=register">
                <ActionButton variant="primary" size="lg" className="w-full">
                  Get Started
                </ActionButton>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MobileMenu;
