
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import { useToast } from '@/hooks/use-toast';
import { 
  getVendorStores, 
  getVendorStats, 
  uploadStoreImage 
} from '@/services/vendor.service';
import { useOrdersState } from '@/pages/admin/orders/useOrdersState';
import { VendorStore } from '@/types/vendor.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import StoreDetails from '@/components/vendor/StoreDetails';
import OrdersStats from '@/components/vendor/OrdersStats';
import PaymentHistory from '@/components/vendor/PaymentHistory';
import AddEditStoreForm from '@/components/vendor/AddEditStoreForm';
import StoreImageUpload from '@/components/vendor/StoreImageUpload';

const VendorDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getUserOrders } = useOrdersState();
  const [stores, setStores] = useState<VendorStore[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [isAddingStore, setIsAddingStore] = useState(false);
  const [isEditingStore, setIsEditingStore] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  useEffect(() => {
    if (!user) {
      navigate('/auth?mode=login');
      return;
    }
    
    const vendorStores = getVendorStores(user.id);
    setStores(vendorStores);
    
    if (vendorStores.length > 0 && !selectedStoreId) {
      setSelectedStoreId(vendorStores[0].id);
    }
  }, [user, selectedStoreId, navigate]);
  
  const handleStoreChange = (storeId: string) => {
    setSelectedStoreId(storeId);
    setActiveTab('details');
  };
  
  const handleAddStore = () => {
    setIsAddingStore(true);
    setActiveTab('details');
  };
  
  const handleEditStore = () => {
    setIsEditingStore(true);
  };
  
  const handleStoreFormCancel = () => {
    setIsAddingStore(false);
    setIsEditingStore(false);
  };
  
  const handleStoreFormSubmit = (updatedStore: VendorStore) => {
    // Reload the stores list
    const updatedStores = getVendorStores(user!.id);
    setStores(updatedStores);
    
    // Select the newly created store
    if (isAddingStore) {
      setSelectedStoreId(updatedStore.id);
    }
    
    setIsAddingStore(false);
    setIsEditingStore(false);
    
    toast({
      title: isAddingStore ? "Store Added" : "Store Updated",
      description: `${updatedStore.name} has been ${isAddingStore ? 'added' : 'updated'} successfully.`,
    });
  };
  
  const handleImageUpload = async (file: File) => {
    if (!selectedStoreId) return;
    
    setIsUploading(true);
    
    try {
      const result = await uploadStoreImage(selectedStoreId, file);
      
      if (result.success) {
        // Refresh stores list
        const updatedStores = getVendorStores(user!.id);
        setStores(updatedStores);
        
        toast({
          title: "Image Uploaded",
          description: "Your store image has been updated successfully.",
        });
      } else {
        toast({
          title: "Upload Failed",
          description: result.error || "There was an error uploading your image.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred during upload.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const selectedStore = stores.find(store => store.id === selectedStoreId);
  const allOrders = user ? getUserOrders(user.id) : [];
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="app-container pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#e6e172]">Vendor Dashboard</h1>
            <Button 
              onClick={handleAddStore}
              className="bg-[#20a64f] hover:bg-[#20a64f]/80"
            >
              Add New Store
            </Button>
          </div>
          
          {stores.length === 0 && !isAddingStore ? (
            <Card className="bg-black border-[#20a64f]/20">
              <CardContent className="pt-6 text-center">
                <p className="mb-4">You don't have any stores yet.</p>
                <Button 
                  onClick={handleAddStore}
                  className="bg-[#20a64f] hover:bg-[#20a64f]/80"
                >
                  Add Your First Store
                </Button>
              </CardContent>
            </Card>
          ) : isAddingStore ? (
            <AddEditStoreForm 
              userId={user.id}
              onCancel={handleStoreFormCancel}
              onSubmit={handleStoreFormSubmit}
            />
          ) : isEditingStore && selectedStore ? (
            <AddEditStoreForm 
              userId={user.id}
              store={selectedStore}
              onCancel={handleStoreFormCancel}
              onSubmit={handleStoreFormSubmit}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Card className="bg-black border-[#20a64f]/20 lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-white">My Stores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stores.map(store => (
                      <div 
                        key={store.id} 
                        onClick={() => handleStoreChange(store.id)}
                        className={`p-3 rounded-md cursor-pointer ${selectedStoreId === store.id 
                          ? 'bg-[#20a64f]/20 border border-[#20a64f]/40' 
                          : 'bg-[#20a64f]/5 hover:bg-[#20a64f]/10'}`}
                      >
                        <h3 className="font-medium text-white">{store.name}</h3>
                        <p className="text-sm text-white/70">{store.category}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {selectedStore && (
                <Card className="bg-black border-[#20a64f]/20 lg:col-span-3">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">{selectedStore.name}</CardTitle>
                      <Button 
                        onClick={handleEditStore}
                        variant="outline"
                        className="border-[#20a64f]/30 text-white hover:bg-[#20a64f]/10"
                      >
                        Edit Store
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="w-full grid grid-cols-3 bg-[#20a64f]/10 mb-6">
                        <TabsTrigger value="details">Store Details</TabsTrigger>
                        <TabsTrigger value="orders">Orders & Stats</TabsTrigger>
                        <TabsTrigger value="payments">Payments</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="details">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <StoreDetails store={selectedStore} />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium mb-4">Store Image</h3>
                            <StoreImageUpload 
                              store={selectedStore} 
                              onUpload={handleImageUpload} 
                              isUploading={isUploading}
                            />
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="orders">
                        <OrdersStats 
                          store={selectedStore} 
                          allOrders={allOrders} 
                        />
                      </TabsContent>
                      
                      <TabsContent value="payments">
                        <PaymentHistory 
                          storeId={selectedStore.id} 
                          commissionRate={selectedStore.commissionRate}
                        />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboardPage;
