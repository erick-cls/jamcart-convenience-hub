
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import UserTypeTag from './UserTypeTag';
import { User } from './UserPermissionsDialog';

interface NewUsersCardProps {
  users: (User & { isNew?: boolean; dateJoined: string })[];
  onResetPassword: (user: User) => void;
}

const NewUsersCard = ({ users, onResetPassword }: NewUsersCardProps) => {
  if (users.length === 0) return null;

  return (
    <Card className="mb-6">
      <CardHeader className="py-4">
        <CardTitle className="text-lg flex items-center">
          <UserPlus className="h-5 w-5 mr-2 text-jamcart-green" />
          New Sign Ups
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>User Type</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
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
                  <TableCell>
                    <UserTypeTag userType={user.userType} />
                  </TableCell>
                  <TableCell>
                    {new Date(user.dateJoined).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onResetPassword(user)}
                    >
                      Reset Password
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewUsersCard;
