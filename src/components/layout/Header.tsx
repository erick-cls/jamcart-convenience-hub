
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

import HeaderLogo from "./HeaderLogo";
import MainNavigation from "./MainNavigation";
import MobileMenu from "./MobileMenu";
import HeaderContainer from "./header/HeaderContainer";
import MobileMenuButton from "./header/MobileMenuButton";
import HeaderActions from "./header/HeaderActions";
import { useHeaderScroll } from "./header/useHeaderScroll";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isScrolled = useHeaderScroll();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const navigationItems = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "/categories" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "About", path: "/about" },
  ];

  return (
    <HeaderContainer>
      <HeaderLogo />
      <MainNavigation isScrolled={isScrolled} />
      <HeaderActions 
        isScrolled={isScrolled}
        handleLogout={handleLogout}
        getUserInitials={getUserInitials}
      />
      <MobileMenuButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      <AnimatePresence>
        {isOpen && (
          <MobileMenu 
            isOpen={isOpen} 
            navigationItems={navigationItems} 
            user={user} 
            handleLogout={handleLogout}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </HeaderContainer>
  );
};

export default Header;
