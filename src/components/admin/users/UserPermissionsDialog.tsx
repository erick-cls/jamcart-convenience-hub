
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  orders: number;
  userType: 'customer' | 'rider' | 'admin';
}

interface UserPermissionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onStatusChange: (userId: string, isActive: boolean) => void;
  onUserTypeChange: (userId: string, userType: 'customer' | 'rider' | 'admin') => void;
  onResetPassword: (userId: string, newPassword: string) => void;
}

const UserPermissionsDialog = ({
  isOpen,
  onClose,
  user,
  onStatusChange,
  onUserTypeChange,
  onResetPassword
}: UserPermissionsDialogProps) => {
  const [isActive, setIsActive] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'rider' | 'admin'>('customer');
  const [newPassword, setNewPassword] = useState('');
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  
  // Update local state when user changes
  if (user && isOpen) {
    if (isActive !== (user.status === 'active')) {
      setIsActive(user.status === 'active');
    }
    if (userType !== user.userType) {
      setUserType(user.userType);
    }
  }
  
  const handleSave = () => {
    if (user) {
      if (isActive !== (user.status === 'active')) {
        onStatusChange(user.id, isActive);
      }
      
      if (userType !== user.userType) {
        onUserTypeChange(user.id, userType);
      }
      
      if (isResetPasswordOpen && newPassword) {
        onResetPassword(user.id, newPassword);
        setIsResetPasswordOpen(false);
        setNewPassword('');
      }
    }
    
    onClose();
  };
  
  if (!user) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Permissions - {user.name}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Account Status</h3>
              <p className="text-sm text-gray-500">Active accounts can log in and use the system</p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">User Type</h3>
            <RadioGroup value={userType} onValueChange={(value) => setUserType(value as 'customer' | 'rider' | 'admin')}>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="customer" id="customer" />
                <Label htmlFor="customer">Customer</Label>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="rider" id="rider" />
                <Label htmlFor="rider">Rider</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="admin" />
                <Label htmlFor="admin">Admin</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setNewPassword("password123");
              onResetPassword(user.id, "password123");
            }}
            className="sm:mr-auto"
          >
            Reset Password
          </Button>
          
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserPermissionsDialog;
