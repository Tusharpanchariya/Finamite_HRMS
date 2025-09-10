import React from 'react';
import { X, Download, Calendar, User, DollarSign, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { PayrollRecord } from '../../types';

interface PayrollDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payrollRecord: PayrollRecord | null;
}

export const PayrollDetailsModal: React.FC<PayrollDetailsModalProps> = ({
  isOpen,
  onClose,
  payrollRecord
}) => {
  if (!isOpen || !payrollRecord) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPeriod = (period: string) => {
    const [year, month] = period.split('-');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const getstatusBadge = (status: PayrollRecord['status']) => {
    const styles = {
      draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processed: 'bg-blue-100 text-blue-800 border-blue-200',
      paid: 'bg-green-100 text-green-800 border-green-200'
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const totalAllowances = payrollRecord.allowances.reduce((sum, a) => sum + a.amount, 0);
  const totalDeductions = payrollRecord.deductions.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Payroll Details</h2>
              <p className="text-gray-600">{payrollRecord.employeeName} - {formatPeriod(payrollRecord.period)}</p>
            </div>
            <div className="flex items-center space-x-3">
              {getstatusBadge(payrollRecord.status)}
              <button
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                onClick={() => {/* Download payslip logic */}}
              >
                <Download className="w-4 h-4" />
                <span>Download Payslip</span>
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Employee Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Employee Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Employee ID</label>
                <p className="text-lg font-semibold text-gray-900">{payrollRecord.employeeId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Employee Name</label>
                <p className="text-lg font-semibold text-gray-900">{payrollRecord.employeeName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Pay Period</label>
                <p className="text-lg font-semibold text-gray-900">{formatPeriod(payrollRecord.period)}</p>
              </div>
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Attendance Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Working Days</label>
                <p className="text-lg font-semibold text-gray-900">{payrollRecord.workingDays}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Present Days</label>
                <p className="text-lg font-semibold text-gray-900">{payrollRecord.presentDays}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Attendance %</label>
                <p className="text-lg font-semibold text-gray-900">
                  {((payrollRecord.presentDays / payrollRecord.workingDays) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Overtime Hours</label>
                <p className="text-lg font-semibold text-gray-900">{payrollRecord.overtimeHours}h</p>
              </div>
            </div>
          </div>

          {/* Salary Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Allowances */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Allowances & Additions
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                  <span className="font-medium text-gray-900">Base Salary</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(payrollRecord.baseSalary)}</span>
                </div>
                {payrollRecord.allowances.map((allowance) => (
                  <div key={allowance.id} className="flex justify-between items-center bg-white p-3 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900">{allowance.name}</span>
                      {allowance.description && (
                        <p className="text-xs text-gray-500">{allowance.description}</p>
                      )}
                    </div>
                    <span className="font-semibold text-green-600">+{formatCurrency(allowance.amount)}</span>
                  </div>
                ))}
                <div className="border-t border-green-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total Allowances</span>
                    <span className="font-bold text-green-600">+{formatCurrency(totalAllowances)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingDown className="w-5 h-5 mr-2 text-red-600" />
                Deductions
              </h3>
              <div className="space-y-3">
                {payrollRecord.deductions.map((deduction) => (
                  <div key={deduction.id} className="flex justify-between items-center bg-white p-3 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900">{deduction.name}</span>
                      {deduction.description && (
                        <p className="text-xs text-gray-500">{deduction.description}</p>
                      )}
                    </div>
                    <span className="font-semibold text-red-600">-{formatCurrency(deduction.amount)}</span>
                  </div>
                ))}
                <div className="border-t border-red-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total Deductions</span>
                    <span className="font-bold text-red-600">-{formatCurrency(totalDeductions)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Salary Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Salary Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span className="font-medium text-gray-700">Gross Salary</span>
                <span className="font-semibold text-gray-900">{formatCurrency(payrollRecord.grossSalary)}</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="font-medium text-gray-700">Total Deductions</span>
                <span className="font-semibold text-red-600">-{formatCurrency(totalDeductions)}</span>
              </div>
              <div className="border-t border-gray-300 pt-4">
                <div className="flex justify-between items-center text-2xl">
                  <span className="font-bold text-gray-900">Net Salary</span>
                  <span className="font-bold text-blue-600">{formatCurrency(payrollRecord.netSalary)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          {payrollRecord.status !== 'draft' && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Payment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">status</label>
                  <p className="text-lg font-semibold text-gray-900">{payrollRecord.status.toUpperCase()}</p>
                </div>
                {payrollRecord.processedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Processed Date</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(payrollRecord.processedDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {payrollRecord.paymentDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Payment Date</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(payrollRecord.paymentDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};