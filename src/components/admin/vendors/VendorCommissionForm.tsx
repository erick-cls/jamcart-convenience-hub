
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { VendorCommission } from '@/types/vendor.types';
import { FeeRateField, VendorSelectField, PaymentScheduleField } from './form/FormFields';
import { VendorDisplay } from './form/VendorDisplay';
import { FormActions } from './form/FormActions';

interface VendorCommissionFormProps {
  vendor: VendorCommission | null;
  isEditing: boolean;
  onSave: (data: VendorCommission) => void;
  onCancel: () => void;
}

const VendorCommissionForm = ({
  vendor,
  isEditing,
  onSave,
  onCancel
}: VendorCommissionFormProps) => {
  const getVendorList = () => {
    const vendorUsers: { id: string; name: string; email: string }[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('jamcart-user-')) {
        try {
          const userData = JSON.parse(localStorage.getItem(key) || '{}');
          if (userData.userType === 'vendor') {
            vendorUsers.push({
              id: userData.id,
              name: userData.name || 'Unknown Vendor',
              email: userData.email || 'vendor@example.com'
            });
          }
        } catch (error) {
          console.error('Error parsing user data', error);
        }
      }
    }

    if (vendorUsers.length === 0) {
      return [
        { id: 'vendor-1', name: 'Deonroy Mitchell', email: 'deonroy@gmail.com' },
        { id: 'vendor-2', name: 'Roger Blakely', email: 'rogerb@gmail.com' },
        { id: 'vendor-3', name: 'Joe Black', email: 'joeblack@gmail.com' },
        { id: 'vendor-4', name: 'Niche Marshall', email: 'nichemarsh@gmail.com' }
      ];
    }

    return vendorUsers;
  };

  const vendorList = getVendorList();
  
  const defaultValues = {
    vendorId: '',
    vendorName: '',
    vendorEmail: '',
    rate: 15,
    schedule: 'monthly' as const,
    active: true
  };

  const form = useForm<VendorCommission>({
    defaultValues: vendor || defaultValues
  });

  useEffect(() => {
    if (vendor) {
      form.reset(vendor);
    } else {
      form.reset(defaultValues);
    }
  }, [vendor, form]);

  const handleSubmit = (data: VendorCommission) => {
    onSave({
      ...data,
      id: vendor?.id || '',
    });
    form.reset(defaultValues);
  };

  const handleVendorSelect = (vendorId: string) => {
    const selectedVendor = vendorList.find(v => v.id === vendorId);
    if (selectedVendor) {
      form.setValue('vendorId', selectedVendor.id);
      form.setValue('vendorName', selectedVendor.name);
      form.setValue('vendorEmail', selectedVendor.email);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {!isEditing ? (
          <VendorSelectField 
            control={form.control} 
            vendorList={vendorList}
            onVendorSelect={handleVendorSelect}
          />
        ) : (
          <VendorDisplay 
            vendorName={vendor?.vendorName || ''} 
            vendorEmail={vendor?.vendorEmail || ''} 
          />
        )}

        <FeeRateField control={form.control} />
        <PaymentScheduleField control={form.control} />
        
        <FormActions isEditing={isEditing} onCancel={onCancel} />
      </form>
    </Form>
  );
};

export default VendorCommissionForm;
