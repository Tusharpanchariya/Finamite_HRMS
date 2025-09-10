import React from 'react';
import { Card } from '../ui/Card';
import { Table } from '../ui/Table';
import { mockEmployees } from '../../data/mockData';

export const EmployeeTable: React.FC = () => {
  const getstatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      'on-leave': 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`sm:h-[400px] px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {status.replace('-', ' ').toUpperCase()}
      </span>
    );
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(salary);
  };

  const columns = [
    {
      key: 'employee',
      label: 'Employee',
      render: (_: any, row: any) => (
        <div className="flex items-center space-x-3">
          <img
            src={row.avatar}
            alt={row.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            <p className="text-sm text-gray-500">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'position',
      label: 'Position',
      render: (_: any, row: any) => (
        <div>
          <p className="font-medium text-gray-900">{row.position}</p>
          <p className="text-sm text-gray-500">{row.department}</p>
        </div>
      )
    },
    {
      key: 'joinDate',
      label: 'Join Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'salary',
      label: 'Salary',
      render: (value: number) => formatSalary(value)
    },
    {
      key: 'status',
      label: 'status',
      render: (value: string) => getstatusBadge(value)
    }
  ];

  return (
    <Card className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Recent Employees</h2>
          <p className="text-sm text-gray-500">Manage your team members</p>
        </div>
      </div>
      
      <Table columns={columns} data={mockEmployees} />
    </Card>
  );
};