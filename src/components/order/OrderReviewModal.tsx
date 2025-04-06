
import { motion } from 'framer-motion';
import { Clipboard } from 'lucide-react';
import ActionButton from '@/components/ui/ActionButton';
import { Send } from 'lucide-react';

interface User {
  address?: string;
  town?: string;
  phone?: string;
}

interface OrderReviewModalProps {
  isOpen: boolean;
  orderText: string;
  user: User | null;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const OrderReviewModal = ({ 
  isOpen, 
  orderText, 
  user, 
  isSubmitting, 
  onCancel, 
  onConfirm 
}: OrderReviewModalProps) => {
  if (!isOpen) return null;
  
  return (
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
            onClick={onCancel}
          >
            Edit Order
          </ActionButton>
          <ActionButton
            variant="primary"
            size="md"
            className="flex-1"
            loading={isSubmitting}
            onClick={onConfirm}
            icon={<Send className="h-5 w-5" />}
            iconPosition="right"
          >
            Send Order
          </ActionButton>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderReviewModal;
