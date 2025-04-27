
import { Button } from '@/components/ui/button';
import { OrderStatus } from '@/pages/admin/orders/types';

interface ActionButtonProps {
  onClick: () => void;
  disabled: boolean;
  variant?: "default" | "destructive";
  children: React.ReactNode;
}

const ActionButton = ({ onClick, disabled, variant = "default", children }: ActionButtonProps) => (
  <Button 
    onClick={onClick} 
    className="w-full"
    disabled={disabled}
    variant={variant}
  >
    {children}
  </Button>
);

export default ActionButton;
