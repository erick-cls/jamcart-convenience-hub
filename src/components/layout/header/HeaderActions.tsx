
import { useAuth } from "@/context/AuthContext";
import UserMenuDropdown from "../UserMenuDropdown";
import AuthButtons from "../AuthButtons";

interface HeaderActionsProps {
  isScrolled: boolean;
  handleLogout: () => void;
  getUserInitials: () => string;
}

const HeaderActions = ({ isScrolled, handleLogout, getUserInitials }: HeaderActionsProps) => {
  const { user } = useAuth();

  return (
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
  );
};

export default HeaderActions;
