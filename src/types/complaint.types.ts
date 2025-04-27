
export type ComplaintStatus = 'pending' | 'under_review' | 'resolved' | 'dismissed';

export interface Complaint {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  vendorId?: string;
  issue: string;
  description: string;
  status: ComplaintStatus;
  created: string;
  updated: string;
  adminNotes?: string;
  resolution?: string;
}
