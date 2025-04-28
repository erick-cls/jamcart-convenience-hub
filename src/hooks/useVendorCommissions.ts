
import { useState, useEffect } from 'react';
import { VendorCommission } from '@/types/vendor.types';
import { useToast } from './use-toast';

export const useVendorCommissions = () => {
  const [commissions, setCommissions] = useState<VendorCommission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCommissions();
  }, []);

  const loadCommissions = () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('jamcart-vendor-commissions');
      if (stored) {
        const data = JSON.parse(stored);
        setCommissions(data);
      } else {
        setCommissions([]);
      }
    } catch (error) {
      console.error('Error loading vendor commissions:', error);
      toast({
        title: 'Error loading data',
        description: 'Could not load vendor commission data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCommission = (commission: VendorCommission) => {
    try {
      const updated = commissions.map(c => 
        c.id === commission.id ? commission : c
      );
      
      setCommissions(updated);
      localStorage.setItem('jamcart-vendor-commissions', JSON.stringify(updated));
      
      toast({
        title: 'Commission updated',
        description: `Commission for ${commission.vendorName} has been updated.`,
      });
      
      return true;
    } catch (error) {
      console.error('Error updating commission:', error);
      toast({
        title: 'Update failed',
        description: 'Could not update vendor commission',
        variant: 'destructive',
      });
      return false;
    }
  };

  const addCommission = (commission: VendorCommission) => {
    try {
      const newCommission = {
        ...commission,
        id: `v${Date.now()}`,
        lastUpdated: new Date().toISOString(),
      };
      
      const updated = [...commissions, newCommission];
      setCommissions(updated);
      localStorage.setItem('jamcart-vendor-commissions', JSON.stringify(updated));
      
      toast({
        title: 'Commission added',
        description: `Commission for ${commission.vendorName} has been added.`,
      });
      
      return true;
    } catch (error) {
      console.error('Error adding commission:', error);
      toast({
        title: 'Failed to add',
        description: 'Could not add vendor commission',
        variant: 'destructive',
      });
      return false;
    }
  };

  const getVendorCommission = (vendorId: string) => {
    return commissions.find(c => c.vendorId === vendorId);
  };

  const calculateCommissionForOrder = (vendorId: string, orderTotal: number) => {
    const commission = getVendorCommission(vendorId);
    if (!commission || !commission.active) {
      // Default commission rate if not set or inactive
      return orderTotal * 0.15;
    }
    
    return orderTotal * (commission.rate / 100);
  };

  return {
    commissions,
    loading,
    updateCommission,
    addCommission,
    getVendorCommission,
    calculateCommissionForOrder,
    refreshCommissions: loadCommissions
  };
};
