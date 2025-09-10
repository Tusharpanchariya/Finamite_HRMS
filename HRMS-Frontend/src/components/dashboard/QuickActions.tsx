import React from 'react';
import { Card } from '../ui/Card';
import { PlusCircle, CalendarPlus, UserPlus, CheckSquare, FileText, Settings } from 'lucide-react';

interface QuickActionsProps {
  setIsModalOpen: (open: boolean) => void; // Prop to control modal state
  setIsLeaveApprovalModalOpen: (open: boolean) => void; // Prop to control leave approval modal
}

export const QuickActions: React.FC<QuickActionsProps> = ({ setIsModalOpen, setIsLeaveApprovalModalOpen }) => {
  const actions = [
    {
      id: 'add-employee',
      title: 'Add Employee',
      description: 'Onboard new team member',
      icon: UserPlus,
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
      textColor: 'text-blue-700',
      onClick: () => setIsModalOpen(true), // Use the passed prop
    },
    {
      id: 'approve-leave',
      title: 'Approve Leave',
      description: 'Review pending requests',
      icon: CalendarPlus,
      color: 'emerald',
      gradient: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-50',
      hoverColor: 'hover:bg-emerald-100',
      textColor: 'text-emerald-700',
      onClick: () => setIsLeaveApprovalModalOpen(true), // Open leave approval modal
    },
    {
      id: 'performance-review',
      title: 'Performance Review',
      description: 'Evaluate team performance',
      icon: CheckSquare,
      color: 'purple',
      gradient: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
      textColor: 'text-purple-700',
      onClick: () => console.log('Performance review clicked'),
    },
    {
      id: 'create-report',
      title: 'Generate Report',
      description: 'Create analytics report',
      icon: FileText,
      color: 'orange',
      gradient: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100',
      textColor: 'text-orange-700',
      onClick: () => console.log('Create report clicked'),
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
            <PlusCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            <p className="text-sm text-gray-600">Streamline your workflow</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action) => {
            const IconComponent = action.icon;
            return (
              <button
                key={action.id}
                onClick={action.onClick}
                className={`group relative overflow-hidden ${action.bgColor} ${action.hoverColor} rounded-2xl p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-gray-100/50`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative flex flex-col items-center text-center space-y-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-bold ${action.textColor} group-hover:text-gray-900 transition-colors duration-300`}>
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 group-hover:text-gray-700 transition-colors duration-300">
                      {action.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};