
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderConfirmation = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
      <p className="text-gray-600 max-w-lg mx-auto">
        Your order has been received and is being prepared for delivery. You'll receive updates on your order status.
      </p>
    </motion.div>
  );
};

export default OrderConfirmation;
