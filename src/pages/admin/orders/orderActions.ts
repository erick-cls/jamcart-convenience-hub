
import { Order, OrderStatus, OrderItem } from './types';
import { saveOrdersToStorage, getStoredOrders } from './orderStorage';

// Update order status
export const updateOrderStatus = (
  orders: Order[], 
  orderId: string, 
  newStatus: OrderStatus
): Order[] => {
  const updatedOrders = orders.map(order => 
    order.id === orderId ? { ...order, status: newStatus } : order
  );
  
  // Save to localStorage immediately to ensure persistence
  saveOrdersToStorage(updatedOrders);
  
  // Dispatch a storage event to notify other components about the change
  window.dispatchEvent(new Event('storage'));
  
  return updatedOrders;
};

// Filter orders by user ID
export const getUserOrders = (userId: string): Order[] => {
  if (!userId) {
    console.warn("getUserOrders called with no userId");
    return [];
  }
  
  // Get fresh orders from localStorage
  const allOrders = getStoredOrders();
  
  // Return all orders that match the userId
  const userOrders = allOrders.filter(order => order.userId === userId);
  console.log(`Found ${userOrders.length} orders for user ${userId}:`, userOrders);
  return userOrders;
};

// Assign a rider to an order
export const assignRider = (
  orders: Order[], 
  orderId: string, 
  riderId: string,
  riderName: string
): Order[] => {
  const updatedOrders = orders.map(order => 
    order.id === orderId 
      ? { 
          ...order, 
          riderId: riderId, 
          riderName: riderName 
        } 
      : order
  );
  
  // Save to localStorage
  saveOrdersToStorage(updatedOrders);
  
  return updatedOrders;
};

// Create a new test order
export const createTestOrder = (
  userId: string, 
  userName: string, 
  itemNames: string[] = []
): Order => {
  const now = new Date();
  
  // Convert string items to OrderItem objects
  const items: OrderItem[] = itemNames.length > 0 
    ? itemNames.map(name => ({ name, price: Math.floor(Math.random() * 20) + 5, quantity: 1 }))
    : [
        { name: 'Test Item 1', price: 7.99, quantity: 1 },
        { name: 'Test Item 2', price: 12.99, quantity: 1 }
      ];
      
  // Calculate total from items
  const price = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const newOrder: Order = {
    id: `order-${now.getTime()}`,
    storeName: 'New Test Order',
    category: 'Test Category',
    date: now.toISOString(),
    status: 'pending',
    items,
    total: price,
    userId,
    userName,
    riderId: null,
    riderName: null,
    isNew: true,
    store: {
      vendor: 'vendor-test'
    },
    user: {
      name: userName,
      email: 'test@example.com',
      phone: '555-0000'
    },
    address: 'Test Address, Kingston, Jamaica',
    price
  };
  
  // Get current orders
  const currentOrders = getStoredOrders();
  
  // Add new order to list
  const updatedOrders = [newOrder, ...currentOrders];
  
  // Save to localStorage
  saveOrdersToStorage(updatedOrders);
  
  console.log("Created new order:", newOrder);
  return newOrder;
};

// Auto-cancel pending orders that are older than 1 hour or from yesterday
export const autoCancelPendingOrders = (orders: Order[]): Order[] => {
  const currentTime = new Date().getTime();
  const oneHourInMs = 60 * 60 * 1000;

  const updatedOrders = orders.map(order => {
    if (order.status === 'pending') {
      const orderTime = new Date(order.date).getTime();
      const timeDiff = currentTime - orderTime;
      
      if (timeDiff > oneHourInMs) {
        return {
          ...order,
          status: 'cancelled' as OrderStatus
        };
      }
    }
    return order;
  });

  // Save updated orders to storage if there were any changes
  if (JSON.stringify(orders) !== JSON.stringify(updatedOrders)) {
    saveOrdersToStorage(updatedOrders);
  }

  return updatedOrders;
};
