
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Wallet, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getRiderWallet, processRiderPayout, toggleEarlyAdopterProgram, isEarlyAdopterProgramActive } from '@/services/wallet.service';
import { RiderWallet } from '@/types/wallet.types';

const RiderWalletManagement = () => {
  const { toast } = useToast();
  const [riders, setRiders] = useState<any[]>([]);
  const [riderWallets, setRiderWallets] = useState<Record<string, RiderWallet>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEarlyAdopterActive, setIsEarlyAdopterActive] = useState(isEarlyAdopterProgramActive());
  const [selectedRiders, setSelectedRiders] = useState<string[]>([]);
  
  // Mock function to get riders - in a real app, this would fetch from the database
  const fetchRiders = () => {
    // This is mock data - in a real implementation this would come from your backend
    return [
      { id: 'rider1', name: 'John Doe', isActive: true, dateJoined: '2025-01-15', deliveries: 23 },
      { id: 'rider2', name: 'Sarah Smith', isActive: true, dateJoined: '2025-02-20', deliveries: 15 },
      { id: 'rider3', name: 'Michael Brown', isActive: false, dateJoined: '2025-03-10', deliveries: 8 },
      { id: 'rider4', name: 'Jessica Wilson', isActive: true, dateJoined: '2025-04-05', deliveries: 11 }
    ];
  };
  
  useEffect(() => {
    const loadedRiders = fetchRiders();
    setRiders(loadedRiders);
    
    // Load rider wallets
    const wallets: Record<string, RiderWallet> = {};
    loadedRiders.forEach(rider => {
      wallets[rider.id] = getRiderWallet(rider.id);
    });
    setRiderWallets(wallets);
  }, []);
  
  const handleSelectRider = (riderId: string) => {
    setSelectedRiders(prev => {
      if (prev.includes(riderId)) {
        return prev.filter(id => id !== riderId);
      } else {
        return [...prev, riderId];
      }
    });
  };
  
  const handleSelectAll = () => {
    if (selectedRiders.length === riders.length) {
      setSelectedRiders([]);
    } else {
      setSelectedRiders(riders.map(r => r.id));
    }
  };
  
  const handleProcessPayout = async () => {
    if (selectedRiders.length === 0) {
      toast({
        title: "No riders selected",
        description: "Please select at least one rider to process payouts.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const updatedWallets: Record<string, RiderWallet> = {...riderWallets};
      
      // Process payout for each selected rider
      selectedRiders.forEach(riderId => {
        updatedWallets[riderId] = processRiderPayout(riderId);
      });
      
      setRiderWallets(updatedWallets);
      
      toast({
        title: "Payouts processed",
        description: `Successfully processed payouts for ${selectedRiders.length} riders.`,
        variant: "default",
      });
      
      // Clear selections after successful payout
      setSelectedRiders([]);
    } catch (error) {
      toast({
        title: "Error processing payouts",
        description: "There was a problem processing the rider payouts.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleEarlyAdopterProgram = (checked: boolean) => {
    toggleEarlyAdopterProgram(checked);
    setIsEarlyAdopterActive(checked);
    
    toast({
      title: checked ? "Program activated" : "Program deactivated",
      description: checked 
        ? "Early adopter bonus program is now active." 
        : "Early adopter bonus program has been deactivated.",
      variant: "default",
    });
  };
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wallet className="h-5 w-5 mr-2" /> Rider Wallet Management
        </CardTitle>
        <CardDescription>
          Process payouts and manage rider bonus programs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <Switch
              id="early-adopter"
              checked={isEarlyAdopterActive}
              onCheckedChange={handleToggleEarlyAdopterProgram}
            />
            <Label htmlFor="early-adopter" className="ml-2">
              Early Adopter Bonus Program ($550 JMD after 10 deliveries)
            </Label>
          </div>
          <div className={`${isEarlyAdopterActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} px-3 py-1 rounded-full text-xs font-semibold`}>
            {isEarlyAdopterActive ? 'Active' : 'Inactive'}
          </div>
        </div>
        
        <div className="rounded-md border mb-6">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 mr-2"
                  checked={selectedRiders.length === riders.length && riders.length > 0}
                  onChange={handleSelectAll}
                />
                <span className="font-medium">Select All Riders</span>
              </div>
              <Button 
                onClick={handleProcessPayout}
                disabled={selectedRiders.length === 0 || isLoading}
                size="sm"
              >
                Process Selected Payouts
              </Button>
            </div>
          </div>
          
          <div className="divide-y">
            {riders.map(rider => {
              const wallet = riderWallets[rider.id];
              const hasFunds = wallet && wallet.balance > 0;
              
              return (
                <div key={rider.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 mr-3"
                      checked={selectedRiders.includes(rider.id)}
                      onChange={() => handleSelectRider(rider.id)}
                    />
                    <div>
                      <p className="font-medium">{rider.name}</p>
                      <p className="text-sm text-gray-500">
                        Joined: {new Date(rider.dateJoined).toLocaleDateString()}{' '}
                        • Deliveries: {rider.deliveries}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="text-right mr-4">
                      <p className="text-sm font-medium">Balance:</p>
                      <p className={`text-lg font-bold ${hasFunds ? 'text-green-600' : 'text-gray-400'}`}>
                        ${wallet?.balance.toFixed(2) || '0.00'} JMD
                      </p>
                    </div>
                    
                    {wallet?.isEarlyAdopter && isEarlyAdopterActive && (
                      <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        {wallet.bonusPaid ? 
                          <span className="flex items-center"><Check className="h-3 w-3 mr-1" /> Bonus Paid</span> : 
                          <span>{wallet.deliveryCount}/10 Deliveries</span>
                        }
                      </div>
                    )}
                    
                    <div className={`ml-2 w-3 h-3 rounded-full ${rider.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  </div>
                </div>
              );
            })}
            
            {riders.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p>No riders found</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
          <p className="font-medium mb-1">About Rider Payouts</p>
          <p>Payouts process the entire current balance for selected riders. Riders will be notified via email when their payout is processed.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiderWalletManagement;
