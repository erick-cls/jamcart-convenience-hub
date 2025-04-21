
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UsersFiltersProps {
  userTypeFilter: string;
  statusFilter: string;
  onUserTypeFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
}

const UsersFilters = ({
  userTypeFilter,
  statusFilter,
  onUserTypeFilterChange,
  onStatusFilterChange
}: UsersFiltersProps) => {
  return (
    <div className="flex gap-4 mb-4">
      <Select value={userTypeFilter} onValueChange={onUserTypeFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by user type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="customer">Customer</SelectItem>
          <SelectItem value="rider">Rider</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default UsersFilters;
