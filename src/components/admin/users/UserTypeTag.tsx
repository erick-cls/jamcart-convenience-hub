
import React from 'react';

interface UserTypeTagProps {
  userType: 'customer' | 'rider' | 'admin' | 'vendor';
}

const UserTypeTag: React.FC<UserTypeTagProps> = ({ userType }) => {
  const colors = {
    customer: 'bg-blue-100 text-blue-800',
    rider: 'bg-amber-100 text-amber-800',
    admin: 'bg-purple-100 text-purple-800',
    vendor: 'bg-orange-100 text-orange-800',
  };

  const labels = {
    customer: 'Customer',
    rider: 'Rider',
    admin: 'Admin',
    vendor: 'Vendor',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${colors[userType]}`}>
      {labels[userType]}
    </span>
  );
};

export default UserTypeTag;
