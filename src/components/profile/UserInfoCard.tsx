
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from '@/types/auth.types';
import UserTypeTag from '@/components/admin/users/UserTypeTag';

interface UserInfoCardProps {
  user: User;
}

const UserInfoCard = ({ user }: UserInfoCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const formatCardNumber = (cardNumber: string) => {
    if (!cardNumber) return '';
    const lastFourDigits = cardNumber.slice(-4);
    return `•••• •••• •••• ${lastFourDigits}`;
  };

  return (
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
          <UserTypeTag userType={user.userType} />
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
  );
};

export default UserInfoCard;
