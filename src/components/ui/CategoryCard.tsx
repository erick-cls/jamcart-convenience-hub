
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color?: string;
}

const CategoryCard = ({ id, name, description, icon, color = 'bg-jamcart-green' }: CategoryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/category/${id}`);
  };
  
  return (
    <motion.div
      className="relative overflow-hidden h-full rounded-xl glass-card border border-gray-100 shadow-sm"
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 rounded-full opacity-10" style={{ background: color }}></div>
      
      <div className="p-6 h-full flex flex-col">
        <div className={`rounded-full w-12 h-12 flex items-center justify-center mb-4 text-white ${color}`}>
          {icon}
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-600 text-sm flex-grow">{description}</p>
        
        <motion.div 
          className="mt-4 text-jamcart-green font-medium text-sm flex items-center"
          animate={{
            x: isHovered ? 5 : 0
          }}
          transition={{ duration: 0.2 }}
        >
          View stores
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 ml-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
