
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Categories", path: "/categories" },
  { name: "How It Works", path: "/how-it-works" },
  { name: "About", path: "/about" },
];

interface MobileMenuProps {
  isOpen: boolean;
  close: () => void;
}

export function MobileMenu({ isOpen, close }: MobileMenuProps) {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800 overflow-hidden"
        >
          <div className="app-container py-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === item.path
                      ? "text-primary"
                      : "text-gray-700 dark:text-gray-200"
                  }`}
                  onClick={close}
                >
                  {item.name}
                </Link>
              ))}

              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary"
                    onClick={close}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary"
                    onClick={close}
                  >
                    Orders
                  </Link>
                  <button
                    className="text-sm font-medium text-red-500 hover:text-red-600 text-left"
                    onClick={() => {
                      logout();
                      close();
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="pt-2 flex flex-col space-y-2">
                  <Link to="/auth" onClick={close}>
                    <Button variant="outline" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/auth?tab=register" onClick={close}>
                    <Button className="w-full">Sign up</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
