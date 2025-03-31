
import React from 'react';

interface ProgressItem {
  label: string;
  percentage: string;
  color: string;
}

interface UserOverviewProps {
  progressItems: ProgressItem[];
}

const UserOverview = ({ progressItems }: UserOverviewProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="p-5 border-b border-gray-100">
        <h2 className="font-semibold text-lg">User Overview</h2>
      </div>
      <div className="p-5">
        <div className="space-y-6">
          {progressItems.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{item.label}</span>
                <span className="font-medium">{item.percentage}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`${item.color} h-2 rounded-full`} style={{ width: item.percentage }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserOverview;
