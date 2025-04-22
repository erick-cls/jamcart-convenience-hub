
import { useState, useEffect } from 'react';
import { Order } from '@/pages/admin/orders/types';

export const useOrderFilters = (orders: Order[]) => {
  const [localOrders, setLocalOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const todayOrders = localOrders.filter(order => {
    const orderDate = new Date(order.date);
    orderDate.setHours(0, 0, 0, 0);
    return orderDate.getTime() === today.getTime();
  });
  
  const yesterdayOrders = localOrders.filter(order => {
    const orderDate = new Date(order.date);
    orderDate.setHours(0, 0, 0, 0);
    return orderDate.getTime() === yesterday.getTime();
  });
  
  const earlierOrders = localOrders.filter(order => {
    const orderDate = new Date(order.date);
    orderDate.setHours(0, 0, 0, 0);
    return orderDate.getTime() < yesterday.getTime();
  });
  
  return {
    localOrders,
    setLocalOrders,
    todayOrders,
    yesterdayOrders,
    earlierOrders
  };
};

