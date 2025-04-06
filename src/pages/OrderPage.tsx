
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useOrdersState } from '@/pages/admin/orders/useOrdersState';
import StoreInfo from '@/components/order/StoreInfo';
import ShoppingListForm from '@/components/order/ShoppingListForm';
import OrderReviewModal from '@/components/order/OrderReviewModal';
import { parseOrderItems } from '@/utils/order/orderUtils';
import { categories, mockStores, getCategoryById, getStoreById } from '@/utils/order/mockStoreData';

const OrderPage = () => {
  const { categoryId, storeId } = useParams<{ categoryId: string; storeId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createTestOrder } = useOrdersState();
  const [store, setStore] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [orderText, setOrderText] = useState(
    "• Be specific with brands and quantities\n• Mention alternatives if possible\n• Add any special instructions"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  
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
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit an order.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      const orderItems = parseOrderItems(orderText);
      
      // Check if there are any items after filtering
      if (orderItems.length === 0) {
        // If no valid items found, add a default item
        orderItems.push("Unspecified item");
      }
      
      // Pass the parsed order items directly to createTestOrder
      const newOrder = createTestOrder(user.id, user.name || 'Anonymous', orderItems);
      
      // Update order store and category info
      newOrder.storeName = store.name;
      newOrder.category = category.name;
      
      toast({
        title: "Order submitted successfully!",
        description: "Your order has been sent to the admin for approval.",
      });
      
      navigate(`/thankyou/${newOrder.id}`);
    } catch (error) {
      toast({
        title: "Error submitting order",
        description: "There was a problem submitting your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
              <StoreInfo store={store} category={category} />
            </div>
            
            <div className="order-1 lg:order-2 lg:col-span-2">
              <ShoppingListForm 
                orderText={orderText}
                setOrderText={setOrderText}
                handleSubmitOrder={handleSubmitOrder}
              />
            </div>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isReviewOpen && (
          <OrderReviewModal
            isOpen={isReviewOpen}
            orderText={orderText}
            user={user}
            isSubmitting={isSubmitting}
            onCancel={handleCancelReview}
            onConfirm={handleConfirmOrder}
          />
        )}
      </AnimatePresence>
      
      <Footer />
    </>
  );
};

export default OrderPage;
