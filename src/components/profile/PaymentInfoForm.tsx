
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import CustomerLocation from '@/components/order/CustomerLocation';
import { CardInfo } from '@/types/auth.types';

interface PaymentInfoFormProps {
  initialCardData: CardInfo;
  onSubmit: (cardData: CardInfo, location: { lat: number; lng: number } | null) => void;
  userName: string;
}

const PaymentInfoForm = ({ initialCardData, onSubmit, userName }: PaymentInfoFormProps) => {
  const [cardData, setCardData] = useState(initialCardData);
  const [customerLocation, setCustomerLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCardData(prev => ({ ...prev, [id]: value }));
  };

  const handleLocationUpdate = (location: { lat: number; lng: number }) => {
    setCustomerLocation(location);
  };

  const handleSubmit = () => {
    onSubmit(cardData, customerLocation);
  };

  return (
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
      
      <div className="mt-6">
        <div className="mb-2">
          <Label>Your Billing Location</Label>
        </div>
        <CustomerLocation
          customerLocation={customerLocation}
          customerName={userName}
          isLoadingLocation={isLoadingLocation}
          locationError={locationError}
          onLocationUpdate={handleLocationUpdate}
        />
      </div>
      
      <div className="flex justify-end pt-4">
        <Button type="button" onClick={handleSubmit}>
          Save Payment Info
        </Button>
      </div>
    </form>
  );
};

export default PaymentInfoForm;
