
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Check, Bike } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedLogo from '@/components/ui/AnimatedLogo';
import ThankYouAnimation from '@/components/ThankYouAnimation';

const ThankYouPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState({
    id: orderId || 'ORD-' + Math.floor(Math.random() * 10000),
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'confirmed',
    items: [
      'Item 1 x 2',
      'Item 2 x 1',
      'Item 3 x 4',
    ],
    total: Math.floor(Math.random() * 100) + 20,
    delivery: Math.floor(Math.random() * 30) + 'min - ' + (Math.floor(Math.random() * 30) + 30) + 'min',
    rider: {
      name: 'John Rider',
      phone: '+1 (876) 123-4567'
    }
  });

  useEffect(() => {
    // In a real app, fetch order details from API
    console.log("Order confirmed:", orderId);
    
    // For now, let's retrieve order details from local storage if available
    if (orderId) {
      try {
        const storedOrders = localStorage.getItem('jamcart_orders');
        if (storedOrders) {
          const orders = JSON.parse(storedOrders);
          const currentOrder = orders.find((order: any) => order.id === orderId);
          
          if (currentOrder) {
            setOrderDetails({
              ...orderDetails,
              id: currentOrder.id,
              date: new Date(currentOrder.date).toLocaleDateString(),
              time: new Date(currentOrder.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              items: currentOrder.items || orderDetails.items,
              total: currentOrder.total || orderDetails.total,
            });
            console.log("Found order details:", currentOrder);
          }
        }
      } catch (error) {
        console.error("Error retrieving order details:", error);
      }
    }
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white py-4 px-6 border-b border-gray-200">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <AnimatedLogo size="sm" />
          <Button 
            variant="ghost" 
            className="text-gray-600"
            onClick={() => navigate('/categories')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shopping
          </Button>
        </div>
      </header>

      <main className="flex-1 py-10 px-6">
        <div className="max-w-4xl mx-auto">
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

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Order #{orderDetails.id.slice(-6)}</h2>
                  <div className="flex items-center mt-2 text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{orderDetails.date} at {orderDetails.time}</span>
                  </div>
                </div>
                <div className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Order {orderDetails.status}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-medium mb-3">Order Items</h3>
              <ul className="space-y-2">
                {orderDetails.items.map((item, index) => (
                  <li key={index} className="flex justify-between text-gray-600">
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between font-medium">
                <span>Total</span>
                <span>${orderDetails.total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="font-medium mb-3">Delivery Information</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Estimated Delivery Time</p>
                    <p className="text-gray-600">{orderDetails.delivery}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Bike className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Your Delivery Rider</p>
                    <p className="text-gray-600">{orderDetails.rider.name} • {orderDetails.rider.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8"
          >
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-medium">Track Your Delivery</h3>
            </div>
            <div className="p-6 flex justify-center">
              <ThankYouAnimation />
            </div>
          </motion.div>

          <div className="text-center">
            <Button 
              className="mx-2" 
              variant="outline"
              onClick={() => navigate('/categories')}
            >
              Continue Shopping
            </Button>
            <Button 
              onClick={() => navigate('/orders')}
              className="mx-2"
            >
              View Order History
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ThankYouPage;
