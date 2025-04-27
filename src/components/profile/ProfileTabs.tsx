
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileForm from './ProfileForm';
import AddressManager from './AddressManager';
import PaymentInfoForm from './PaymentInfoForm';
import { CardInfo, User } from '@/types/auth.types';

interface ProfileTabsProps {
  user: User;
  onProfileUpdate: (data: Partial<User>) => Promise<void>;
  onPaymentSubmit: (cardData: CardInfo, location: { lat: number; lng: number } | null) => Promise<void>;
  onAddressesUpdate: () => Promise<void>;
}

const ProfileTabs = ({ 
  user, 
  onProfileUpdate, 
  onPaymentSubmit,
  onAddressesUpdate 
}: ProfileTabsProps) => {
  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="mb-4 grid grid-cols-3">
        <TabsTrigger value="personal">Personal Info</TabsTrigger>
        <TabsTrigger value="addresses">Addresses</TabsTrigger>
        <TabsTrigger value="payment">Payment</TabsTrigger>
      </TabsList>
      
      <TabsContent value="personal">
        <ProfileForm 
          user={user} 
          onSubmit={onProfileUpdate}
        />
      </TabsContent>
      
      <TabsContent value="addresses">
        <AddressManager 
          addresses={user.addresses || []}
          onAddressesChange={addresses => onProfileUpdate({ addresses })}
          onSubmit={onAddressesUpdate}
        />
      </TabsContent>
      
      <TabsContent value="payment">
        <PaymentInfoForm
          initialCardData={user.cardInfo || { cardNumber: '', cardName: '', expiryDate: '', cvv: '' }}
          onSubmit={onPaymentSubmit}
          userName={user.name}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
