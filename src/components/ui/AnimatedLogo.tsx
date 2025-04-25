
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AnimatedLogo = ({ size = 'md', className = '' }: AnimatedLogoProps) => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const sizeClasses = {
    sm: 'h-16', // Updated from h-8
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24'
  };
  
  const variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };
  
  const cartVariants = {
    initial: { x: -5 },
    animate: {
      x: 5,
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: 'reverse'
      }
    }
  };

  return (
    <motion.div 
      className={`relative ${sizeClasses[size]} ${className}`}
      initial="hidden"
      animate={loaded ? "visible" : "hidden"}
      variants={variants}
    >
      <img 
        src="/lovable-uploads/bbb87476-7ed9-4d8d-93b1-88461cada842.png" 
        alt="JAMCart Logo" 
        className={`${sizeClasses[size]} object-contain`}
      />
    </motion.div>
  );
};

export default AnimatedLogo;
