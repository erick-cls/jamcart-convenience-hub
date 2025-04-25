import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AnimatedLogo from '@/components/ui/AnimatedLogo';
import ActionButton from '@/components/ui/ActionButton';
import { ShoppingCart, PackageCheck, Clock, MapPin, StarIcon, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
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
  
  const handleGetStarted = () => {
    if (user) {
      navigate('/categories');
    } else {
      navigate('/auth?mode=register');
    }
  };
  
  return (
    <>
      <Header />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden bg-black">
          <div className="app-container relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center lg:text-left"
              >
                <span className="inline-block bg-jamcart-red/10 text-jamcart-red rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                  Convenience at your fingertips
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                  Your One-Stop <br className="hidden md:block" />
                  <span className="text-jamcart-red">Convenience Hub</span>
                </h1>
                <p className="text-lg text-white mb-8 max-w-lg mx-auto lg:mx-0">
                  Get groceries, food, pharmaceuticals, and more delivered right to your doorstep with a simple click.
                </p>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <ActionButton 
                    size="lg" 
                    onClick={handleGetStarted}
                    icon={<ArrowRight className="h-5 w-5" />}
                    iconPosition="right"
                  >
                    Get Started
                  </ActionButton>
                  <ActionButton 
                    variant="outline" 
                    size="lg" 
                    onClick={() => navigate('/how-it-works')}
                    className="border-white text-white hover:bg-[#1da751] hover:border-[#1da751]"
                  >
                    How It Works
                  </ActionButton>
                </div>
                
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div 
                        key={i} 
                        className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden"
                      >
                        <span className="text-xs font-bold text-gray-500">
                          {String.fromCharCode(64 + i)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <span className="text-white font-semibold">500+ people</span>
                    <span className="text-[#1da751] ml-1">already using JAMCart</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative mx-auto max-w-md lg:max-w-none"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-jamcart-red/20 to-jamcart-yellow/20 rounded-3xl transform rotate-3 scale-105"></div>
                  <div className="glass-card rounded-3xl p-6 relative">
                    <div className="flex justify-between items-center mb-6">
                      <AnimatedLogo size="md" />
                      <div className="flex items-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></span>
                        <span className="text-sm font-medium">Online</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Recent Order</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-jamcart-yellow/20 rounded-full p-2 mr-3">
                              <ShoppingCart className="h-4 w-4 text-jamcart-red" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Supermarket Order</p>
                              <p className="text-xs text-gray-500">15 mins ago</p>
                            </div>
                          </div>
                          <span className="text-sm font-semibold">$42.50</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <div className="bg-jamcart-green/20 rounded-full p-2 mr-3">
                            <PackageCheck className="h-4 w-4 text-jamcart-green" />
                          </div>
                          <p className="text-sm font-medium">Your order is on the way!</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-500 mr-1" />
                            <span className="text-xs text-gray-500">Arriving in 20-30 min</span>
                          </div>
                          <button className="text-xs text-jamcart-red font-medium">Track</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-jamcart-red to-jamcart-red/80 text-white rounded-xl p-4 mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">Special Offer</h3>
                        <span className="text-xs bg-white text-jamcart-red rounded-full px-2 py-0.5">Limited</span>
                      </div>
                      <p className="text-sm mb-3">Get 15% off your first 3 orders with code:</p>
                      <div className="bg-white/20 rounded-lg px-3 py-2 text-center mb-3">
                        <span className="font-mono font-bold tracking-wider">WELCOME15</span>
                      </div>
                      <button className="bg-white text-jamcart-red text-sm font-medium rounded-lg py-2 w-full">
                        Claim Offer
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-xs text-gray-500">Delivery to Kingston</span>
                      </div>
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-xs font-medium">4.9</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Categories Section */}
        <section className="py-16 bg-gray-50">
          <div className="app-container">
            <div className="text-center mb-12">
              <span className="inline-block bg-jamcart-red/10 text-jamcart-red rounded-full px-4 py-1.5 text-sm font-medium mb-4">
                Browse Categories
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Our Services</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
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
        
        {/* How It Works Section */}
        <section className="py-16">
          <div className="app-container">
            <div className="text-center mb-12">
              <span className="inline-block bg-jamcart-yellow/20 text-jamcart-dark rounded-full px-4 py-1.5 text-sm font-medium mb-4">
                Simple Process
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How JAMCart Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Getting what you need delivered is as easy as 1-2-3
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-jamcart-red/10 text-jamcart-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Create an Account</h3>
                <p className="text-gray-600">
                  Sign up with your name, address, and phone number for verification.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-jamcart-yellow/20 text-jamcart-dark rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">2. Select Categories</h3>
                <p className="text-gray-600">
                  Choose from our variety of categories and create your shopping list.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-jamcart-green/20 text-jamcart-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Enjoy Delivery</h3>
                <p className="text-gray-600">
                  Confirm your order and get your items delivered to your doorstep.
                </p>
              </motion.div>
            </div>
            
            <div className="text-center mt-12">
              <ActionButton 
                onClick={() => navigate('/how-it-works')}
                variant="outline"
                icon={<ArrowRight className="h-5 w-5" />}
                iconPosition="right"
              >
                Learn More
              </ActionButton>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-jamcart-red to-jamcart-red/80 text-white">
          <div className="app-container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready for Convenience?</h2>
              <p className="text-white/90 text-lg mb-8">
                Download the app now from the Apple App Store or Google Play Store and experience convenience like never before.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="#" className="bg-black rounded-xl px-6 py-3 flex items-center hover:bg-black/80 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div>
                    <div className="text-xs">Download on the</div>
                    <div className="font-semibold text-sm">App Store</div>
                  </div>
                </a>
                <a href="#" className="bg-black rounded-xl px-6 py-3 flex items-center hover:bg-black/80 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  <div>
                    <div className="text-xs">GET IT ON</div>
                    <div className="font-semibold text-sm">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default LandingPage;
