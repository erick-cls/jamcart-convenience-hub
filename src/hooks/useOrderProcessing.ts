
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useOrdersState } from '@/pages/admin/orders/useOrdersState';
import { toast } from '@/hooks/use-toast';
import { parseOrderItems } from '@/utils/order/orderUtils';

interface OrderProcessingHook {
  isSubmitting: boolean;
  isReviewOpen: boolean;
  isPolicyOpen: boolean;
  handleSubmitOrder: (orderText: string) => void;
  handleReviewConfirmation: () => void;
  handlePolicyAgreement: (
    orderText: string,
    store: any,
    category: any,
    customerLocation: { lat: number; lng: number } | null
  ) => void;
  setIsReviewOpen: (isOpen: boolean) => void;
  setIsPolicyOpen: (isOpen: boolean) => void;
}

export const useOrderProcessing = (): OrderProcessingHook => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createTestOrder } = useOrdersState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  const handleSubmitOrder = (orderText: string) => {
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

  const handlePolicyAgreement = (
    orderText: string,
    store: any,
    category: any,
    customerLocation: { lat: number; lng: number } | null
  ) => {
    setIsPolicyOpen(false);
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

  return {
    isSubmitting,
    isReviewOpen,
    isPolicyOpen,
    handleSubmitOrder,
    handleReviewConfirmation,
    handlePolicyAgreement,
    setIsReviewOpen,
    setIsPolicyOpen,
  };
};
