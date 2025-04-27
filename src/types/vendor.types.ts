
export interface VendorStore {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  imageUrl?: string;
  category: string;
  location?: { lat: number; lng: number } | null;
  address: string;
  commissionRate: number; // Percentage (10-20%)
  createdAt: string;
  isActive: boolean;
}

export interface VendorOrderStats {
  totalOrders: number;
  weeklyOrders: number;
  monthlyOrders: number;
  totalRevenue: number;
  weeklyRevenue: number;
  commissionsPaid: number;
  commissionsOwed: number;
  lastOrderDate?: string;
}

export interface VendorPayment {
  id: string;
  storeId: string;
  amount: number;
  commissionAmount: number;
  commissionRate: number;
  datePaid: string;
  ordersPeriod: {
    from: string;
    to: string;
  };
  orderCount: number;
}
