
import { motion } from 'framer-motion';
import { useOrderDetails } from '@/hooks/useOrderDetails';
import ThankYouHeader from '@/components/order/ThankYouHeader';
import OrderConfirmation from '@/components/order/OrderConfirmation';
import OrderDetails from '@/components/order/OrderDetails';
import DeliveryInformation from '@/components/order/DeliveryInformation';
import ActionButtons from '@/components/order/ActionButtons';

const ThankYouPage = () => {
  const orderDetails = useOrderDetails();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ThankYouHeader />

      <main className="flex-1 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <OrderConfirmation />
          <OrderDetails orderDetails={orderDetails} />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8"
          >
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-medium">Track Your Delivery</h3>
            </div>
            <DeliveryInformation 
              delivery={orderDetails.delivery} 
              rider={orderDetails.rider} 
            />
          </motion.div>

          <ActionButtons />
        </div>
      </main>
    </div>
  );
};

export default ThankYouPage;
