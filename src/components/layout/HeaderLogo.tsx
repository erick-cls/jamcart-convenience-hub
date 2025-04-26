
import { Link, useLocation } from "react-router-dom";
import AnimatedLogo from "../ui/AnimatedLogo";

const HeaderLogo = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <Link to="/" className="flex items-center">
      <AnimatedLogo size={isAuthPage ? "xl" : "sm"} />
    </Link>
  );
};

export default HeaderLogo;
