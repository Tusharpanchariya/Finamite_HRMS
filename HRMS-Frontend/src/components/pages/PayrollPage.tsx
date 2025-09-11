import React, { useState } from 'react';
import { 
  IndianRupee , 
  Calculator, 
  Calendar, 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Eye, 
  Download,
  Clock,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Table } from '../ui/Table';
import { mockPayrollRecords, payrollSettings } from '../../data/payrollData';
import { PayrollRecord, PayrollComponent } from '../../types';
import { PayrollModal } from '../Modal/PayrollModal';
import { PayrollDetailsModal } from '../Modal/PayrollDetailsModal';

export const PayrollPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterstatus, setFilterstatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('2024-01');
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(mockPayrollRecords);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<PayrollRecord | null>(null);

  const filteredRecords = payrollRecords.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesstatus = filterstatus === 'all' || record.status === filterstatus;
    const matchesPeriod = record.period === filterPeriod;
    return matchesSearch && matchesstatus && matchesPeriod;
  });

  const getstatusBadge = (status: PayrollRecord['status']) => {
    const styles = {
      draft: 'text-yellow-800 border-yellow-200',
      processed: 'text-blue-800 border-blue-200',
      paid: 'text-green-800 border-green-200'
    };

    const icons = {
      draft: <Edit className="w-3 h-3 mr-1" />,
      processed: <CheckCircle className="w-3 h-3 mr-1" />,
      paid: <CheckCircle className="w-3 h-3 mr-1" />
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${styles[status]}`}>
        {icons[status]}
        {status.toUpperCase()}
      </span>
    );
  };

 const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount);
};

  const handleEditPayroll = (record: PayrollRecord) => {
    setEditingRecord(record);
    setIsPayrollModalOpen(true);
  };

  const handleViewDetails = (record: PayrollRecord) => {
    setSelectedRecord(record);
    setIsDetailsModalOpen(true);
  };

  const handleSavePayroll = (updatedRecord: PayrollRecord) => {
    if (editingRecord) {
      setPayrollRecords(prev => 
        prev.map(record => record.id === updatedRecord.id ? updatedRecord : record)
      );
    } else {
      setPayrollRecords(prev => [...prev, updatedRecord]);
    }
    setEditingRecord(null);
  };

  const totalGrossSalary = filteredRecords.reduce((sum, record) => sum + record.grossSalary, 0);
  const totalNetSalary = filteredRecords.reduce((sum, record) => sum + record.netSalary, 0);
  const totalDeductions = filteredRecords.reduce((sum, record) => 
    sum + record.deductions.reduce((deductionSum, deduction) => deductionSum + deduction.amount, 0), 0
  );

  const columns = [
    {
      key: 'employee',
      label: 'Employee',
      render: (_: any, row: PayrollRecord) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {row.employeeName.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.employeeName}</p>
            <p className="text-sm text-gray-500">ID: {row.employeeId}</p>
          </div>
        </div>
      )
    },
    {
      key: 'period',
      label: 'Period',
      render: (value: string) => {
        const [year, month] = value.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[parseInt(month) - 1]} ${year}`;
      }
    },
    {
      key: 'attendance',
      label: 'Attendance',
      render: (_: any, row: PayrollRecord) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{row.presentDays}/{row.workingDays} days</div>
          {row.overtimeHours > 0 && (
            <div className="text-blue-600 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {row.overtimeHours}h OT
            </div>
          )}
        </div>
      )
    },
    {
      key: 'baseSalary',
      label: 'Base Salary',
      render: (value: number) => (
        <span className="font-medium text-gray-900">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'grossSalary',
      label: 'Gross Salary',
      render: (value: number) => (
        <div className="text-sm">
          <div className="font-medium text-green-600">{formatCurrency(value)}</div>
        </div>
      )
    },
    {
      key: 'deductions',
      label: 'Deductions',
      render: (_: any, row: PayrollRecord) => {
        const totalDeductions = row.deductions.reduce((sum, d) => sum + d.amount, 0);
        return (
          <div className="text-sm">
            <div className="font-medium text-red-600">-{formatCurrency(totalDeductions)}</div>
          </div>
        );
      }
    },
    {
      key: 'netSalary',
      label: 'Net Salary',
      render: (value: number) => (
        <span className="font-semibold text-gray-900">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'status',
      label: 'status',
      render: (value: PayrollRecord['status']) => getstatusBadge(value)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: PayrollRecord) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewDetails(row)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEditPayroll(row)}
            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors duration-200"
            title="Edit Payroll"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            className="p-1 text-purple-600 hover:bg-purple-50 rounded transition-colors duration-200"
            title="Download Payslip"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-15xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payroll Management</h1>
            <p className="text-gray-600">Manage employee payroll, salaries, and compensation</p>
          </div>
          <button
            onClick={() => {
              setEditingRecord(null);
              setIsPayrollModalOpen(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Payroll</span>
          </button>
        </div>

        {/* Payroll Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-500 mb-1">Total Employees</p>
                <p className="text-2xl font-bold text-blue-700">{filteredRecords.length}</p>
                <p className="text-xs text-blue-500 mt-1">Current period</p>
              </div>
              <div className="p-3 bg-blue-200 rounded-lg">
                <Users className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </Card>

          <Card className="border-green-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-500 mb-1">Gross Payroll</p>
                <p className="text-2xl font-bold text-green-700">{formatCurrency(totalGrossSalary)}</p>
                <div className="flex items-center text-xs text-green-500 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>+5.2% from last month</span>
                </div>
              </div>
              <div className="p-3 bg-green-200 rounded-lg">
                <IndianRupee  className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </Card>

          <Card className="border-purple-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-500 mb-1">Net Payroll</p>
                <p className="text-2xl font-bold text-purple-700">{formatCurrency(totalNetSalary)}</p>
                <div className="flex items-center text-xs text-purple-500 mt-1">
                  <Calculator className="w-3 h-3 mr-1" />
                  <span>After deductions</span>
                </div>
              </div>
              <div className="p-3 bg-purple-200 rounded-lg">
                <Calculator className="w-6 h-6 text-purple-700" />
              </div>
            </div>
          </Card>

          <Card className="border-red-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-500 mb-1">Total Deductions</p>
                <p className="text-2xl font-bold text-red-700">{formatCurrency(totalDeductions)}</p>
                <div className="flex items-center text-xs text-red-500 mt-1">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  <span>Tax & contributions</span>
                </div>
              </div>
              <div className="p-3 bg-red-200 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-700" />
              </div>
            </div>
          </Card>
        </div>

        {/* status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {['draft', 'processed', 'paid'].map((status) => {
            const count = payrollRecords.filter(r => r.status === status && r.period === filterPeriod).length;
            const percentage = payrollRecords.length > 0 ? (count / payrollRecords.filter(r => r.period === filterPeriod).length) * 100 : 0;
            
            const statusConfig = {
              draft: { color: 'yellow', icon: Edit, label: 'Draft' },
              processed: { color: 'blue', icon: CheckCircle, label: 'Processed' },
              paid: { color: 'green', icon: CheckCircle, label: 'Paid' }
            };

            const config = statusConfig[status as keyof typeof statusConfig];
            const IconComponent = config.icon;

            return (
              <Card key={status}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium text-${config.color}-600 mb-1`}>{config.label}</p>
                    <p className={`text-3xl font-bold text-${config.color}-700`}>{count}</p>
                    <p className={`text-xs text-${config.color}-600 mt-1`}>{percentage.toFixed(1)}% of total</p>
                  </div>
                  <div className={`p-3 bg-${config.color}-200 rounded-lg`}>
                    <IconComponent className={`w-6 h-6 text-${config.color}-700`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full sm:w-64 transition-colors duration-200"
                />
              </div>

              {/* status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterstatus}
                  onChange={(e) => setFilterstatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white transition-colors duration-200"
                >
                  <option value="all">All status</option>
                  <option value="draft">Draft</option>
                  <option value="processed">Processed</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              {/* Period Filter */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white transition-colors duration-200"
                >
                  <option value="2024-01">January 2024</option>
                  <option value="2023-12">December 2023</option>
                  <option value="2023-11">November 2023</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200">
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </Card>

        {/* Payroll Table */}
        <Card>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Payroll Records ({filteredRecords.length})
            </h2>
            <p className="text-sm text-gray-500">
              {searchTerm && `Showing results for "${searchTerm}"`}
              {filterstatus !== 'all' && ` • status: ${filterstatus}`}
              {filterPeriod && ` • Period: ${filterPeriod}`}
            </p>
          </div>
          
          <Table columns={columns} data={filteredRecords} />
        </Card>

        {/* Modals */}
        <PayrollModal
          isOpen={isPayrollModalOpen}
          onClose={() => {
            setIsPayrollModalOpen(false);
            setEditingRecord(null);
          }}
          onSave={handleSavePayroll}
          payrollRecord={editingRecord}
          settings={payrollSettings}
        />

        <PayrollDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          payrollRecord={selectedRecord}
        />
      </div>
    </div>
  );
};