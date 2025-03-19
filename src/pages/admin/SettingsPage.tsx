
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, Save, Bell, Lock, Store, RefreshCcw } from 'lucide-react';
import ActionButton from '@/components/ui/ActionButton';

const SettingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [notifyNewOrders, setNotifyNewOrders] = useState(true);
  const [notifyOrderStatus, setNotifyOrderStatus] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [storeApproval, setStoreApproval] = useState(true);
  
  // Mock store currency options
  const currencies = [
    { label: 'JMD (J$)', value: 'JMD' },
    { label: 'USD ($)', value: 'USD' }
  ];
  
  const [selectedCurrency, setSelectedCurrency] = useState('JMD');
  
  if (!user?.isAdmin) {
    navigate('/');
    return null;
  }
  
  const handleSaveSettings = () => {
    // In a real app, this would save settings to a database
    toast.success("Settings saved successfully");
  };
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <ActionButton 
          variant="ghost" 
          className="mr-2" 
          icon={<ChevronLeft className="h-4 w-4" />}
          onClick={() => navigate('/admin/dashboard')}
        >
          Back to Dashboard
        </ActionButton>
        <h1 className="text-2xl font-bold">Admin Settings</h1>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure general system settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <p className="text-sm text-gray-500">
                      Enable to make the site inaccessible to regular users
                    </p>
                  </div>
                  <Switch 
                    id="maintenance-mode" 
                    checked={maintenanceMode}
                    onCheckedChange={setMaintenanceMode}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="store-approval">Store Approval Required</Label>
                    <p className="text-sm text-gray-500">
                      Require admin approval for new store registrations
                    </p>
                  </div>
                  <Switch 
                    id="store-approval" 
                    checked={storeApproval}
                    onCheckedChange={setStoreApproval}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <select 
                    id="currency"
                    className="w-full p-2 border rounded-md"
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                  >
                    {currencies.map(currency => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Site Information</CardTitle>
                <CardDescription>Manage basic site information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input id="site-name" defaultValue="JamCart" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="site-description">Site Description</Label>
                  <Textarea 
                    id="site-description" 
                    defaultValue="Order groceries and essentials from your favorite stores in Jamaica"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input 
                    id="contact-email" 
                    type="email"
                    defaultValue="support@jamcart.com"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure admin notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notify-orders">New Order Notifications</Label>
                  <p className="text-sm text-gray-500">
                    Receive notifications when new orders are placed
                  </p>
                </div>
                <Switch 
                  id="notify-orders" 
                  checked={notifyNewOrders}
                  onCheckedChange={setNotifyNewOrders}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notify-status">Order Status Notifications</Label>
                  <p className="text-sm text-gray-500">
                    Receive notifications when order status changes
                  </p>
                </div>
                <Switch 
                  id="notify-status" 
                  checked={notifyOrderStatus}
                  onCheckedChange={setNotifyOrderStatus}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notification-email">Notification Email</Label>
                <Input 
                  id="notification-email" 
                  type="email"
                  defaultValue="admin@jamcart.com"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure account security options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <Lock className="h-4 w-4" />
                  Change Admin Password
                </Button>
              </div>
              
              <div className="space-y-2">
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <RefreshCcw className="h-4 w-4" />
                  Refresh API Keys
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input 
                  id="session-timeout" 
                  type="number"
                  defaultValue="60"
                  min="1"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-end">
        <ActionButton 
          onClick={handleSaveSettings}
          icon={<Save className="h-4 w-4" />}
        >
          Save Settings
        </ActionButton>
      </div>
    </div>
  );
};

export default SettingsPage;
