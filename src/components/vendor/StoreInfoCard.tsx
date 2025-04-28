import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categories } from '@/utils/order/mockStoreData';
import { Upload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const StoreInfoCard = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [storeData, setStoreData] = useState({
    storeName: user?.storeName || '',
    storeDescription: user?.storeDescription || '',
    storeCategory: user?.storeCategory || '',
    address: user?.address || '',
    town: user?.town || '',
    phone: user?.phone || '',
    storeImage: user?.storeImage || '/placeholder.svg'
  });

  useEffect(() => {
    if (user) {
      setStoreData({
        storeName: user.storeName || '',
        storeDescription: user.storeDescription || '',
        storeCategory: user.storeCategory || '',
        address: user.address || '',
        town: user.town || '',
        phone: user.phone || '',
        storeImage: user.storeImage || '/placeholder.svg'
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setStoreData(prev => ({ ...prev, [id]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setStoreData(prev => ({ ...prev, storeCategory: value }));
  };

  const handleImageSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Simple file validation
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setStoreData(prev => ({ ...prev, storeImage: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateUserProfile({
        ...storeData
      });
      
      toast({
        title: "Store information updated",
        description: "Your store details have been saved successfully",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update store information. Please try again.",
        variant: "destructive"
      });
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card className="overflow-hidden">
          <div className="aspect-[4/3] bg-gray-100 relative">
            <img 
              src={storeData.storeImage} 
              alt={storeData.storeName || "Store"} 
              className="w-full h-full object-cover"
            />
            <Button 
              variant="secondary" 
              size="sm" 
              className="absolute bottom-2 right-2 opacity-90"
              onClick={handleImageSelect}
            >
              <Upload className="h-4 w-4 mr-1" /> Upload
            </Button>
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">
              Recommended image size: 400 x 300 pixels
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="storeName" className="text-sm font-medium">
                Store Name
              </label>
              <Input 
                id="storeName" 
                value={storeData.storeName} 
                onChange={handleChange}
                placeholder="Your store name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="storeCategory" className="text-sm font-medium">
                Category
              </label>
              <Select 
                value={storeData.storeCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(categories).map((key) => (
                    <SelectItem key={key} value={key}>
                      {categories[key as keyof typeof categories].name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="storeDescription" className="text-sm font-medium">
              Store Description
            </label>
            <Textarea 
              id="storeDescription" 
              value={storeData.storeDescription} 
              onChange={handleChange}
              placeholder="Describe your store and what you offer"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                Store Address
              </label>
              <Input 
                id="address" 
                value={storeData.address} 
                onChange={handleChange}
                placeholder="Store address"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="town" className="text-sm font-medium">
                Town/City
              </label>
              <Input 
                id="town" 
                value={storeData.town} 
                onChange={handleChange}
                placeholder="Town or city"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Contact Phone
            </label>
            <Input 
              id="phone" 
              value={storeData.phone} 
              onChange={handleChange}
              placeholder="Contact phone number"
            />
          </div>
          
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default StoreInfoCard;
