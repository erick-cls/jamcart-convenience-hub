
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedLogo from '@/components/ui/AnimatedLogo';
import { useAuth } from '@/context/AuthContext';

const MaintenancePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="flex justify-center mb-6">
          <AnimatedLogo size="lg" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Under Maintenance</h1>
        
        <p className="text-gray-600 mb-6">
          We're currently making some improvements to JAMCart. 
          Please check back soon!
        </p>
        
        {user?.isAdmin && (
          <Button 
            onClick={() => navigate('/admin/settings')}
            className="w-full"
          >
            Go to Admin Settings
          </Button>
        )}
      </div>
    </div>
  );
};

export default MaintenancePage;
