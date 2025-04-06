
import { Order } from './types';
import { mockOrders } from './mockData';

// Get orders from localStorage or return an empty array
export const getStoredOrders = (): Order[] => {
  try {
    const storedOrders = localStorage.getItem('jamcart_orders');
    const parsedOrders = storedOrders ? JSON.parse(storedOrders) : [];
    console.log("Retrieved orders from localStorage:", parsedOrders);
    return parsedOrders;
  } catch (error) {
    console.error("Error retrieving orders from localStorage:", error);
    return [];
  }
};

// Save orders to localStorage
export const saveOrdersToStorage = (orders: Order[]) => {
  try {
    localStorage.setItem('jamcart_orders', JSON.stringify(orders));
    window.dispatchEvent(new Event('storage'));
    console.log("Saved orders to localStorage:", orders);
  } catch (error) {
    console.error("Error saving orders to localStorage:", error);
  }
};

// Initialize orders combining stored and mock orders
export const initializeOrders = (): Order[] => {
  // Get orders from localStorage
  const storedOrders = getStoredOrders();
  
  // Create a map of existing order IDs for quick lookup
  const existingOrderIds = new Set(storedOrders.map(order => order.id));
  
  // Add any mock orders that aren't already in stored orders
  const combinedOrders = [...storedOrders];
  mockOrders.forEach(mockOrder => {
    if (!existingOrderIds.has(mockOrder.id)) {
      combinedOrders.push(mockOrder);
    }
  });
  
  // Save combined orders back to storage
  saveOrdersToStorage(combinedOrders);
  
  return combinedOrders;
};
