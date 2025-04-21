
import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link to="/" className="flex items-center">
      <span className="text-2xl font-bold text-primary">JamCart</span>
    </Link>
  );
}
