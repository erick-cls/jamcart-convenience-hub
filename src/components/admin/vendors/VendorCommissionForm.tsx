import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { VendorCommission } from '@/types/vendor.types';

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
  // Get all vendors from localStorage for the dropdown
  const getVendorList = () => {
    const vendorUsers: { id: string; name: string; email: string }[] = [];
    
    // Try to find all users in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('jamcart-user-')) {
        try {
          const userData = JSON.parse(localStorage.getItem(key) || '{}');
          if (userData.userType === 'vendor') {
            // This is a vendor
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

    // If no vendors found, add the default ones
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
    schedule: 'monthly' as 'weekly' | 'bi-monthly' | 'monthly',
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
      id: vendor?.id || '', // ID will be set in parent if new
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
        {!isEditing && (
          <FormField
            control={form.control}
            name="vendorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Vendor</FormLabel>
                <Select 
                  onValueChange={(value) => handleVendorSelect(value)}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a vendor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vendorList.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name} ({vendor.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {isEditing && (
          <div className="space-y-2">
            <p className="font-medium">{vendor?.vendorName}</p>
            <p className="text-sm text-gray-500">{vendor?.vendorEmail}</p>
          </div>
        )}

        <FormField
          control={form.control}
          name="rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fee Rate (%)</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Input
                    type="number"
                    min="10"
                    max="20"
                    step="0.5"
                    {...field}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (value < 10) field.onChange(10);
                      else if (value > 20) field.onChange(20);
                      else field.onChange(value);
                    }}
                  />
                  <span className="ml-2">%</span>
                </div>
              </FormControl>
              <p className="text-xs text-gray-500">Fee rate must be between 10% and 20%</p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="schedule"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Payment Schedule</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly">Weekly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bi-monthly" id="bi-monthly" />
                    <Label htmlFor="bi-monthly">Bi-Monthly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly">Monthly</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? 'Update' : 'Save'} Fee
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VendorCommissionForm;
