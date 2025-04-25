
import { Link } from "react-router-dom";
import ActionButton from "../ui/ActionButton";

interface AuthButtonsProps {
  isScrolled: boolean;
}

const AuthButtons = ({ isScrolled }: AuthButtonsProps) => {
  return (
    <>
      <Link to="/auth?mode=login">
        <ActionButton 
          variant="ghost" 
          size="sm"
          className={`${
            isScrolled 
              ? "text-[#1da751] hover:text-white" 
              : "text-white hover:text-[#1da751]"
          }`}
        >
          Sign In
        </ActionButton>
      </Link>
      <Link to="/auth?mode=register">
        <ActionButton variant="primary" size="sm">
          Get Started
        </ActionButton>
      </Link>
    </>
  );
};

export default AuthButtons;
