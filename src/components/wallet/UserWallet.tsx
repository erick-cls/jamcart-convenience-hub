import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RotateCw, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getUserWallet, loadFunds } from '@/services/wallet.service';
import { UserWallet as UserWalletType } from '@/types/wallet.types';
import { useToast } from '@/hooks/use-toast';

const formatCurrency = (value: number): string => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

interface UserWalletProps {
  onReload?: () => void;
}

const UserWallet = ({ onReload }: UserWalletProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wallet, setWallet] = useState<UserWalletType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadAmount, setLoadAmount] = useState<number>(1000);
  const [showTransactions, setShowTransactions] = useState(false);
  
  useEffect(() => {
    if (user) {
      const userWallet = getUserWallet(user.id);
      setWallet(userWallet);
    }
  }, [user]);
  
  const handleReload = () => {
    if (!user || !wallet) return;
    
    setIsLoading(true);
    
    try {
      const updatedWallet = loadFunds(user.id, loadAmount);
      setWallet(updatedWallet);
      
      toast({
        title: "Funds added",
        description: `$${loadAmount.toFixed(2)} JMD has been added to your wallet.`,
        variant: "default",
      });
      
      if (onReload) {
        onReload();
      }
    } catch (error) {
      toast({
        title: "Error adding funds",
        description: "There was a problem adding funds to your wallet.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user || !wallet) {
    return (
      <Card className="bg-black border-[#20a64f]/20 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-10">
            <Clock className="h-8 w-8 animate-spin text-[#e6e172]" />
            <p className="ml-2">Loading wallet...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-black border-[#20a64f]/20 text-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#e6e172] flex items-center">
              <img 
                src="/lovable-uploads/427c4be6-ee47-4e3f-a29f-ef0152361fad.png" 
                alt="JAMWallet" 
                className="h-16 w-auto mr-2"
              />
            </CardTitle>
            <CardDescription className="text-white">
              Earn and manage your cashback
            </CardDescription>
          </div>
          <div className="bg-[#20a64f]/10 px-4 py-2 rounded-md">
            <p className="text-xs text-white mb-1">Cash Back Rate</p>
            <p className="text-xl font-bold text-[#e6e172]">{(wallet.cashbackRate * 100).toFixed(0)}%</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-[#20a64f]/10 px-6 py-4 rounded-md mb-6">
          <p className="text-sm text-white mb-1">Current Balance</p>
          <p className="text-3xl font-bold text-[#e6e172]">
            ${formatCurrency(wallet.balance)} <span className="text-sm text-white">JMD</span>
          </p>
          <p className="text-xs text-white mt-2">
            Last updated: {new Date(wallet.lastUpdated).toLocaleDateString()}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm text-white mb-2 block">Reload Amount (JMD)</label>
            <select 
              className="w-full px-4 py-2 bg-black text-white border border-[#20a64f]/30 rounded-md"
              value={loadAmount}
              onChange={(e) => setLoadAmount(Number(e.target.value))}
            >
              <option value={500}>$500</option>
              <option value={1000}>$1,000</option>
              <option value={2000}>$2,000</option>
              <option value={5000}>$5,000</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button 
              onClick={handleReload}
              disabled={isLoading}
              className="w-full bg-[#20a64f] hover:bg-[#20a64f]/80 text-white"
            >
              {isLoading ? (
                <>
                  <RotateCw className="h-4 w-4 mr-2 animate-spin" /> 
                  Processing...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" /> 
                  Add Funds
                </>
              )}
            </Button>
          </div>
        </div>
        
        <Button
          variant="outline"
          className="w-full border-[#20a64f]/30 text-white hover:bg-[#20a64f]/10"
          onClick={() => setShowTransactions(!showTransactions)}
        >
          {showTransactions ? "Hide" : "View"} Transaction History
        </Button>
        
        {showTransactions && wallet.transactions.length > 0 && (
          <div className="mt-4 max-h-80 overflow-y-auto">
            <h3 className="text-md font-medium mb-2 text-white">Recent Transactions</h3>
            <div className="space-y-2">
              {wallet.transactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="bg-[#20a64f]/5 border border-[#20a64f]/10 rounded-md p-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white">{transaction.description}</span>
                    <span className={`font-medium ${transaction.amount >= 0 ? 'text-[#e6e172]' : 'text-red-400'}`}>
                      {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toFixed(2)} JMD
                    </span>
                  </div>
                  <div className="text-xs text-white/60 mt-1">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {showTransactions && wallet.transactions.length === 0 && (
          <div className="mt-4 bg-[#20a64f]/5 border border-[#20a64f]/10 rounded-md p-6 text-center">
            <p className="text-white/60">No transactions yet</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-white/60 justify-center border-t border-[#20a64f]/10 pt-4">
        <span style={{ color: '#009c3b' }}>Earn cashback on every order you place with JAMCart!</span>
      </CardFooter>
    </Card>
  );
};

export default UserWallet;
