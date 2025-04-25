
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 'mini-mart', name: 'Mini Mart', icon: '🏪' },
  { id: 'hardware', name: 'Hardware', icon: '🔨' },
  { id: 'supermarket', name: 'Supermarket', icon: '🛒' },
  { id: 'wholesale', name: 'Wholesale', icon: '📦' },
  { id: 'pharmacy', name: 'Pharmacy', icon: '💊' },
  { id: 'meat', name: 'Meat Market', icon: '🥩' },
  { id: 'water', name: 'Water Filtration', icon: '💧' },
  { id: 'restaurant', name: 'Restaurant', icon: '🍽️' },
  { id: 'fastfood', name: 'Fast Food', icon: '🍔' },
  { id: 'billpay', name: 'Bill Pay', icon: '📄' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const CategoriesSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="app-container">
        <div className="text-center mb-12">
          <span className="inline-block bg-jamcart-red/10 text-jamcart-red rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            Browse Categories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Explore Our Services</h2>
          <p className="text-[#1da751] max-w-2xl mx-auto">
            From groceries to bill payments, we've got all your convenience needs covered in one place.
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {categories.map((category) => (
            <motion.div 
              key={category.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/category/${category.id}`)}
              className="bg-white rounded-xl p-4 text-center cursor-pointer shadow-sm border border-gray-100 hover:border-jamcart-red/20 hover:shadow-md transition-all"
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <h3 className="font-medium text-gray-900">{category.name}</h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
