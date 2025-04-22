
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useOrdersState } from '@/pages/admin/orders/useOrdersState';
import StoreInfo from '@/components/order/StoreInfo';
import ShoppingListForm from '@/components/order/ShoppingListForm';
import OrderReviewModal from '@/components/order/OrderReviewModal';
import CancellationPolicyModal from '@/components/order/CancellationPolicyModal';
import OrderPageHeader from '@/components/order/OrderPageHeader';
import CustomerLocation from '@/components/order/CustomerLocation';
import { parseOrderItems } from '@/utils/order/orderUtils';
import { categories, mockStores } from '@/utils/order/mockStoreData';

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
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [customerLocation, setCustomerLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  useEffect(() => {
    setCustomerLocation({ lat: 18.0179, lng: -76.8099 });
  }, []);
  
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
  
  const handleReviewConfirmation = () => {
    setIsReviewOpen(false);
    setIsPolicyOpen(true);
  };
  
  const handlePolicyAgreement = () => {
    setIsPolicyOpen(false);
    processOrder();
  };
  
  const processOrder = () => {
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
      
      if (orderItems.length === 0) {
        orderItems.push("Unspecified item");
      }
      
      const newOrder = createTestOrder(user.id, user.name || 'Anonymous', orderItems);
      
      newOrder.storeName = store.name;
      newOrder.category = category.name;
      
      if (customerLocation) {
        (newOrder as any).customerLocation = customerLocation;
      }
      
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
  
  if (!store || !category) return null;
  
  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 pb-10">
        <div className="app-container">
          <OrderPageHeader 
            storeName={store.name}
            categoryIcon={category.icon}
            categoryName={category.name}
            categoryId={categoryId as string}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="order-2 lg:order-1 lg:col-span-1">
              <StoreInfo store={store} category={category} />
              
              <CustomerLocation 
                customerLocation={customerLocation}
                customerName={user?.name}
                isLoadingLocation={isLoadingLocation}
                locationError={locationError}
                onLocationUpdate={(location) => {
                  setCustomerLocation(location);
                  setIsLoadingLocation(false);
                  setLocationError(null);
                }}
              />
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
            onCancel={() => setIsReviewOpen(false)}
            onConfirm={handleReviewConfirmation}
          />
        )}
        
        {isPolicyOpen && (
          <CancellationPolicyModal
            isOpen={isPolicyOpen}
            onAgree={handlePolicyAgreement}
          />
        )}
      </AnimatePresence>
      
      <Footer />
    </>
  );
};

export default OrderPage;
