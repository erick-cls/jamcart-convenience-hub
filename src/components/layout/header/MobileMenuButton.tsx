
import { Menu, X } from "lucide-react";

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const MobileMenuButton = ({ isOpen, onClick }: MobileMenuButtonProps) => {
  return (
    <button
      className="md:hidden flex items-center transition-colors"
      onClick={onClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      {isOpen ? (
        <X className="h-6 w-6 text-black hover:text-[#009c3b] transition-colors" />
      ) : (
        <Menu className="h-6 w-6 text-white hover:text-[#009c3b] transition-colors" />
      )}
    </button>
  );
};

export default MobileMenuButton;
