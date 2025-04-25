
import { ReactNode } from "react";
import { useHeaderScroll } from "./useHeaderScroll";

interface HeaderContainerProps {
  children: ReactNode;
}

const HeaderContainer = ({ children }: HeaderContainerProps) => {
  const isScrolled = useHeaderScroll();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black shadow-sm backdrop-blur-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="app-container flex items-center justify-between">
        {children}
      </div>
    </header>
  );
};

export default HeaderContainer;
