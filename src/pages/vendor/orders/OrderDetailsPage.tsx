
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useOrdersState } from '@/pages/admin/orders/useOrdersState';
import { OrderStatus } from '@/components/ui/OrderItem';
import { useToast } from '@/hooks/use-toast';
import VendorLayout from '@/components/vendor/VendorLayout';
import LoadingState from '@/components/vendor/orders/LoadingState';
import CustomerInfoCard from '@/components/vendor/orders/CustomerInfoCard';
import OrderSummaryCard from '@/components/vendor/orders/OrderSummaryCard';
import OrderActionsCard from '@/components/vendor/orders/OrderActionsCard';
import OrderNotesCard from '@/components/vendor/orders/OrderNotesCard';
import OrderStatusBadge from '@/components/admin/orders/details/OrderStatusBadge';

const OrderDetailsPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orders, updateOrderStatus, loading } = useOrdersState();
  const { toast } = useToast();
  
  const [order, setOrder] = useState(orders.find(o => o.id === orderId) || null);
  const [notes, setNotes] = useState(order?.notes || '');
  const [estimatedTime, setEstimatedTime] = useState(order?.estimatedTime || '');
  
  useEffect(() => {
    if (!orderId) return;
    
    const foundOrder = orders.find(o => o.id === orderId);
    if (foundOrder) {
      setOrder(foundOrder);
      setNotes(foundOrder.notes || '');
      setEstimatedTime(foundOrder.estimatedTime || '');
    }
  }, [orderId, orders]);
  
  useEffect(() => {
    if (!user || user.userType !== 'vendor') {
      navigate('/');
    }
  }, [user, navigate]);
  
  useEffect(() => {
    if (order && user && order.store?.vendor !== user.id) {
      toast({
        title: "Access denied",
        description: "You don't have permission to view this order",
        variant: "destructive",
      });
      navigate('/vendor/dashboard');
    }
  }, [order, user, navigate, toast]);

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (!order) return;
    
    updateOrderStatus(order.id, newStatus);
    
    toast({
      title: "Order updated",
      description: `Order status changed to ${newStatus}`,
      variant: "default",
    });
  };
  
  const handleSaveChanges = () => {
    if (!order) return;
    
    const updatedOrder = { ...order, notes, estimatedTime };
    setOrder(updatedOrder);
    
    toast({
      title: "Changes saved",
      description: "Order details have been updated",
      variant: "default",
    });
  };
  
  if (loading || !order) {
    return <LoadingState />;
  }
  
  return (
    <VendorLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Order #{order.id.slice(-6)}</h1>
            <p className="text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <CustomerInfoCard order={order} />
          <OrderSummaryCard order={order} />
          <OrderActionsCard 
            order={order} 
            onStatusChange={handleStatusChange} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OrderNotesCard 
            notes={notes}
            estimatedTime={estimatedTime}
            onNotesChange={setNotes}
            onEstimatedTimeChange={setEstimatedTime}
            onSave={handleSaveChanges}
          />
        </div>
      </div>
    </VendorLayout>
  );
};

export default OrderDetailsPage;
