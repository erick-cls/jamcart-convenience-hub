
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, MapPin, CreditCard, Plus, Trash2, Save, Map } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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

  const [cardData, setCardData] = useState({
    cardNumber: user?.cardInfo?.cardNumber || '',
    cardName: user?.cardInfo?.cardName || '',
    expiryDate: user?.cardInfo?.expiryDate || '',
    cvv: user?.cardInfo?.cvv || '',
  });

  const [addresses, setAddresses] = useState(
    user?.addresses || [{ type: 'home', address: user?.address || '' }]
  );

  const [selectedAddressType, setSelectedAddressType] = useState('home');
  const [newAddress, setNewAddress] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCardData(prev => ({ ...prev, [id]: value }));
  };

  const handleAddNewAddress = () => {
    if (!newAddress.trim()) return;
    
    const newAddressObj = {
      type: selectedAddressType,
      address: newAddress
    };
    
    const updatedAddresses = [...addresses, newAddressObj];
    setAddresses(updatedAddresses);
    setNewAddress('');

    // Update user with new addresses
    updateUserProfile({ addresses: updatedAddresses });
  };

  const handleRemoveAddress = (index: number) => {
    const updatedAddresses = [...addresses];
    updatedAddresses.splice(index, 1);
    setAddresses(updatedAddresses);
    
    // Update user with new addresses
    updateUserProfile({ addresses: updatedAddresses });
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationString = `Lat: ${position.coords.latitude.toFixed(6)}, Long: ${position.coords.longitude.toFixed(6)}`;
          setNewAddress(locationString);
          setSelectedAddressType('current');
          
          toast({
            title: "Location Retrieved",
            description: "Your current location has been added.",
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to retrieve your location. Please check your permissions.",
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateUserProfile({
        ...formData,
        cardInfo: cardData,
        addresses
      });
      
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Format card number to show only last 4 digits
  const formatCardNumber = (cardNumber: string) => {
    if (!cardNumber) return '';
    const lastFourDigits = cardNumber.slice(-4);
    return `•••• •••• •••• ${lastFourDigits}`;
  };

  if (!user) {
    navigate('/auth?mode=login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="app-container pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <Button 
              variant="outline"
              onClick={() => navigate('/orders')}
            >
              View My Orders
            </Button>
          </div>
          
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
                  <span className="text-gray-500">Primary Address</span>
                  <span className="font-medium">{user.address}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-500">Town</span>
                  <span className="font-medium">{user.town}</span>
                </div>
                {user.cardInfo && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center mb-2">
                      <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Payment Info</span>
                    </div>
                    <div className="text-sm">
                      <div className="flex justify-between py-1">
                        <span className="text-gray-500">Card</span>
                        <span>{formatCardNumber(user.cardInfo.cardNumber)}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-500">Name</span>
                        <span>{user.cardInfo.cardName}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-500">Expires</span>
                        <span>{user.cardInfo.expiryDate}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Profile Details Form */}
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
                    <div className="space-y-6">
                      {/* Display existing addresses */}
                      {addresses.map((address, index) => (
                        <div key={index} className="flex items-start border rounded-md p-3 bg-gray-50">
                          <div className="flex-grow">
                            <div className="flex items-center mb-1">
                              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="font-medium capitalize">{address.type} Address</span>
                            </div>
                            <p className="text-sm text-gray-700">{address.address}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveAddress(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                      
                      {/* Add new address */}
                      <div className="border rounded-md p-4">
                        <h3 className="text-sm font-medium mb-3 flex items-center">
                          <Plus className="h-4 w-4 mr-1" /> Add New Address
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Address Type</Label>
                            <RadioGroup 
                              defaultValue="home" 
                              value={selectedAddressType}
                              onValueChange={setSelectedAddressType}
                              className="flex flex-row space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="home" id="address-home" />
                                <Label htmlFor="address-home">Home</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="office" id="address-office" />
                                <Label htmlFor="address-office">Office</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="other" id="address-other" />
                                <Label htmlFor="address-other">Other</Label>
                              </div>
                            </RadioGroup>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="new-address">Address</Label>
                            <div className="flex space-x-2">
                              <Textarea 
                                id="new-address"
                                value={newAddress}
                                onChange={(e) => setNewAddress(e.target.value)}
                                placeholder="Enter your address"
                                className="flex-grow"
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-between">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleUseCurrentLocation}
                              className="flex items-center"
                            >
                              <Map className="h-4 w-4 mr-2" />
                              Use Current Location
                            </Button>
                            
                            <Button
                              type="button"
                              onClick={handleAddNewAddress}
                              disabled={!newAddress.trim()}
                            >
                              Add Address
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-4">
                        <Button 
                          onClick={handleSubmit}
                          className="flex items-center"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save All Changes
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="payment">
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input 
                          id="cardNumber" 
                          value={cardData.cardNumber} 
                          onChange={handleCardChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength={16}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input 
                          id="cardName" 
                          value={cardData.cardName} 
                          onChange={handleCardChange}
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input 
                            id="expiryDate" 
                            value={cardData.expiryDate} 
                            onChange={handleCardChange}
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input 
                            id="cvv" 
                            value={cardData.cvv} 
                            onChange={handleCardChange}
                            placeholder="•••"
                            type="password"
                            maxLength={4}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-4">
                        <Button onClick={handleSubmit}>
                          Save Payment Info
                        </Button>
                      </div>
                    </form>
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
