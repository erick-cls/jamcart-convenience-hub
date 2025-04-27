
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import { useToast } from '@/hooks/use-toast';
import UserInfoCard from '@/components/profile/UserInfoCard';
import AddressManager from '@/components/profile/AddressManager';
import PaymentInfoForm from '@/components/profile/PaymentInfoForm';
import { User } from '@/types/auth.types';

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    town: user?.town || ''
  });

  const [addresses, setAddresses] = useState(
    user?.addresses || [{ type: 'home', address: user?.address || '' }]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserProfile(formData);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePaymentSubmit = async (cardInfo: User['cardInfo'], location: { lat: number; lng: number } | null) => {
    try {
      await updateUserProfile({ cardInfo, location });
      toast({
        title: "Payment Info Updated",
        description: "Your payment information has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update payment information. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddressesUpdate = async () => {
    try {
      await updateUserProfile({ addresses });
      toast({
        title: "Addresses Updated",
        description: "Your addresses have been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update addresses. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    navigate('/auth?mode=login');
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="app-container pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#e6e172]">My Profile</h1>
            <Button 
              variant="outline"
              onClick={() => navigate('/orders')}
              className="text-black hover:bg-[#20a64f] hover:text-white"
            >
              View My Orders
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <UserInfoCard user={user} />
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>Update your profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="mb-4 grid grid-cols-3">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="addresses">Addresses</TabsTrigger>
                    <TabsTrigger value="payment">Payment</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personal">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            value={formData.name} 
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={formData.email} 
                            readOnly 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input 
                            id="phone" 
                            value={formData.phone} 
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="town">Town</Label>
                          <Input 
                            id="town" 
                            value={formData.town} 
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Primary Address</Label>
                        <Textarea 
                          id="address" 
                          value={formData.address} 
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="submit">
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="addresses">
                    <AddressManager 
                      addresses={addresses}
                      onAddressesChange={setAddresses}
                      onSubmit={handleAddressesUpdate}
                    />
                  </TabsContent>
                  
                  <TabsContent value="payment">
                    <PaymentInfoForm
                      initialCardData={user.cardInfo || { cardNumber: '', cardName: '', expiryDate: '', cvv: '' }}
                      onSubmit={handlePaymentSubmit}
                      userName={user.name}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
