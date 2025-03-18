
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from "@/lib/utils";

interface ActionButtonProps extends Omit<HTMLMotionProps<"button">, "className" | "disabled" | "onClick"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  disabled?: boolean;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}

const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ 
    children, 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    icon, 
    iconPosition = 'left',
    disabled,
    ...props 
  }, ref) => {
    const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jamcart-red disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-jamcart-red text-white hover:bg-jamcart-red/90 shadow-sm",
      secondary: "bg-jamcart-dark text-white hover:bg-jamcart-dark/90 shadow-sm",
      outline: "border border-jamcart-dark text-jamcart-dark hover:bg-jamcart-dark/5",
      ghost: "text-jamcart-dark hover:bg-jamcart-dark/5",
      link: "text-jamcart-red underline-offset-4 hover:underline p-0 h-auto"
    };
    
    const sizes = {
      sm: "text-xs px-3 py-1.5",
      md: "text-sm px-4 py-2",
      lg: "text-base px-6 py-3"
    };
    
    const isDisabled = disabled || loading;
    
    const buttonProps: any = {
      ref,
      className: cn(
        baseStyles,
        variants[variant],
        variant !== 'link' && sizes[size],
        className
      ),
      disabled: isDisabled,
      ...props
    };
    
    return (
      <motion.button
        {...buttonProps}
        whileTap={{ scale: isDisabled ? 1 : 0.98 }}
        whileHover={{ 
          scale: isDisabled ? 1 : 1.02,
          transition: { duration: 0.2 }
        }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        <span className={`flex items-center gap-2 ${loading ? 'opacity-0' : ''}`}>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </span>
      </motion.button>
    );
  }
);

ActionButton.displayName = 'ActionButton';

export default ActionButton;
