
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import UserPermissionsDialog, { User } from '@/components/admin/users/UserPermissionsDialog';
import { Trash2, UserPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import NewUsersCard from '@/components/admin/users/NewUsersCard';
import UsersFilters from '@/components/admin/users/UsersFilters';
import UsersTable from '@/components/admin/users/UsersTable';

const generateRandomUser = (): User & { isNew: boolean; dateJoined: string } => {
  const userTypes = ['customer', 'customer', 'customer', 'rider', 'admin'] as const;
  const userType = userTypes[Math.floor(Math.random() * userTypes.length)];
  const now = new Date();
  
  return {
    id: `user-${now.getTime()}`,
    name: `New ${userType.charAt(0).toUpperCase() + userType.slice(1)}`,
    email: `new.${userType}${now.getTime()}@example.com`,
    dateJoined: now.toISOString(),
    status: 'active',
    orders: 0,
    userType: userType,
    isNew: true
  };
};

const mockUsers = [
  { 
    id: 'user-1', 
    name: 'John Doe', 
    email: 'john.doe@example.com', 
    dateJoined: '2023-06-10T14:30:00', 
    status: 'active', 
    orders: 12,
    userType: 'customer' as const,
    isNew: true
  },
  { 
    id: 'user-2', 
    name: 'Jane Smith', 
    email: 'jane.smith@example.com', 
    dateJoined: '2023-06-09T10:15:00', 
    status: 'active', 
    orders: 8,
    userType: 'customer' as const,
    isNew: false
  },
  { 
    id: 'user-3', 
    name: 'Robert Johnson', 
    email: 'robert.j@example.com', 
    dateJoined: '2023-06-08T16:45:00', 
    status: 'inactive', 
    orders: 3,
    userType: 'customer' as const,
    isNew: false
  },
  { 
    id: 'user-4', 
    name: 'Maria Garcia', 
    email: 'maria.g@example.com', 
    dateJoined: '2023-06-07T09:30:00', 
    status: 'active', 
    orders: 5,
    userType: 'customer' as const,
    isNew: true
  },
  { 
    id: 'rider-1', 
    name: 'John Rider', 
    email: 'rider@jamcart.com', 
    dateJoined: '2023-05-15T11:30:00', 
    status: 'active', 
    orders: 42,
    userType: 'rider' as const,
    isNew: false
  },
  { 
    id: 'admin-1', 
    name: 'Erickson Villeta', 
    email: 'ericksonvilleta@gmail.com', 
    dateJoined: '2023-01-01T09:00:00', 
    status: 'active', 
    orders: 0,
    userType: 'admin' as const,
    isNew: false
  },
];

const UsersPage = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<(User & { isNew?: boolean; dateJoined: string })[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("user123");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userTypeFilter, setUserTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const allRegisteredUsers: (User & { isNew?: boolean; dateJoined: string })[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('jamcart-user-')) {
        try {
          const userData = JSON.parse(localStorage.getItem(key) || '{}');
          const userForDisplay: User & { isNew?: boolean; dateJoined: string } = {
            id: userData.id || `reg-${Date.now()}`,
            name: userData.name || 'Unknown User',
            email: userData.email || 'unknown@example.com',
            status: 'active',
            orders: 0,
            userType: userData.userType || (userData.isRider ? 'rider' : (userData.isAdmin ? 'admin' : 'customer')),
            dateJoined: userData.dateJoined || new Date().toISOString(),
            isNew: true
          };
          allRegisteredUsers.push(userForDisplay);
        } catch (error) {
          console.error('Error parsing user data', error);
        }
      }
    }
    
    const mainUserData = localStorage.getItem('jamcart-user');
    if (mainUserData) {
      try {
        const userData = JSON.parse(mainUserData);
        if (!allRegisteredUsers.some(u => u.email === userData.email)) {
          const userForDisplay: User & { isNew?: boolean; dateJoined: string } = {
            id: userData.id || `main-${Date.now()}`,
            name: userData.name || 'Current User',
            email: userData.email || 'current@example.com',
            status: 'active',
            orders: 0,
            userType: userData.userType || (userData.isRider ? 'rider' : (userData.isAdmin ? 'admin' : 'customer')),
            dateJoined: userData.dateJoined || new Date().toISOString(),
            isNew: true
          };
          allRegisteredUsers.push(userForDisplay);
        }
      } catch (error) {
        console.error('Error parsing main user data', error);
      }
    }

    const newUser = generateRandomUser();
    
    const combinedUsers = [...allRegisteredUsers];
    
    mockUsers.forEach(mockUser => {
      if (!combinedUsers.some(u => u.email === mockUser.email)) {
        combinedUsers.push(mockUser);
      }
    });
    
    combinedUsers.unshift(newUser);
    
    setUsers(combinedUsers);
    
    setTimeout(() => {
      const johnDoe = mockUsers.find(user => user.email === 'john.doe@example.com');
      if (johnDoe) {
        handleResetPassword(johnDoe.id, 'user123');
      }
    }, 1000);
  }, []);

  const handleManagePermissions = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };
  
  const handleStatusChange = (userId: string, isActive: boolean) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, status: isActive ? 'active' : 'inactive' }
          : user
      )
    );
  };

  const handleUserTypeChange = (userId: string, userType: 'customer' | 'rider' | 'admin') => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, userType }
          : user
      )
    );
  };

  const handleResetPassword = (userId: string, newPassword: string) => {
    console.log(`Password for user ${userId} reset to: ${newPassword}`);
    
    const userEmail = users.find(u => u.id === userId)?.email;
    if (userEmail) {
      localStorage.setItem(`jamcart-password-${userEmail}`, newPassword);
    }
    
    const user = users.find(u => u.id === userId);
    if (user) {
      toast({
        title: "Password Reset",
        description: `Password for ${user.name} has been reset${newPassword === 'user123' ? ' to "user123"' : ''}.`,
      });
    }
  };
  
  const handleShowResetDialog = (user: User) => {
    setSelectedUser(user);
    setIsResetPasswordDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  const handleAddTestUser = () => {
    const newUser = generateRandomUser();
    setUsers(prevUsers => [newUser, ...prevUsers]);
    
    const key = `jamcart-user-${newUser.id}`;
    localStorage.setItem(key, JSON.stringify({
      ...newUser,
      isVerified: true,
      isAdmin: newUser.userType === 'admin',
      isRider: newUser.userType === 'rider',
      dateJoined: new Date().toISOString()
    }));
    
    toast({
      title: "New User Added",
      description: `${newUser.name} has signed up as a ${newUser.userType}.`,
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const newUsers = users.filter(user => {
    const joinDate = new Date(user.dateJoined);
    return joinDate >= today || user.isNew;
  });

  const filteredUsers = users.filter(user => {
    const matchesUserType = userTypeFilter === 'all' || user.userType === userTypeFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesUserType && matchesStatus;
  });

  const handleSelectUser = (userId: string, checked: boolean) => {
    setSelectedUsers(prev => 
      checked ? [...prev, userId] : prev.filter(id => id !== userId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedUsers(checked ? filteredUsers.map(user => user.id) : []);
  };

  const handleDeleteSelected = () => {
    // Remove selected users from localStorage
    selectedUsers.forEach(userId => {
      const userToDelete = users.find(u => u.id === userId);
      if (userToDelete) {
        // Remove from localStorage
        localStorage.removeItem(`jamcart-user-${userId}`);
        if (userToDelete.email) {
          localStorage.removeItem(`jamcart-password-${userToDelete.email}`);
        }
      }
    });

    setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
    setSelectedUsers([]);
    toast({
      title: "Users Deleted",
      description: `${selectedUsers.length} users have been deleted.`,
    });
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    if (userToDelete) {
      // Remove from localStorage
      localStorage.removeItem(`jamcart-user-${userId}`);
      if (userToDelete.email) {
        localStorage.removeItem(`jamcart-password-${userToDelete.email}`);
      }
    }

    setUsers(prev => prev.filter(user => user.id !== userId));
    toast({
      title: "User Deleted",
      description: "The user has been deleted successfully.",
    });
  };

  return (
    <div className="py-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">User Management</h1>
          <p className="text-gray-600">Manage users and their permissions</p>
        </div>
        
        <NewUsersCard 
          users={newUsers}
          onResetPassword={handleShowResetDialog}
        />
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-lg">All Users</h2>
            <div className="flex gap-2">
              {selectedUsers.length > 0 && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete Selected ({selectedUsers.length})
                </Button>
              )}
              <Button onClick={handleAddTestUser} size="sm">
                Add Test User
              </Button>
            </div>
          </div>
          
          <div className="p-5">
            <UsersFilters
              userTypeFilter={userTypeFilter}
              statusFilter={statusFilter}
              onUserTypeFilterChange={setUserTypeFilter}
              onStatusFilterChange={setStatusFilter}
            />
            
            <div className="overflow-x-auto">
              <UsersTable
                users={filteredUsers}
                selectedUsers={selectedUsers}
                onSelectUser={handleSelectUser}
                onSelectAll={handleSelectAll}
                onManageUser={handleManagePermissions}
                onDeleteUser={handleDeleteUser}
              />
            </div>
          </div>
        </div>
      </div>
      
      <UserPermissionsDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        user={selectedUser}
        onStatusChange={handleStatusChange}
        onUserTypeChange={handleUserTypeChange}
        onResetPassword={handleResetPassword}
      />

      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="mb-4">
              Reset password for <strong>{selectedUser?.name}</strong>
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input 
                id="new-password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsResetPasswordDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (selectedUser) {
                  handleResetPassword(selectedUser.id, newPassword);
                  setIsResetPasswordDialogOpen(false);
                  setSelectedUser(null);
                }
              }}
            >
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Users</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedUsers.length} selected users? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSelected}>Delete Users</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersPage;
