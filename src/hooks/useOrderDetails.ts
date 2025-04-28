
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { OrderItem } from '@/pages/admin/orders/types';

interface OrderDetails {
  id: string;
  date: string;
  time: string;
  status: string;
  items: OrderItem[] | string[];
  total: number;
  delivery: string;
  rider: {
    name: string;
    phone: string;
  };
}

export const useOrderDetails = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
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

  return orderDetails;
};
