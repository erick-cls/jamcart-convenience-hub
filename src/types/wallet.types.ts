
export interface WalletTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'cashback' | 'bonus';
  description: string;
  createdAt: string;
}

export interface UserWallet {
  userId: string;
  balance: number;
  cashbackRate: number;
  lastUpdated: string;
  transactions: WalletTransaction[];
}

export interface RiderWallet extends UserWallet {
  deliveryCount: number;
  isEarlyAdopter: boolean;
  bonusPaid: boolean;
  earnings: number;
}
