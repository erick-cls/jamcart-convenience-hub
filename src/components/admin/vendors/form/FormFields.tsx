import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const FeeRateField = ({ control }: { control: any }) => (
  <FormField
    control={control}
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
);

export const VendorSelectField = ({ 
  control, 
  vendorList,
  onVendorSelect 
}: { 
  control: any; 
  vendorList: any[];
  onVendorSelect: (vendorId: string) => void;
}) => (
  <FormField
    control={control}
    name="vendorId"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Select Vendor</FormLabel>
        <Select 
          onValueChange={(value) => {
            field.onChange(value);
            onVendorSelect(value);
          }}
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
);

export const PaymentScheduleField = ({ control }: { control: any }) => (
  <FormField
    control={control}
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
);
