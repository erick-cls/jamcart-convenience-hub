
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useMobileMenu } from "@/hooks/use-mobile-menu";
import { Logo } from "./Logo";
import { DesktopNav } from "./DesktopNav";
import { MobileNavToggle } from "./MobileNavToggle";
import { MobileMenu } from "./MobileMenu";

const Header = () => {
  const location = useLocation();
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
            <Logo />
          </div>
          {/* Desktop Navigation */}
          <DesktopNav />
          {/* Mobile Navigation Toggle + Theme Toggle */}
          <MobileNavToggle isOpen={isOpen} toggle={toggle} />
        </div>
      </div>
      {/* Mobile Menu */}
      <MobileMenu isOpen={isOpen} close={close} />
    </header>
  );
};

export default Header;
