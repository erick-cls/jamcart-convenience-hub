
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu, X, ShoppingCart, User, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMobileMenu } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isOpen, toggle, close } = useMobileMenu();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setHasScrolled(scrollTop > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    close();
  }, [location.pathname, close]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "/categories" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "About", path: "/about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        hasScrolled
          ? "bg-white dark:bg-gray-900 shadow-sm py-3"
          : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg py-4"
      }`}
    >
      <div className="app-container">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">JamCart</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Theme Toggle */}
            <div className="hidden md:flex items-center">
              <ThemeToggle />
            </div>

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
                          {user.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Link to="/profile">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <User className="mr-2 h-4 w-4" />
                          My Profile
                        </Button>
                      </Link>
                      <Link to="/orders">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
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

          {/* Mobile Navigation Toggle + Theme Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-700 dark:text-gray-200"
              onClick={toggle}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
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
    </header>
  );
};

export default Header;
