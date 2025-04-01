
import React from 'react';
import { Button } from '@/components/ui/button';

interface Action {
  label: string;
  variant: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  className?: string;
}

interface QuickActionsProps {
  actions: Action[];
  onActionClick?: (label: string) => void;
}

const QuickActions = ({ actions, onActionClick }: QuickActionsProps) => {
  const handleClick = (label: string) => {
    if (onActionClick) {
      onActionClick(label);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="p-5 border-b border-gray-100">
        <h2 className="font-semibold text-lg">Quick Actions</h2>
      </div>
      <div className="p-5 space-y-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant}
            className={`w-full justify-start ${action.className || ''}`}
            onClick={() => handleClick(action.label)}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
