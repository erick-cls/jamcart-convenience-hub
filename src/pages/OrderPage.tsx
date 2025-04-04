import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Send, X, Star, Clock, MapPin, ShoppingBag, Clipboard } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ActionButton from '@/components/ui/ActionButton';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const categories = {
  'mini-mart': {
    name: 'Mini Mart',
    description: 'Convenience stores for your everyday needs',
    icon: '🏪'
  },
  'hardware': {
    name: 'Hardware Store',
    description: 'Tools and building materials',
    icon: '🔨'
  },
  'supermarket': {
    name: 'Supermarket',
    description: 'Groceries and household items',
    icon: '🛒'
  },
  'wholesale': {
    name: 'Wholesale',
    description: 'Bulk purchases at discounted prices',
    icon: '📦'
  },
  'pharmacy': {
    name: 'Pharmacy',
    description: 'Medicines and health products',
    icon: '💊'
  },
  'meat': {
    name: 'Meat Market',
    description: 'Fresh meat and poultry',
    icon: '🥩'
  },
  'water': {
    name: 'Water Filtration',
    description: 'Water purification and delivery',
    icon: '💧'
  },
  'restaurant': {
    name: 'Restaurant',
    description: 'Dine-in and takeout meals',
    icon: '🍽️'
  },
  'fastfood': {
    name: 'Fast Food',
    description: 'Quick and convenient meals',
    icon: '🍔'
  },
  'billpay': {
    name: 'Bill Pay',
    description: 'Pay your bills hassle-free',
    icon: '📄'
  }
};

const mockStores: { [key: string]: any } = {
  'store-1': {
    id: 'store-1',
    name: 'Quick Stop Mini Mart',
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    rating: 4.5,
    distance: '1.2 km',
    estimatedTime: '15-20 min',
    address: '123 Main St, Kingston',
    category: 'mini-mart'
  },
  'store-4': {
    id: 'store-4',
    name: 'FreshMart Supermarket',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    distance: '2.3 km',
    estimatedTime: '20-30 min',
    address: '500 Market Blvd, Kingston',
    category: 'supermarket'
  },
  'store-6': {
    id: 'store-6',
    name: 'Island Pharmacy',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    distance: '1.7 km',
    estimatedTime: '15-25 min',
    address: '33 Health Rd, Kingston',
    category: 'pharmacy'
  },
  'store-8': {
    id: 'store-8',
    name: 'Island Flavors Restaurant',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    distance: '1.9 km',
    estimatedTime: '20-30 min',
    address: '55 Food St, Kingston',
    category: 'restaurant'
  }
};

Object.keys(categories).forEach(categoryId => {
  const storeId = `store-${categoryId}-1`;
  if (!mockStores[storeId]) {
    mockStores[storeId] = {
      id: storeId,
      name: `${categories[categoryId as keyof typeof categories].name} Store`,
      image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
      rating: 4.5,
      distance: '1.2 km',
      estimatedTime: '15-20 min',
      address: '123 Main St, Kingston',
      category: categoryId
    };
  }
});

const OrderPage = () => {
  const { categoryId, storeId } = useParams<{ categoryId: string; storeId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [store, setStore] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [orderText, setOrderText] = useState(
    "• Be specific with brands and quantities\n• Mention alternatives if possible\n• Add any special instructions"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (!categoryId || !storeId || !Object.keys(categories).includes(categoryId)) {
      navigate('/categories');
      return;
    }
    
    const selectedStore = mockStores[storeId];
    if (!selectedStore) {
      navigate(`/category/${categoryId}`);
      return;
    }
    
    setStore(selectedStore);
    setCategory(categories[categoryId as keyof typeof categories]);
  }, [categoryId, storeId, navigate]);
  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);
  
  if (!store || !category) return null;
  
  const handleSubmitOrder = () => {
    if (!orderText.trim()) {
      toast({
        title: "Empty order",
        description: "Please add items to your shopping list.",
        variant: "destructive",
      });
      return;
    }
    
    setIsReviewOpen(true);
  };
  
  const handleConfirmOrder = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Order submitted successfully!",
        description: "Your order has been sent to the admin for approval.",
      });
      navigate('/orders');
      setIsSubmitting(false);
    }, 1500);
  };
  
  const handleCancelReview = () => {
    setIsReviewOpen(false);
  };
  
  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 pb-10">
        <div className="app-container">
          <div className="flex items-center mb-6">
            <button
              className="p-2 rounded-full hover:bg-gray-200 mr-3"
              onClick={() => navigate(`/category/${categoryId}`)}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{store?.name}</h1>
              <p className="text-gray-600 flex items-center">
                <span className="mr-2">{category?.icon}</span>
                {category?.name}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="order-2 lg:order-1 lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-6">
                  <img 
                    src={store.image} 
                    alt={store.name} 
                    className="w-full h-48 object-cover"
                  />
                  
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
                      <span className="ml-1 font-medium">{store.rating}</span>
                      <span className="mx-1 text-gray-400">•</span>
                      <span className="text-gray-600 text-sm">100+ ratings</span>
                    </div>
                    
                    <div className="flex items-start mb-3">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                      <div>
                        <p className="text-gray-700">{store.address}</p>
                        <p className="text-gray-500 text-sm">{store.distance} away</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 mr-2" />
                      <div>
                        <p className="text-gray-700">Estimated delivery time</p>
                        <p className="text-gray-500 text-sm">{store.estimatedTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <h3 className="font-semibold mb-3">Need help?</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    You can add your shopping list in the notepad. Be specific with brands, quantities, and sizes when possible.
                  </p>
                  <div className="bg-jamcart-red/10 rounded-lg p-3">
                    <h4 className="font-medium text-jamcart-red mb-1">Tips for faster service</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li className="flex items-start">
                        <span className="h-1.5 w-1.5 rounded-full bg-jamcart-red mt-1.5 mr-2"></span>
                        Be specific with brands and quantities
                      </li>
                      <li className="flex items-start">
                        <span className="h-1.5 w-1.5 rounded-full bg-jamcart-red mt-1.5 mr-2"></span>
                        Mention alternatives if possible
                      </li>
                      <li className="flex items-start">
                        <span className="h-1.5 w-1.5 rounded-full bg-jamcart-red mt-1.5 mr-2"></span>
                        Add any special instructions
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <div className="flex items-center">
                    <ShoppingBag className="h-5 w-5 text-jamcart-red mr-2" />
                    <h2 className="font-semibold text-lg">Your Shopping List</h2>
                  </div>
                  
                  <button
                    className="text-gray-500 hover:text-gray-700 p-1"
                    onClick={() => setOrderText("• Be specific with brands and quantities\n• Mention alternatives if possible\n• Add any special instructions")}
                    disabled={!orderText}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="p-4">
                  <textarea
                    ref={textareaRef}
                    className="w-full h-80 p-4 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-jamcart-red/50 focus:border-transparent"
                    placeholder="Start typing your shopping list here... (e.g., 2 loaves of bread, 1 gallon of milk, etc.)"
                    value={orderText}
                    onChange={(e) => setOrderText(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <ActionButton
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handleSubmitOrder}
                    disabled={!orderText.trim()}
                    icon={<Send className="h-5 w-5" />}
                    iconPosition="right"
                  >
                    Review & Send Order
                  </ActionButton>
                  
                  <p className="text-gray-500 text-sm text-center mt-3">
                    By sending your order, you agree to our <a href="#" className="text-jamcart-red hover:underline">Terms & Conditions</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isReviewOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold text-lg">Review Your Order</h2>
                <p className="text-gray-600 text-sm">
                  Please review your shopping list before sending
                </p>
              </div>
              
              <div className="p-4">
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center mb-2">
                    <Clipboard className="h-4 w-4 text-gray-500 mr-2" />
                    <h3 className="font-medium">Your Shopping List</h3>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{orderText}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <h3 className="font-medium mb-2">Delivery Information</h3>
                  <div className="text-gray-700 text-sm space-y-1">
                    <p>Delivery to: {user?.address}</p>
                    <p>Town: {user?.town}</p>
                    <p>Contact: {user?.phone}</p>
                  </div>
                </div>
                
                <div className="bg-jamcart-yellow/10 rounded-lg p-3 text-sm text-gray-700">
                  <p>
                    <strong>Note:</strong> Your order will be sent to an admin for approval. Once approved,
                    you'll receive a confirmation with an estimated delivery time.
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                <ActionButton
                  variant="outline"
                  size="md"
                  className="flex-1"
                  onClick={handleCancelReview}
                >
                  Edit Order
                </ActionButton>
                <ActionButton
                  variant="primary"
                  size="md"
                  className="flex-1"
                  loading={isSubmitting}
                  onClick={handleConfirmOrder}
                  icon={<Send className="h-5 w-5" />}
                  iconPosition="right"
                >
                  Send Order
                </ActionButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </>
  );
};

export default OrderPage;
