
import { useRef } from 'react';
import { Send, X } from 'lucide-react';
import { ShoppingBag } from 'lucide-react';
import ActionButton from '@/components/ui/ActionButton';

interface ShoppingListFormProps {
  orderText: string;
  setOrderText: (text: string) => void;
  handleSubmitOrder: () => void;
}

const ShoppingListForm = ({ orderText, setOrderText, handleSubmitOrder }: ShoppingListFormProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
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
  );
};

export default ShoppingListForm;
