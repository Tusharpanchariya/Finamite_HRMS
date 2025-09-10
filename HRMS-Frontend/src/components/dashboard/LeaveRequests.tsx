import React from 'react';
import { Card } from '../ui/Card';
import { Table } from '../ui/Table';
import { mockLeaveRequests } from '../../data/mockData';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export const LeaveRequests: React.FC = () => {
  const getstatusIcon = (status: string) => {
    const icons = {
      approved: <CheckCircle className="w-4 h-4 text-green-600" />,
      rejected: <XCircle className="w-4 h-4 text-red-600" />,
      pending: <Clock className="w-4 h-4 text-yellow-600" />
    };
    return icons[status as keyof typeof icons];
  };

  const getstatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return (
      <div className="flex items-center space-x-2">
        {getstatusIcon(status)}
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
          {status.toUpperCase()}
        </span>
      </div>
    );
  };

  const columns = [
    {
      key: 'employeeIds',
      label: 'Employee',
      render: (value: string) => (
        <p className="font-medium text-gray-900">{value}</p>
      )
    },
    {
      key: 'leaveType',
      label: 'Leave Type',
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (_: any, row: any) => (
        <div>
          <p className="text-sm text-gray-900">{new Date(row.startDate).toLocaleDateString()} - {new Date(row.endDate).toLocaleDateString()}</p>
          <p className="text-xs text-gray-500">{row.days} days</p>
        </div>
      )
    },
    {
      key: 'leaveReason',
      label: 'leaveReason',
      render: (value: string) => (
        <p className="text-sm text-gray-600 max-w-xs truncate">{value}</p>
      )
    },
    {
      key: 'status',
      label: 'status',
      render: (value: string) => getstatusBadge(value)
    }
  ];

  return (
    <Card className="h-[490px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Leave Requests</h2>
          <p className="text-sm text-gray-500">Recent leave applications</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200">
          View All
        </button>
      </div>
      
      <Table columns={columns} data={mockLeaveRequests} />
    </Card>
  );
};