
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import UserTypeTag from './UserTypeTag';
import { Badge } from '@/components/ui/badge';
import { User } from './UserPermissionsDialog';

interface UsersTableProps {
  users: (User & { isNew?: boolean; dateJoined: string })[];
  selectedUsers: string[];
  onSelectUser: (userId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onManageUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

const UsersTable = ({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onManageUser,
  onDeleteUser
}: UsersTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox 
              checked={selectedUsers.length === users.length && users.length > 0}
              onCheckedChange={onSelectAll}
            />
          </TableHead>
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
            <TableCell>
              <Checkbox 
                checked={selectedUsers.includes(user.id)}
                onCheckedChange={(checked) => onSelectUser(user.id, checked as boolean)}
              />
            </TableCell>
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
            <TableCell className="space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onManageUser(user)}
              >
                Manage User
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => onDeleteUser(user.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UsersTable;
