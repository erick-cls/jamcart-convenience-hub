
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import UserPermissionsDialog, { User } from '@/components/admin/users/UserPermissionsDialog';
import UserTypeTag from '@/components/admin/users/UserTypeTag';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';

// Mock data (in a real app, this would come from an API)
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
  const [users, setUsers] = useState<(User & { isNew?: boolean })[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Reset John Doe's password on component mount
  useEffect(() => {
    // Automatically trigger password reset for John Doe on page load
    const johnDoe = users.find(user => user.email === 'john.doe@example.com');
    if (johnDoe) {
      handleResetPassword(johnDoe.id, 'user123');
    }
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
    // In a real app, this would call an API to update the password
    console.log(`Password for user ${userId} reset to: ${newPassword}`);
    
    // Show success toast for John Doe's password reset
    const user = users.find(u => u.id === userId);
    if (user) {
      toast({
        title: "Password Reset",
        description: `Password for ${user.name} has been reset${newPassword === 'user123' ? ' to "user123"' : ''}.`,
      });
    }
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="py-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">User Management</h1>
          <p className="text-gray-600">Manage users and their permissions</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-lg">All Users</h2>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>User Type</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {user.name}
                        {user.isNew && (
                          <Badge className="bg-blue-500">New</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{new Date(user.dateJoined).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {user.userType && <UserTypeTag userType={user.userType} />}
                    </TableCell>
                    <TableCell>{user.orders}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleManagePermissions(user)}
                      >
                        Manage User
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
    </div>
  );
};

export default UsersPage;
