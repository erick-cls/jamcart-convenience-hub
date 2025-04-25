
import { Link } from "react-router-dom";
import AnimatedLogo from "../ui/AnimatedLogo";

const HeaderLogo = () => {
  return (
    <Link to="/" className="flex items-center">
      <AnimatedLogo size="sm" />
    </Link>
  );
};

export default HeaderLogo;
