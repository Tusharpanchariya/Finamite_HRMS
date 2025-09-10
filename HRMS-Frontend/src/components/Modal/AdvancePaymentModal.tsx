import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, User, Save, AlertCircle } from 'lucide-react';
import { AdvancePayment } from '../../types';
import { extendedMockEmployees } from '../../data/mockData';

interface AdvancePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (advance: AdvancePayment) => void;
  advance?: AdvancePayment | null;
}

export const AdvancePaymentModal: React.FC<AdvancePaymentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  advance
}) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    amount: 0,
    installments: 1,
    deductFromSalary: true,
    leaveReason: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (advance) {
        setFormData({
          employeeId: advance.employeeId,
          amount: advance.amount,
          installments: advance.installments,
          deductFromSalary: advance.deductFromSalary,
          leaveReason: advance.leaveReason
        });
      } else {
        setFormData({
          employeeId: '',
          amount: 0,
          installments: 1,
          deductFromSalary: true,
          leaveReason: ''
        });
      }
    }
  }, [isOpen, advance]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const employee = extendedMockEmployees.find(e => e.id === formData.employeeId);
    if (!employee) return;

    const installmentAmount = formData.amount / formData.installments;

    const newAdvance: AdvancePayment = {
      id: advance ? advance.id : `adv-${Date.now()}`,
      employeeId: formData.employeeId,
      amount: formData.amount,
      requestDate: advance ? advance.requestDate : new Date().toISOString().split('T')[0],
      status: advance ? advance.status : 'pending',
      installments: formData.installments,
      installmentAmount,
      remainingAmount: advance ? advance.remainingAmount : formData.amount,
      deductFromSalary: formData.deductFromSalary,
      leaveReason: formData.leaveReason,
      approvedDate: advance?.approvedDate,
      approvedBy: advance?.approvedBy
    };

    onSave(newAdvance);
    onClose();
  };

  const selectedEmployee = extendedMockEmployees.find(e => e.id === formData.employeeId);
  const installmentAmount = formData.amount / formData.installments;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {advance ? 'Edit Advance Payment' : 'Request Advance Payment'}
                </h2>
                <p className="text-sm text-gray-500">Configure advance payment details and installments</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Employee Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Employee
            </label>
            <select
              value={formData.employeeId}
              onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={!!advance}
            >
              <option value="">Select Employee</option>
              {extendedMockEmployees.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} - {employee.position}
                </option>
              ))}
            </select>
            {selectedEmployee && (
              <p className="text-sm text-gray-500 mt-1">
                Current Salary: ${selectedEmployee.salary?.toLocaleString() || 'N/A'}
              </p>
            )}
          </div>

          {/* Amount and Installments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Advance Amount
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Number of Installments
              </label>
              <input
                type="number"
                value={formData.installments}
                onChange={(e) => setFormData({...formData, installments: Number(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="12"
                required
              />
            </div>
          </div>

          {/* Calculation Summary */}
          {formData.amount > 0 && formData.installments > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Payment Breakdown</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Total Amount:</span>
                  <span className="font-semibold ml-2">${formData.amount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-blue-700">Per Installment:</span>
                  <span className="font-semibold ml-2">${installmentAmount.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-blue-700">Duration:</span>
                  <span className="font-semibold ml-2">{formData.installments} months</span>
                </div>
                <div>
                  <span className="text-blue-700">Deduction Method:</span>
                  <span className="font-semibold ml-2">
                    {formData.deductFromSalary ? 'From Salary' : 'Manual Payment'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Deduction Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Deduction Method</label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="salary-deduction"
                  name="deductionMethod"
                  checked={formData.deductFromSalary}
                  onChange={() => setFormData({...formData, deductFromSalary: true})}
                  className="mr-3"
                />
                <label htmlFor="salary-deduction" className="text-sm text-gray-700">
                  <span className="font-medium">Deduct from Monthly Salary</span>
                  <p className="text-xs text-gray-500">Automatically deduct installments from monthly payroll</p>
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="manual-payment"
                  name="deductionMethod"
                  checked={!formData.deductFromSalary}
                  onChange={() => setFormData({...formData, deductFromSalary: false})}
                  className="mr-3"
                />
                <label htmlFor="manual-payment" className="text-sm text-gray-700">
                  <span className="font-medium">Manual Payment</span>
                  <p className="text-xs text-gray-500">Employee will make manual payments as per schedule</p>
                </label>
              </div>
            </div>
          </div>

          {/* leaveReason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">leaveReason for Advance</label>
            <textarea
              value={formData.leaveReason}
              onChange={(e) => setFormData({...formData, leaveReason: e.target.value})}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Please provide leaveReason for advance payment request..."
              required
            />
          </div>

          {/* Warning for high amounts */}
          {selectedEmployee && formData.amount > (selectedEmployee.salary || 0) * 0.5 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-yellow-800">High Advance Amount</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    The requested advance is more than 50% of the employee's monthly salary. 
                    This may require additional approval.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{advance ? 'Update' : 'Submit'} Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};