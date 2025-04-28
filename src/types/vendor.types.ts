
export type CommissionSchedule = 'weekly' | 'bi-monthly' | 'monthly';

export interface VendorCommission {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  rate: number; // percentage from 10-20
  schedule: CommissionSchedule;
  lastUpdated: string;
  nextPaymentDate: string;
  active: boolean;
}
