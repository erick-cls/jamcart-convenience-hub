
import { VendorStore, VendorOrderStats, VendorPayment } from '@/types/vendor.types';
import { Order } from '@/hooks/useUserOrdersState';

// Helper function to get stores from localStorage
const getStoresFromStorage = (): VendorStore[] => {
  try {
    const storesData = localStorage.getItem('vendor_stores');
    if (storesData) {
      return JSON.parse(storesData);
    }
  } catch (error) {
    console.error('Error reading stores from storage:', error);
  }
  return [];
};

// Helper function to save stores to localStorage
const saveStoresToStorage = (stores: VendorStore[]): void => {
  try {
    localStorage.setItem('vendor_stores', JSON.stringify(stores));
  } catch (error) {
    console.error('Error saving stores to storage:', error);
  }
};

// Get all vendor stores
export const getAllStores = (): VendorStore[] => {
  return getStoresFromStorage();
};

// Get stores owned by specific vendor
export const getVendorStores = (userId: string): VendorStore[] => {
  const stores = getStoresFromStorage();
  return stores.filter(store => store.ownerId === userId);
};

// Get a specific store by ID
export const getStoreById = (storeId: string): VendorStore | null => {
  const stores = getStoresFromStorage();
  return stores.find(store => store.id === storeId) || null;
};

// Create or update a store
export const saveStore = (store: VendorStore): VendorStore => {
  const stores = getStoresFromStorage();
  
  const existingStoreIndex = stores.findIndex(s => s.id === store.id);
  
  if (existingStoreIndex >= 0) {
    // Update existing store
    stores[existingStoreIndex] = {
      ...stores[existingStoreIndex],
      ...store,
    };
  } else {
    // Add new store
    stores.push({
      ...store,
      createdAt: new Date().toISOString(),
    });
  }
  
  saveStoresToStorage(stores);
  return store;
};

// Delete a store
export const deleteStore = (storeId: string): boolean => {
  const stores = getStoresFromStorage();
  const filteredStores = stores.filter(store => store.id !== storeId);
  
  if (filteredStores.length < stores.length) {
    saveStoresToStorage(filteredStores);
    return true;
  }
  
  return false;
};

// Upload store image (mock function that would normally upload to server/storage)
export const uploadStoreImage = async (
  storeId: string, 
  file: File
): Promise<{ success: boolean; imageUrl?: string; error?: string }> => {
  // In a real app, this would upload to a server or cloud storage
  // For this demo, we'll simulate a successful upload with a timeout
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create a fake URL as if we uploaded the image
      const randomId = Math.random().toString(36).substring(2, 15);
      const fakeImageUrl = `/store-images/${storeId}-${randomId}.jpg`;
      
      // Update the store with the image URL
      const stores = getStoresFromStorage();
      const storeIndex = stores.findIndex(s => s.id === storeId);
      
      if (storeIndex >= 0) {
        stores[storeIndex].imageUrl = fakeImageUrl;
        saveStoresToStorage(stores);
      }
      
      resolve({
        success: true,
        imageUrl: fakeImageUrl
      });
    }, 1500); // Simulate network delay
  });
};

// Get orders for a specific store
export const getStoreOrders = (storeId: string, allOrders: Order[]): Order[] => {
  return allOrders.filter(order => order.storeName === storeId);
};

// Calculate vendor statistics
export const getVendorStats = (storeId: string, allOrders: Order[]): VendorOrderStats => {
  const storeOrders = getStoreOrders(storeId, allOrders);
  const store = getStoreById(storeId);
  const commissionRate = store?.commissionRate || 0.15; // Default 15%
  
  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  let totalRevenue = 0;
  let weeklyRevenue = 0;
  let weeklyOrders = 0;
  let monthlyOrders = 0;
  let lastOrderDate = undefined;
  
  storeOrders.forEach(order => {
    const orderDate = new Date(order.date);
    const orderTotal = order.total || 0;
    
    totalRevenue += orderTotal;
    
    if (orderDate > oneWeekAgo) {
      weeklyRevenue += orderTotal;
      weeklyOrders++;
    }
    
    if (orderDate > oneMonthAgo) {
      monthlyOrders++;
    }
    
    if (!lastOrderDate || orderDate > new Date(lastOrderDate)) {
      lastOrderDate = order.date;
    }
  });
  
  // Calculate commissions
  const commissionsOwed = weeklyRevenue * commissionRate;
  
  // Get previous payments
  const payments = getVendorPayments(storeId);
  const commissionsPaid = payments.reduce((total, payment) => total + payment.commissionAmount, 0);
  
  return {
    totalOrders: storeOrders.length,
    weeklyOrders,
    monthlyOrders,
    totalRevenue,
    weeklyRevenue,
    commissionsOwed,
    commissionsPaid,
    lastOrderDate
  };
};

// Get vendor payments history
export const getVendorPayments = (storeId: string): VendorPayment[] => {
  try {
    const paymentsData = localStorage.getItem(`vendor_payments_${storeId}`);
    if (paymentsData) {
      return JSON.parse(paymentsData);
    }
  } catch (error) {
    console.error('Error reading payments from storage:', error);
  }
  return [];
};

// Record a new vendor payment
export const recordVendorPayment = (payment: VendorPayment): VendorPayment => {
  const payments = getVendorPayments(payment.storeId);
  payments.push(payment);
  
  try {
    localStorage.setItem(`vendor_payments_${payment.storeId}`, JSON.stringify(payments));
  } catch (error) {
    console.error('Error saving payment to storage:', error);
  }
  
  return payment;
};
