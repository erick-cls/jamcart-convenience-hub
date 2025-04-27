import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useOrdersState, Order } from '@/pages/admin/orders/useOrdersState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderStatus } from '@/components/ui/OrderItem';
import { useToast } from '@/hooks/use-toast';
import VendorLayout from '@/components/vendor/VendorLayout';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import OrderStatusBadge from '@/components/admin/orders/details/OrderStatusBadge';

const OrderDetailsPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orders, updateOrderStatus, loading } = useOrdersState();
  const { toast } = useToast();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [notes, setNotes] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  
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
    return (
      <VendorLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-jamcart-green border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
      </VendorLayout>
    );
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
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              {order?.user && (
                <>
                  <p className="font-medium">{order.user.name}</p>
                  <p className="text-gray-600">{order.user.email}</p>
                  <p className="text-gray-600">{order.user.phone}</p>
                  <p className="text-gray-600 mt-2">{order.address}</p>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>${order.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Delivery Fee:</span>
                <span>${(order.price * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${(order.price * 1.1).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Order Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                onClick={() => handleStatusChange('accepted')} 
                className="w-full"
                disabled={order.status !== 'pending'}
                variant="default"
              >
                Accept Order
              </Button>
              <Button 
                onClick={() => handleStatusChange('completed')} 
                className="w-full"
                disabled={order.status !== 'accepted'}
                variant="default"
              >
                Mark as Completed
              </Button>
              <Button 
                onClick={() => handleStatusChange('declined')} 
                className="w-full"
                disabled={['completed', 'cancelled', 'declined'].includes(order.status)}
                variant="destructive"
              >
                Decline Order
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.options && (
                        <p className="text-sm text-gray-600">{item.options}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p>${Number(item.price).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity || 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Order Notes & Preparation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Estimated Preparation Time (minutes)
                  </label>
                  <Input 
                    type="number" 
                    value={estimatedTime} 
                    onChange={(e) => setEstimatedTime(e.target.value)}
                    placeholder="E.g., 20"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Notes for Customer
                  </label>
                  <Textarea 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about the order..."
                    rows={3}
                  />
                </div>
                
                <Button 
                  onClick={handleSaveChanges}
                  className="w-full"
                  variant="outline"
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </VendorLayout>
  );
};

export default OrderDetailsPage;
