
import React from 'react';
import ActionButton from '@/components/ui/ActionButton';

interface QuickActionsProps {
  actions: {
    label: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
    className?: string;
    onClick?: () => void;
  }[];
}

const QuickActions = ({ actions }: QuickActionsProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <h2 className="font-semibold text-lg">Quick Actions</h2>
      </div>
      <div className="p-5">
        <div className="space-y-3">
          {actions.map((action, index) => (
            <ActionButton 
              key={index}
              className={`w-full justify-center ${action.className || ''}`} 
              variant={action.variant || 'outline'}
              onClick={action.onClick}
            >
              {action.label}
            </ActionButton>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
