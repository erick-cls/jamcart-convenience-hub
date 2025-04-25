
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

type NavigationItem = {
  name: string;
  path: string;
};

interface MainNavigationProps {
  isScrolled: boolean;
}

const navigationItems: NavigationItem[] = [
  { name: "Home", path: "/" },
  { name: "Categories", path: "/categories" },
  { name: "How It Works", path: "/how-it-works" },
  { name: "About", path: "/about" },
];

const MainNavigation = ({ isScrolled }: MainNavigationProps) => {
  const location = useLocation();
  
  return (
    <nav className="hidden md:flex items-center space-x-8">
      {navigationItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className={`text-sm font-medium transition-colors relative ${
            location.pathname === item.path 
              ? "text-[#1da751]" 
              : isScrolled 
                ? "text-white hover:text-[#1da751]"
                : "text-white hover:text-[#1da751]"
          }`}
        >
          {item.name}
          {location.pathname === item.path && (
            <motion.div
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#1da751]"
              layoutId="navbar-indicator"
              transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
            />
          )}
        </Link>
      ))}
    </nav>
  );
};

export default MainNavigation;
