
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface MaintenanceContextType {
  isMaintenanceMode: boolean;
  setMaintenanceMode: (isActive: boolean) => void;
  isAdmin: boolean;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export const MaintenanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const isAdmin = !!user?.isAdmin;
  const [isMaintenanceMode, setMaintenanceMode] = useState(false);

  // Load maintenance state from localStorage on mount
  useEffect(() => {
    const storedMaintenanceMode = localStorage.getItem('jamcart-maintenance-mode');
    if (storedMaintenanceMode) {
      setMaintenanceMode(JSON.parse(storedMaintenanceMode));
    }
  }, []);

  // Save maintenance state to localStorage when changed
  useEffect(() => {
    localStorage.setItem('jamcart-maintenance-mode', JSON.stringify(isMaintenanceMode));
  }, [isMaintenanceMode]);

  return (
    <MaintenanceContext.Provider value={{ isMaintenanceMode, setMaintenanceMode, isAdmin }}>
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenanceMode = () => {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error('useMaintenanceMode must be used within a MaintenanceProvider');
  }
  return context;
};
