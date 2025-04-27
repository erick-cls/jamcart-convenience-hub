import { UserWallet, WalletTransaction, RiderWallet } from '@/types/wallet.types';
import { User } from '@/types/auth.types';

// Helper function to get a wallet from localStorage
const getWalletFromStorage = (userId: string): UserWallet | null => {
  try {
    const walletData = localStorage.getItem(`wallet_${userId}`);
    if (walletData) {
      return JSON.parse(walletData);
    }
  } catch (error) {
    console.error('Error reading wallet from storage:', error);
  }
  return null;
};

// Helper function to save wallet to localStorage
const saveWalletToStorage = (wallet: UserWallet): void => {
  try {
    localStorage.setItem(`wallet_${wallet.userId}`, JSON.stringify(wallet));
  } catch (error) {
    console.error('Error saving wallet to storage:', error);
  }
};

// Get a user's wallet (create if doesn't exist)
export const getUserWallet = (userId: string): UserWallet => {
  const existingWallet = getWalletFromStorage(userId);
  
  if (existingWallet) {
    return existingWallet;
  }
  
  // Create a new wallet if one doesn't exist
  const newWallet: UserWallet = {
    userId,
    balance: 0,
    cashbackRate: 0.02, // 2% cashback by default
    lastUpdated: new Date().toISOString(),
    transactions: []
  };
  
  saveWalletToStorage(newWallet);
  return newWallet;
};

// Add cashback to user wallet based on order total
export const addCashbackToWallet = (
  userId: string, 
  orderTotal: number, 
  orderId: string
): UserWallet => {
  const wallet = getUserWallet(userId);
  
  // Calculate cashback amount
  const cashbackAmount = orderTotal * wallet.cashbackRate;
  
  // Create transaction record
  const transaction: WalletTransaction = {
    id: `cb_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    userId,
    amount: cashbackAmount,
    type: 'cashback',
    description: `Cashback for order #${orderId.slice(-6)}`,
    createdAt: new Date().toISOString()
  };
  
  // Update wallet
  wallet.balance += cashbackAmount;
  wallet.lastUpdated = new Date().toISOString();
  wallet.transactions = [transaction, ...wallet.transactions];
  
  // Save updated wallet
  saveWalletToStorage(wallet);
  
  return wallet;
};

// Load funds to wallet from card on file
export const loadFundsFromCard = (
  userId: string, 
  amount: number,
  user: User
): { success: boolean; message: string; wallet?: UserWallet } => {
  // Check if user has card on file
  if (!user.cardInfo || !user.cardInfo.cardNumber) {
    return { 
      success: false, 
      message: 'No payment card on file. Please add a card in your profile settings.'
    };
  }
  
  // In a real app, we would make an API call to payment processor here
  // This is a simplified simulation where we just check card data exists
  
  // Check last 4 digits as a simplistic "balance check" (just for demo purposes)
  // In a real app, we'd make an API call to check sufficient funds
  const lastFourDigits = parseInt(user.cardInfo.cardNumber.slice(-4), 10);
  if (isNaN(lastFourDigits) || lastFourDigits < 1000) {
    return { 
      success: false, 
      message: 'Your card was declined. Insufficient funds or card error.'
    };
  }
  
  // If we reach here, payment was "successful"
  const wallet = getUserWallet(userId);
  
  // Create transaction record
  const transaction: WalletTransaction = {
    id: `dep_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    userId,
    amount,
    type: 'deposit',
    description: `Added $${amount.toFixed(2)} JMD using card ending in ${user.cardInfo.cardNumber.slice(-4)}`,
    createdAt: new Date().toISOString()
  };
  
  // Update wallet
  wallet.balance += amount;
  wallet.lastUpdated = new Date().toISOString();
  wallet.transactions = [transaction, ...wallet.transactions];
  
  // Save updated wallet
  saveWalletToStorage(wallet);
  
  return { 
    success: true, 
    message: `$${amount.toFixed(2)} JMD has been added to your wallet.`,
    wallet 
  };
};

// Load funds to wallet
export const loadFunds = (
  userId: string, 
  amount: number
): UserWallet => {
  const wallet = getUserWallet(userId);
  
  // Create transaction record
  const transaction: WalletTransaction = {
    id: `dep_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    userId,
    amount,
    type: 'deposit',
    description: `Loaded $${amount.toFixed(2)} JMD to wallet`,
    createdAt: new Date().toISOString()
  };
  
  // Update wallet
  wallet.balance += amount;
  wallet.lastUpdated = new Date().toISOString();
  wallet.transactions = [transaction, ...wallet.transactions];
  
  // Save updated wallet
  saveWalletToStorage(wallet);
  
  return wallet;
};

// Get a rider's wallet (create if doesn't exist)
export const getRiderWallet = (userId: string): RiderWallet => {
  const existingWallet = getWalletFromStorage(userId) as RiderWallet | null;
  
  if (existingWallet && 'deliveryCount' in existingWallet) {
    return existingWallet;
  }
  
  // Create a new rider wallet if one doesn't exist or convert user wallet
  const baseWallet = existingWallet || getUserWallet(userId);
  
  const riderWallet: RiderWallet = {
    ...baseWallet,
    deliveryCount: 0,
    isEarlyAdopter: Date.now() < new Date('2025-05-31').getTime(), // Early adopter if before May 31, 2025
    bonusPaid: false,
    earnings: 0
  };
  
  saveWalletToStorage(riderWallet);
  return riderWallet;
};

// Add earning to rider wallet
export const addRiderEarning = (
  userId: string, 
  amount: number,
  orderId: string
): RiderWallet => {
  const wallet = getRiderWallet(userId);
  
  // Create transaction record
  const transaction: WalletTransaction = {
    id: `earn_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    userId,
    amount,
    type: 'deposit',
    description: `Earning for delivery #${orderId.slice(-6)}`,
    createdAt: new Date().toISOString()
  };
  
  // Update wallet
  wallet.balance += amount;
  wallet.earnings += amount;
  wallet.deliveryCount += 1;
  wallet.lastUpdated = new Date().toISOString();
  wallet.transactions = [transaction, ...wallet.transactions];
  
  // Check if early adopter bonus should be applied
  if (wallet.isEarlyAdopter && wallet.deliveryCount >= 10 && !wallet.bonusPaid) {
    const bonusAmount = 550; // $550 JMD bonus
    
    // Create bonus transaction
    const bonusTransaction: WalletTransaction = {
      id: `bonus_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId,
      amount: bonusAmount,
      type: 'bonus',
      description: 'Early adopter bonus after 10 deliveries',
      createdAt: new Date().toISOString()
    };
    
    // Update wallet with bonus
    wallet.balance += bonusAmount;
    wallet.bonusPaid = true;
    wallet.transactions = [bonusTransaction, ...wallet.transactions];
  }
  
  // Save updated wallet
  saveWalletToStorage(wallet);
  
  return wallet;
};

// Process weekly payout for rider
export const processRiderPayout = (userId: string): RiderWallet => {
  const wallet = getRiderWallet(userId);
  
  if (wallet.balance <= 0) {
    return wallet; // No balance to payout
  }
  
  const payoutAmount = wallet.balance;
  
  // Create transaction record
  const transaction: WalletTransaction = {
    id: `payout_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    userId,
    amount: -payoutAmount,
    type: 'withdrawal',
    description: `Weekly payout of $${payoutAmount.toFixed(2)} JMD`,
    createdAt: new Date().toISOString()
  };
  
  // Update wallet
  wallet.balance = 0;
  wallet.lastUpdated = new Date().toISOString();
  wallet.transactions = [transaction, ...wallet.transactions];
  
  // Save updated wallet
  saveWalletToStorage(wallet);
  
  return wallet;
};

// Admin toggle for early adopter bonus program
export const toggleEarlyAdopterProgram = (isActive: boolean): void => {
  localStorage.setItem('early_adopter_program_active', isActive.toString());
};

// Check if early adopter program is active
export const isEarlyAdopterProgramActive = (): boolean => {
  return localStorage.getItem('early_adopter_program_active') === 'true';
};
