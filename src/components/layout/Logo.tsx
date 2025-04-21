
import { Link } from "react-router-dom";
import AnimatedLogo from "@/components/ui/AnimatedLogo";

export function Logo() {
  return (
    <Link to="/" className="flex items-center">
      <AnimatedLogo size="sm" />
    </Link>
  );
}
