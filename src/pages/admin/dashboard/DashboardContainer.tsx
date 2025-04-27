
import React from 'react';
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DashboardContainerProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const DashboardContainer = ({ children, activeTab, onTabChange }: DashboardContainerProps) => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <DashboardHeader />
      
      <Tabs defaultValue="orders" value={activeTab} onValueChange={onTabChange}>
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>{children}</TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardContainer;
