
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, User, LogOut } from "lucide-react";
import AnimatedLogo from "../ui/AnimatedLogo";
import ActionButton from "../ui/ActionButton";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navigationItems = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "/categories" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "About", path: "/about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 shadow-sm backdrop-blur-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="app-container flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <AnimatedLogo size="sm" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-sm font-medium transition-colors relative ${
                location.pathname === item.path ? "text-jamcart-red" : "text-gray-800 hover:text-jamcart-red"
              }`}
            >
              {item.name}
              {location.pathname === item.path && (
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-jamcart-red"
                  layoutId="navbar-indicator"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/orders" className="text-gray-800 hover:text-jamcart-red">
                <ShoppingCart className="h-5 w-5" />
              </Link>
              <div className="relative group">
                <button className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <User className="h-5 w-5 text-gray-700" />
                </button>
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    Your Profile
                  </Link>
                  {user.isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link to="/auth?mode=login">
                <ActionButton variant="ghost" size="sm">
                  Sign In
                </ActionButton>
              </Link>
              <Link to="/auth?mode=register">
                <ActionButton variant="primary" size="sm">
                  Get Started
                </ActionButton>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-gray-800" />
          ) : (
            <Menu className="h-6 w-6 text-gray-800" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
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
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
