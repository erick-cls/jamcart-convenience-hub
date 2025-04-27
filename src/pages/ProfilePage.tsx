
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import { useToast } from '@/hooks/use-toast';
import UserInfoCard from '@/components/profile/UserInfoCard';
import ProfileTabs from '@/components/profile/ProfileTabs';
import { User } from '@/types/auth.types';

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!user) {
    navigate('/auth?mode=login');
    return null;
  }

  const handleProfileUpdate = async (data: Partial<User>) => {
    try {
      await updateUserProfile(data);
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
      await updateUserProfile({ addresses: user.addresses });
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
                <ProfileTabs 
                  user={user}
                  onProfileUpdate={handleProfileUpdate}
                  onPaymentSubmit={handlePaymentSubmit}
                  onAddressesUpdate={handleAddressesUpdate}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
