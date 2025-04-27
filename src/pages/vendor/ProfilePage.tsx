
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import VendorLayout from '@/components/vendor/VendorLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categories } from '@/utils/order/mockStoreData';

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [storeData, setStoreData] = useState({
    storeName: user?.storeName || '',
    storeDescription: user?.storeDescription || '',
    storeCategory: user?.storeCategory || '',
    address: user?.address || '',
    town: user?.town || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (!user || user.userType !== 'vendor') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setStoreData(prev => ({ ...prev, [id]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setStoreData(prev => ({ ...prev, storeCategory: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateUserProfile({
        ...storeData
      });
      
      toast({
        title: "Profile Updated",
        description: "Your store profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <VendorLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Store Profile</h1>
          <p className="text-gray-600">Manage your store details and information</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="storeName" className="text-sm font-medium">
                    Store Name
                  </label>
                  <Input 
                    id="storeName" 
                    value={storeData.storeName} 
                    onChange={handleChange}
                    placeholder="Your store name"
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
                          {categories[key].name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    rows={4}
                  />
                </div>
                
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
                
                <Button type="submit" className="w-full">
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Store Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-gray-600">Current Status</p>
                <div className="flex items-center mt-2">
                  <span className="inline-block h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                  <span className="font-medium">Active</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Store Category</p>
                <p className="font-medium mt-1">
                  {storeData.storeCategory ? categories[storeData.storeCategory]?.name || storeData.storeCategory : 'Not set'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Joined Date</p>
                <p className="font-medium mt-1">{user?.dateJoined ? new Date(user.dateJoined).toLocaleDateString() : 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="font-medium mt-1">0</p>
              </div>
              
              <Button variant="outline" className="w-full">
                Preview Store
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </VendorLayout>
  );
};

export default ProfilePage;
