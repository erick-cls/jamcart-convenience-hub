
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bike, Package } from 'lucide-react';

const ThankYouAnimation = () => {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Jamaican flag colors
  const jamaicaGreen = "#009B3A";
  const jamaicaYellow = "#FED100";
  const jamaicaBlack = "#000000";

  return (
    <div className="h-60 w-full relative overflow-hidden">
      {/* Road */}
      <div className="absolute bottom-0 w-full h-10 bg-gray-700"></div>
      
      {/* Bike rider animation */}
      <motion.div
        initial={{ x: -100 }}
        animate={{ x: animationComplete ? "105%" : "40%" }}
        transition={{ 
          duration: animationComplete ? 2 : 1.5, 
          ease: "easeInOut",
          delay: 0.5
        }}
        className="absolute bottom-10"
      >
        <div className="relative">
          {/* Rider body */}
          <motion.div
            className="absolute -top-14 left-0 w-10 h-10 rounded-full bg-brown-700"
            animate={{ y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          >
            {/* Jamaican flag colors on helmet */}
            <div className="absolute top-0 w-full h-2 bg-black"></div>
            <div className="absolute top-2 w-full h-2 bg-yellow-400"></div>
            <div className="absolute top-4 w-full h-2 bg-green-600"></div>
          </motion.div>
          
          {/* Bike */}
          <motion.div
            animate={{ 
              rotate: [0, 1, 0, -1, 0],
              y: [0, -1, 0, -1, 0]
            }}
            transition={{ repeat: Infinity, duration: 0.3 }}
          >
            <Bike size={40} color={jamaicaBlack} className="text-black" />
          </motion.div>
          
          {/* Package */}
          <motion.div
            className="absolute -top-10 left-3"
            animate={{ 
              y: [0, -1, 0, -1, 0],
              rotate: [0, 2, 0, -2, 0]
            }}
            transition={{ repeat: Infinity, duration: 0.3, delay: 0.15 }}
          >
            <Package size={16} color={jamaicaGreen} />
          </motion.div>
        </div>
      </motion.div>

      {/* Dust animation */}
      {!animationComplete && (
        <motion.div 
          className="absolute bottom-8 left-[42%]"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
          transition={{ repeat: Infinity, duration: 0.5, delay: 0.25 }}
        >
          <div className="h-2 w-2 rounded-full bg-gray-300"></div>
        </motion.div>
      )}
      
      {/* Jamaican flag colors banner */}
      <div className="absolute top-4 w-full flex justify-center">
        <div className="flex space-x-1">
          <motion.div 
            className="h-3 w-16" 
            style={{ backgroundColor: jamaicaGreen }}
            animate={{ scaleX: [0, 1] }}
            transition={{ duration: 0.5, delay: 0.2 }}
          ></motion.div>
          <motion.div 
            className="h-3 w-16 rotate-45" 
            style={{ backgroundColor: jamaicaYellow }}
            animate={{ scaleX: [0, 1] }}
            transition={{ duration: 0.5, delay: 0.4 }}
          ></motion.div>
          <motion.div 
            className="h-3 w-16" 
            style={{ backgroundColor: jamaicaBlack }}
            animate={{ scaleX: [0, 1] }}
            transition={{ duration: 0.5, delay: 0.6 }}
          ></motion.div>
          <motion.div 
            className="h-3 w-16 -rotate-45" 
            style={{ backgroundColor: jamaicaYellow }}
            animate={{ scaleX: [0, 1] }}
            transition={{ duration: 0.5, delay: 0.8 }}
          ></motion.div>
          <motion.div 
            className="h-3 w-16" 
            style={{ backgroundColor: jamaicaGreen }}
            animate={{ scaleX: [0, 1] }}
            transition={{ duration: 0.5, delay: 1 }}
          ></motion.div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouAnimation;
