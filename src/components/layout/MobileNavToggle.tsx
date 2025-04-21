
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X } from "lucide-react";

interface MobileNavToggleProps {
  isOpen: boolean;
  toggle: () => void;
}

export function MobileNavToggle({ isOpen, toggle }: MobileNavToggleProps) {
  return (
    <div className="flex md:hidden items-center gap-2">
      <ThemeToggle />
      <Button
        variant="ghost"
        size="icon"
        className="text-gray-700 dark:text-gray-200"
        onClick={toggle}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
}
