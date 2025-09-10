import React, { useState } from 'react';
import { DashboardStats } from './DashboardStats';
import { EmployeeTable } from './EmployeeTable';
import { LeaveRequests } from './LeaveRequests';
import { EmployeeDistributionChart } from './EmployeeDistributionChart';
import { LeaveTrendsChart } from './LeaveTrendsChart';
import { QuickActions } from './QuickActions';
import { RecentActivities } from './RecentActivities';
import { AddEmployeeModal } from '../Modal/AddEmployeeModal'; // Import the modal
import LeaveApprovalModal from '../Modal/LeaveApprovalModal'; // Import the leave approval modal
import { Calendar, TrendingUp, Users, Activity } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  // State to control the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State to control the leave approval modal
  const [isLeaveApprovalModalOpen, setIsLeaveApprovalModalOpen] = useState(false);

  // Handler for adding a new employee
  const handleAddEmployee = (newEmployeeData: any) => {
    console.log("New employee added:", newEmployeeData);
    setIsModalOpen(false); // Close the modal after submission
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-15xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">HR Dashboard</h1>
          <p className="text-gray-600">Overview of your human resources management</p>
        </div>

        {/* Main Content */}
        <div className="max-w-15xl mx-auto mt-8 px-4">
          {/* Dashboard Statistics */}
          <div className="mb-8">
            <DashboardStats />
          </div>

          {/* Primary Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-8">
            {/* Left Column - Charts */}
            <div className="xl:col-span-8 space-y-8">
              <div className="transform hover:scale-[1.02] transition-all duration-300">
                <EmployeeDistributionChart />
              </div>
              <div className="transform hover:scale-[1.01] transition-all duration-300">
                <EmployeeTable />
              </div>
              <div className="transform hover:scale-[1.01] transition-all duration-300">
                <LeaveRequests />
              </div>
            </div>

            {/* Right Column - Actions & Activities */}
            <div className="xl:col-span-4 space-y-8">
              <div className="transform hover:scale-[1.02] transition-all duration-300">
                <QuickActions 
                  setIsModalOpen={setIsModalOpen} 
                  setIsLeaveApprovalModalOpen={setIsLeaveApprovalModalOpen} 
                /> {/* Pass both state setters */}
              </div>
              <div className="transform hover:scale-[1.02] transition-all duration-300">
                <LeaveTrendsChart />
              </div>
              <div className="transform hover:scale-[1.02] transition-all duration-300">
                <RecentActivities />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render the modal at the top level */}
      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddEmployee}
      />

      {/* Render the leave approval modal */}
      <LeaveApprovalModal
        isOpen={isLeaveApprovalModalOpen}
        onClose={() => setIsLeaveApprovalModalOpen(false)}
      />
    </div>
  );
};