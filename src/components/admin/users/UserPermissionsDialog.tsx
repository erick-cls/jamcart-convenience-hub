
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import UserTypeTag from './UserTypeTag';
import { Key, RefreshCw, ShieldAlert } from 'lucide-react';

export interface User {
  id: string;
  name: string;
  email: string;
  dateJoined: string;
  status: string;
  orders: number;
  userType?: 'customer' | 'rider' | 'admin';
}

interface UserPermissionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onStatusChange: (userId: string, isActive: boolean) => void;
  onUserTypeChange?: (userId: string, userType: 'customer' | 'rider' | 'admin') => void;
  onResetPassword?: (userId: string, newPassword: string) => void;
}

const UserPermissionsDialog = ({ 
  isOpen, 
  onClose, 
  user, 
  onStatusChange, 
  onUserTypeChange,
  onResetPassword
}: UserPermissionsDialogProps) => {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(user?.status === 'active');
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'rider' | 'admin'>(user?.userType || 'customer');
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  
  // Reset state when dialog opens with a new user
  React.useEffect(() => {
    if (user) {
      setIsActive(user.status === 'active');
      setUserType(user.userType || 'customer');
      setConfirmationVisible(false);
      setShowPasswordReset(false);
      setNewPassword('');
    }
  }, [user, isOpen]);
  
  const handleStatusToggle = (checked: boolean) => {
    setIsActive(checked);
    if (!checked) {
      // Show confirmation for deactivation
      setConfirmationVisible(true);
    } else {
      setConfirmationVisible(false);
    }
  };
  
  const handleUserTypeChange = (value: string) => {
    setUserType(value as 'customer' | 'rider' | 'admin');
  };
  
  const handleSave = () => {
    if (user) {
      onStatusChange(user.id, isActive);
      
      if (onUserTypeChange) {
        onUserTypeChange(user.id, userType);
      }
      
      if (showPasswordReset && newPassword && onResetPassword) {
        onResetPassword(user.id, newPassword);
      }
      
      toast({
        title: "User settings updated",
        description: `${user.name}'s settings have been updated successfully.`,
      });
      
      onClose();
    }
  };

  const handleTogglePasswordReset = () => {
    setShowPasswordReset(!showPasswordReset);
    if (!showPasswordReset) {
      setNewPassword('');
    }
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(password);
  };
  
  if (!user) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage User Settings</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium text-lg">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-xs text-gray-400">Member since {new Date(user.dateJoined).toLocaleDateString()}</p>
              {user.userType && <UserTypeTag userType={user.userType} />}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="active-status" className="text-base">Active Status</Label>
                <p className="text-sm text-gray-500">Allow user to access the platform</p>
              </div>
              <Switch 
                id="active-status" 
                checked={isActive} 
                onCheckedChange={handleStatusToggle} 
              />
            </div>
            
            {confirmationVisible && (
              <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  Warning: Deactivating this user will prevent them from accessing the platform.
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <Checkbox id="confirm-deactivate" />
                  <Label htmlFor="confirm-deactivate" className="text-sm">
                    I understand the consequences
                  </Label>
                </div>
              </div>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <Label className="text-base">User Type</Label>
            <p className="text-sm text-gray-500 mb-2">Change the user's role in the system</p>
            
            <RadioGroup 
              value={userType} 
              onValueChange={handleUserTypeChange}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="customer" id="r-customer" />
                <Label htmlFor="r-customer">Customer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rider" id="r-rider" />
                <Label htmlFor="r-rider">Rider (Delivery Personnel)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="r-admin" />
                <Label htmlFor="r-admin">Administrator</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base flex items-center">
                  <Key className="h-4 w-4 mr-2" />
                  Password Management
                </Label>
                <p className="text-sm text-gray-500">Reset user's password</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleTogglePasswordReset}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                {showPasswordReset ? 'Cancel' : 'Reset Password'}
              </Button>
            </div>

            {showPasswordReset && (
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100 space-y-3">
                <div className="flex items-start space-x-2">
                  <ShieldAlert className="h-5 w-5 text-blue-500 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    Set a new password for this user. They will not be notified, so you may need to communicate the new password to them.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="new-password" 
                      type="text" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={generateRandomPassword}
                      type="button"
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserPermissionsDialog;
