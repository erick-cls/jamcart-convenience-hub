
import { useState, useEffect } from 'react';
import { VendorCommission, CommissionSchedule } from '@/types/vendor.types';
import { toast } from '@/hooks/use-toast';

export const useVendorManagement = () => {
  const [vendors, setVendors] = useState<VendorCommission[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<VendorCommission | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = () => {
    try {
      const storedVendors = localStorage.getItem('jamcart-vendor-commissions');
      if (storedVendors) {
        setVendors(JSON.parse(storedVendors));
      } else {
        const initialVendors = getMockVendors();
        localStorage.setItem('jamcart-vendor-commissions', JSON.stringify(initialVendors));
        setVendors(initialVendors);
      }
    } catch (error) {
      console.error('Error loading vendors:', error);
      toast({
        title: "Error loading vendor data",
        description: "Could not load vendor commission data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveCommission = (data: VendorCommission) => {
    try {
      let updatedVendors: VendorCommission[];
      
      if (isEditing && selectedVendor) {
        updatedVendors = vendors.map(v => 
          v.id === selectedVendor.id 
            ? { 
                ...data, 
                lastUpdated: new Date().toISOString(),
                nextPaymentDate: calculateNextPaymentDate(data.schedule)
              } 
            : v
        );
      } else {
        const newVendor = { 
          ...data,
          id: `v${Date.now()}`,
          lastUpdated: new Date().toISOString(),
          nextPaymentDate: calculateNextPaymentDate(data.schedule)
        };
        updatedVendors = [...vendors, newVendor];
      }
      
      setVendors(updatedVendors);
      localStorage.setItem('jamcart-vendor-commissions', JSON.stringify(updatedVendors));
      
      toast({
        title: isEditing ? "Vendor updated" : "Vendor added",
        description: `Commission settings for ${data.vendorName} have been ${isEditing ? 'updated' : 'added'}.`,
      });
      
      setSelectedVendor(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving vendor commission:', error);
      toast({
        title: "Error saving",
        description: "Could not save vendor commission settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditVendor = (vendor: VendorCommission) => {
    setSelectedVendor(vendor);
    setIsEditing(true);
  };

  const handleToggleVendorStatus = (vendorId: string, active: boolean) => {
    try {
      const updatedVendors = vendors.map(v => 
        v.id === vendorId ? { ...v, active, lastUpdated: new Date().toISOString() } : v
      );
      
      setVendors(updatedVendors);
      localStorage.setItem('jamcart-vendor-commissions', JSON.stringify(updatedVendors));
      
      toast({
        title: "Vendor status updated",
        description: `Vendor is now ${active ? 'active' : 'inactive'}.`,
      });
    } catch (error) {
      console.error('Error updating vendor status:', error);
      toast({
        title: "Error updating status",
        description: "Could not update vendor status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVendor = (vendorId: string) => {
    try {
      const updatedVendors = vendors.filter(v => v.id !== vendorId);
      setVendors(updatedVendors);
      localStorage.setItem('jamcart-vendor-commissions', JSON.stringify(updatedVendors));
      
      toast({
        title: "Vendor fee rate deleted",
        description: "The vendor fee rate has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast({
        title: "Error deleting vendor",
        description: "Could not delete vendor fee rate. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    vendors,
    selectedVendor,
    isEditing,
    handleSaveCommission,
    handleEditVendor,
    handleToggleVendorStatus,
    handleDeleteVendor,
    setSelectedVendor,
    setIsEditing
  };
};

// Helper functions
const calculateNextPaymentDate = (schedule: CommissionSchedule): string => {
  const today = new Date();
  let nextDate = new Date(today);
  
  switch(schedule) {
    case 'weekly':
      nextDate.setDate(today.getDate() + 7);
      break;
    case 'bi-monthly':
      nextDate.setDate(today.getDate() + 15);
      break;
    case 'monthly':
      nextDate.setMonth(today.getMonth() + 1);
      break;
  }
  
  return nextDate.toISOString();
};

const getMockVendors = (): VendorCommission[] => {
  const vendorUsers: VendorCommission[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('jamcart-user-')) {
      try {
        const userData = JSON.parse(localStorage.getItem(key) || '{}');
        if (userData.userType === 'vendor') {
          vendorUsers.push({
            id: userData.id,
            vendorId: userData.id,
            vendorName: userData.name || 'Unknown Vendor',
            vendorEmail: userData.email || 'vendor@example.com',
            rate: 15,
            schedule: 'monthly' as CommissionSchedule,
            lastUpdated: new Date().toISOString(),
            nextPaymentDate: calculateNextPaymentDate('monthly' as CommissionSchedule),
            active: true
          });
        }
      } catch (error) {
        console.error('Error parsing user data', error);
      }
    }
  }

  if (vendorUsers.length === 0) {
    return [
      {
        id: 'v1',
        vendorId: 'vendor-1',
        vendorName: 'Deonroy Mitchell',
        vendorEmail: 'deonroy@gmail.com',
        rate: 15,
        schedule: 'monthly' as CommissionSchedule,
        lastUpdated: new Date().toISOString(),
        nextPaymentDate: calculateNextPaymentDate('monthly'),
        active: true
      },
      {
        id: 'v2',
        vendorId: 'vendor-2',
        vendorName: 'Roger Blakely',
        vendorEmail: 'rogerb@gmail.com',
        rate: 12,
        schedule: 'weekly' as CommissionSchedule,
        lastUpdated: new Date().toISOString(),
        nextPaymentDate: calculateNextPaymentDate('weekly'),
        active: true
      },
      {
        id: 'v3',
        vendorId: 'vendor-3',
        vendorName: 'Joe Black',
        vendorEmail: 'joeblack@gmail.com',
        rate: 10,
        schedule: 'bi-monthly' as CommissionSchedule,
        lastUpdated: new Date().toISOString(),
        nextPaymentDate: calculateNextPaymentDate('bi-monthly'),
        active: true
      },
      {
        id: 'v4',
        vendorId: 'vendor-4',
        vendorName: 'Niche Marshall',
        vendorEmail: 'nichemarsh@gmail.com',
        rate: 18,
        schedule: 'monthly' as CommissionSchedule,
        lastUpdated: new Date().toISOString(),
        nextPaymentDate: calculateNextPaymentDate('monthly'),
        active: false
      }
    ];
  }

  return vendorUsers;
};
