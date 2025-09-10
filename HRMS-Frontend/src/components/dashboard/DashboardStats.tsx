import React from 'react';
import { Users, UserCheck, Calendar, Clock, TrendingUp, Building2 } from 'lucide-react';
import { StatBox } from '../ui/StatBox';
import { mockDashboardStats } from '../../data/mockData';

export const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      <StatBox
        title="Total Employees"
        value={mockDashboardStats.totalEmployees}
        change="+5% from last month"
        changeType="positive"
        icon={Users}
        iconBgColor="bg-blue-50"
        iconColor="text-blue-600"
      />
      
      <StatBox
        title="Active Employees"
        value={mockDashboardStats.activeEmployees}
        change="93% active rate"
        changeType="positive"
        icon={UserCheck}
        iconBgColor="bg-green-50"
        iconColor="text-green-600"
      />
      
      <StatBox
        title="On Leave Today"
        value={mockDashboardStats.onLeaveToday}
        change="2 less than yesterday"
        changeType="positive"
        icon={Calendar}
        iconBgColor="bg-amber-50"
        iconColor="text-amber-600"
      />
      
      <StatBox
        title="Pending Requests"
        value={mockDashboardStats.pendingRequests}
        change="3 new today"
        changeType="neutral"
        icon={Clock}
        iconBgColor="bg-purple-50"
        iconColor="text-purple-600"
      />
      
      <StatBox
        title="New Hires"
        value={mockDashboardStats.newHires}
        change="This month"
        changeType="positive"
        icon={TrendingUp}
        iconBgColor="bg-indigo-50"
        iconColor="text-indigo-600"
      />
      
      <StatBox
        title="Departments"
        value={mockDashboardStats.totalDepartments}
        change="Active departments"
        changeType="neutral"
        icon={Building2}
        iconBgColor="bg-gray-50"
        iconColor="text-gray-600"
      />
    </div>
  );
};