
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  dateJoined: string;
  status: string;
  orders: number;
}

interface RecentUsersProps {
  users: User[];
}

const RecentUsers = ({ users }: RecentUsersProps) => {
  const navigate = useNavigate();
  
  const handleViewAll = () => {
    navigate('/admin/users');
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
        <h2 className="font-semibold text-lg">Recent Users</h2>
        <button
          className="text-sm text-jamcart-green flex items-center"
          onClick={handleViewAll}
        >
          View all
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Orders</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
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
                <TableCell>{user.orders}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecentUsers;
