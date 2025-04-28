import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import VendorList from '@/components/admin/vendors/VendorList';
import VendorCommissionForm from '@/components/admin/vendors/VendorCommissionForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VendorCommission } from '@/types/vendor.types';

const VendorManagementPage = () => {
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
              schedule: 'monthly',
              lastUpdated: new Date().toISOString(),
              nextPaymentDate: calculateNextPaymentDate('monthly'),
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
          schedule: 'monthly',
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
          schedule: 'weekly',
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
          schedule: 'bi-monthly',
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
          schedule: 'monthly',
          lastUpdated: new Date().toISOString(),
          nextPaymentDate: calculateNextPaymentDate('monthly'),
          active: false
        }
      ];
    }

    return vendorUsers;
  };

  const calculateNextPaymentDate = (schedule: 'weekly' | 'bi-monthly' | 'monthly'): string => {
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

  return (
    <div className="py-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Vendor Fee Management</h1>
          <p className="text-gray-600">Set and manage fee/rates for platform vendors</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <VendorList 
              vendors={vendors}
              onEdit={handleEditVendor}
              onToggleStatus={handleToggleVendorStatus}
            />
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{isEditing ? 'Edit' : 'Set'} Fee Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <VendorCommissionForm 
                  vendor={selectedVendor}
                  isEditing={isEditing}
                  onSave={handleSaveCommission}
                  onCancel={() => {
                    setSelectedVendor(null);
                    setIsEditing(false);
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorManagementPage;
