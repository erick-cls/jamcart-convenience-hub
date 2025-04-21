
import { motion } from 'framer-motion';
import { Check, AlertTriangle, Clock } from 'lucide-react';
import ActionButton from '@/components/ui/ActionButton';

interface CancellationPolicyModalProps {
  isOpen: boolean;
  onAgree: () => void;
}

const CancellationPolicyModal = ({ isOpen, onAgree }: CancellationPolicyModalProps) => {
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
        <div className="p-4 border-b border-gray-100 bg-red-50 flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <h2 className="font-semibold text-lg">Important Notice</h2>
        </div>
        
        <div className="p-5">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-amber-100 p-2 rounded-full mr-3">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Cancellation Policy</h3>
                <p className="text-gray-700">
                  After submission of your order you have a <strong>10-minute window</strong> for free cancellation.
                </p>
                <p className="text-gray-700 mt-2">
                  Cancellation after 10 minutes will incur a <strong>$1,000 JMD</strong> cancellation fee.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-gray-50 p-4 rounded-lg text-sm text-gray-700 border border-gray-100">
            <p>
              By clicking "I AGREE" below, you acknowledge that you understand and accept these terms.
            </p>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <ActionButton
            variant="primary"
            size="lg"
            className="w-full bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2"
            onClick={onAgree}
            icon={<Check className="h-5 w-5" />}
          >
            I AGREE
          </ActionButton>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CancellationPolicyModal;
