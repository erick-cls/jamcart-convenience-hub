
import { Order } from '@/pages/admin/orders/types';
import { useOrderUpdates } from './useOrderUpdates';
import { useOrderEvents } from './useOrderEvents';
import { useOrderRefresh } from './useOrderRefresh';

export type { Order };

export const useUserOrdersState = (initialOrders: Order[], onOrderUpdate?: () => void) => {
  const { orders, isRefreshing, lastRefreshed, refreshOrders } = useOrderRefresh(initialOrders);
  const { handleOrderUpdate } = useOrderUpdates(onOrderUpdate);
  
  useOrderEvents(refreshOrders);

  return {
    orders,
    isRefreshing,
    lastRefreshed,
    handleOrderUpdate,
    refreshOrders
  };
};
