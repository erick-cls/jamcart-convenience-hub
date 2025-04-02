
import React from 'react';

interface UserTypeTagProps {
  userType: 'customer' | 'rider' | 'admin';
}

const UserTypeTag: React.FC<UserTypeTagProps> = ({ userType }) => {
  const colors = {
    customer: 'bg-blue-100 text-blue-800',
    rider: 'bg-amber-100 text-amber-800',
    admin: 'bg-purple-100 text-purple-800',
  };

  const labels = {
    customer: 'Customer',
    rider: 'Rider',
    admin: 'Admin',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${colors[userType]}`}>
      {labels[userType]}
    </span>
  );
};

export default UserTypeTag;
