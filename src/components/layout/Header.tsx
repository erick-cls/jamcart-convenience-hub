
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

import HeaderLogo from "./HeaderLogo";
import MainNavigation from "./MainNavigation";
import UserMenuDropdown from "./UserMenuDropdown";
import AuthButtons from "./AuthButtons";
import MobileMenu from "./MobileMenu";

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

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black shadow-sm backdrop-blur-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="app-container flex items-center justify-between">
        <HeaderLogo />
        <MainNavigation isScrolled={isScrolled} />

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <UserMenuDropdown 
              user={user} 
              handleLogout={handleLogout} 
              getUserInitials={getUserInitials} 
            />
          ) : (
            <AuthButtons isScrolled={isScrolled} />
          )}
        </div>

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

      <AnimatePresence>
        {isOpen && (
          <MobileMenu 
            isOpen={isOpen} 
            navigationItems={navigationItems} 
            user={user} 
            handleLogout={handleLogout} 
          />
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
