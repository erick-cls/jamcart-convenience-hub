
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import UserOrdersList from '@/components/user/UserOrdersList';
import { useOrdersState, Order } from '@/pages/admin/orders/useOrdersState';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getUserOrders } = useOrdersState();
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/auth?mode=login');
    } else {
      // Get orders for the current user
      setUserOrders(getUserOrders(user.id));
    }
  }, [user, navigate, getUserOrders]);

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="app-container pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile Details</TabsTrigger>
              <TabsTrigger value="orders">My Orders</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Info Card */}
                <Card className="lg:col-span-1">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <Avatar className="h-24 w-24">
                        <AvatarFallback className="bg-jamcart-red text-white text-xl">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <CardTitle>{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-gray-500">Account Type</span>
                      <span className="font-medium">{user.isAdmin ? 'Admin' : (user.isRider ? 'Rider' : 'Customer')}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-gray-500">Phone</span>
                      <span className="font-medium">{user.phone}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-gray-500">Address</span>
                      <span className="font-medium">{user.address}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-500">Town</span>
                      <span className="font-medium">{user.town}</span>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Profile Details Form */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>Update your profile information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" defaultValue={user.name} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue={user.email} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" defaultValue={user.phone} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="town">Town</Label>
                          <Input id="town" defaultValue={user.town} />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea id="address" defaultValue={user.address} />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={() => alert('Profile update would be implemented here')}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>My Orders</CardTitle>
                  <CardDescription>View and track your order history</CardDescription>
                </CardHeader>
                <CardContent>
                  <UserOrdersList orders={userOrders} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
