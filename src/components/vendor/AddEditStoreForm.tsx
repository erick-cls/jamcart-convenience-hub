
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { VendorStore } from '@/types/vendor.types';
import { saveStore } from '@/services/vendor.service';
import { useToast } from '@/hooks/use-toast';

interface AddEditStoreFormProps {
  userId: string;
  store?: VendorStore;
  onCancel: () => void;
  onSubmit: (store: VendorStore) => void;
}

const AddEditStoreForm = ({ userId, store, onCancel, onSubmit }: AddEditStoreFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<VendorStore>>(
    store || {
      name: '',
      description: '',
      category: '',
      address: '',
      commissionRate: 0.15, // Default 15%
      isActive: true
    }
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) / 100;
    setFormData(prev => ({ ...prev, commissionRate: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form
      if (!formData.name || !formData.category || !formData.address) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      const newStore: VendorStore = {
        id: store?.id || `store_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        ownerId: userId,
        name: formData.name!,
        description: formData.description || '',
        category: formData.category!,
        address: formData.address!,
        commissionRate: formData.commissionRate!,
        imageUrl: store?.imageUrl,
        location: formData.location || null,
        createdAt: store?.createdAt || new Date().toISOString(),
        isActive: formData.isActive !== undefined ? formData.isActive : true
      };
      
      // Save the store
      const savedStore = saveStore(newStore);
      onSubmit(savedStore);
    } catch (error) {
      toast({
        title: "Error Saving Store",
        description: "There was a problem saving your store information.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="bg-black border-[#20a64f]/20">
      <CardHeader>
        <CardTitle>{store ? 'Edit Store' : 'Add New Store'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Store Name*</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category*</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-black text-white border border-[#20a64f]/30 rounded-md"
                required
              >
                <option value="">Select Category</option>
                <option value="restaurant">Restaurant</option>
                <option value="grocery">Grocery</option>
                <option value="pharmacy">Pharmacy</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="hardware">Hardware</option>
                <option value="convenience">Convenience Store</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address*</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="commissionRate">Commission Rate (%)</Label>
              <Input
                id="commissionRate"
                type="number"
                min="10"
                max="20"
                value={(formData.commissionRate || 0) * 100}
                onChange={handleRateChange}
              />
              <p className="text-xs text-gray-400">Commission range: 10% - 20%</p>
            </div>
            
            <div className="space-y-2 flex items-end">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="form-checkbox h-5 w-5 text-[#20a64f]"
                />
                <span>Active Store</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-[#20a64f]/30 text-white hover:bg-[#20a64f]/10"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#20a64f] hover:bg-[#20a64f]/80"
            >
              {isSubmitting ? 'Saving...' : store ? 'Update Store' : 'Add Store'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddEditStoreForm;
