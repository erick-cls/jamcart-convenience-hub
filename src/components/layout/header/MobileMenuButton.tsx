
import { Menu, X } from "lucide-react";

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const MobileMenuButton = ({ isOpen, onClick }: MobileMenuButtonProps) => {
  return (
    <button
      className="md:hidden flex items-center"
      onClick={onClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      {isOpen ? (
        <X className="h-6 w-6 text-gray-800" />
      ) : (
        <Menu className="h-6 w-6 text-gray-800" />
      )}
    </button>
  );
};

export default MobileMenuButton;
