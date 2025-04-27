
import { Complaint, ComplaintStatus } from '@/types/complaint.types';

// Helper function to get complaints from localStorage
const getComplaintsFromStorage = (): Complaint[] => {
  try {
    const complaintsData = localStorage.getItem('order_complaints');
    if (complaintsData) {
      return JSON.parse(complaintsData);
    }
  } catch (error) {
    console.error('Error reading complaints from storage:', error);
  }
  return [];
};

// Helper function to save complaints to localStorage
const saveComplaintsToStorage = (complaints: Complaint[]): void => {
  try {
    localStorage.setItem('order_complaints', JSON.stringify(complaints));
  } catch (error) {
    console.error('Error saving complaints to storage:', error);
  }
};

// Get all complaints
export const getAllComplaints = (): Complaint[] => {
  return getComplaintsFromStorage();
};

// Get complaints for a specific user
export const getUserComplaints = (userId: string): Complaint[] => {
  const complaints = getComplaintsFromStorage();
  return complaints.filter(complaint => complaint.userId === userId);
};

// Get complaints for a specific order
export const getOrderComplaints = (orderId: string): Complaint[] => {
  const complaints = getComplaintsFromStorage();
  return complaints.filter(complaint => complaint.orderId === orderId);
};

// Create a new complaint
export const createComplaint = (complaint: Omit<Complaint, 'id' | 'created' | 'updated' | 'status'>): Complaint => {
  const complaints = getComplaintsFromStorage();
  
  const newComplaint: Complaint = {
    ...complaint,
    id: `complaint_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    status: 'pending',
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  };
  
  complaints.push(newComplaint);
  saveComplaintsToStorage(complaints);
  
  return newComplaint;
};

// Update complaint status
export const updateComplaintStatus = (
  complaintId: string, 
  status: ComplaintStatus, 
  adminNotes?: string,
  resolution?: string
): Complaint | null => {
  const complaints = getComplaintsFromStorage();
  const complaintIndex = complaints.findIndex(c => c.id === complaintId);
  
  if (complaintIndex < 0) {
    return null;
  }
  
  complaints[complaintIndex] = {
    ...complaints[complaintIndex],
    status,
    updated: new Date().toISOString(),
    ...(adminNotes && { adminNotes }),
    ...(resolution && { resolution })
  };
  
  saveComplaintsToStorage(complaints);
  return complaints[complaintIndex];
};

// Delete a complaint
export const deleteComplaint = (complaintId: string): boolean => {
  const complaints = getComplaintsFromStorage();
  const filteredComplaints = complaints.filter(c => c.id !== complaintId);
  
  if (filteredComplaints.length < complaints.length) {
    saveComplaintsToStorage(filteredComplaints);
    return true;
  }
  
  return false;
};
