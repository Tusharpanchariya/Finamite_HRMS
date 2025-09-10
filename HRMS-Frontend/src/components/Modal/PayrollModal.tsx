import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calculator } from 'lucide-react';
import { PayrollRecord, PayrollComponent, PayrollSettings } from '../../types';
import { extendedMockEmployees } from '../../data/mockData';

interface PayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: PayrollRecord) => void;
  payrollRecord?: PayrollRecord | null;
  settings: PayrollSettings;
}

export const PayrollModal: React.FC<PayrollModalProps> = ({
  isOpen,
  onClose,
  onSave,
  payrollRecord,
  settings
}) => {
  const [employeeId, setEmployeeId] = useState('');
  const [period, setPeriod] = useState('2024-01');
  const [baseSalary, setBaseSalary] = useState(0);
  const [presentDays, setPresentDays] = useState(22);
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [allowances, setAllowances] = useState<PayrollComponent[]>([]);
  const [deductions, setDeductions] = useState<PayrollComponent[]>([]);
  const [advancePayment, setAdvancePayment] = useState(0);

  // Reset form when modal opens/closes or when payrollRecord changes
  useEffect(() => {
    if (isOpen) {
      if (payrollRecord) {
        // Edit mode
        setEmployeeId(payrollRecord.employeeId);
        setPeriod(payrollRecord.period);
        setBaseSalary(payrollRecord.baseSalary);
        setPresentDays(payrollRecord.presentDays);
        setOvertimeHours(payrollRecord.overtimeHours);
        setAllowances([...payrollRecord.allowances]);
        setDeductions([...payrollRecord.deductions]);
        setAdvancePayment(payrollRecord.advancePayment);
      } else {
        // Add mode - reset to defaults
        setEmployeeId('');
        setPeriod('2024-01');
        setBaseSalary(0);
        setPresentDays(settings.workingDaysPerMonth);
        setOvertimeHours(0);
        setAllowances([...settings.defaultAllowances]);
        setDeductions([...settings.defaultDeductions]);
        setAdvancePayment(0);
      }
    }
  }, [isOpen, payrollRecord, settings]);

  const handleEmployeeChange = (newEmployeeId: string) => {
    setEmployeeId(newEmployeeId);
    const employee = extendedMockEmployees.find(e => e.id === newEmployeeId);
    if (employee) {
      setBaseSalary(employee.salary || 50000);
    }
  };

  const addAllowance = () => {
    const newAllowance: PayrollComponent = {
      id: `allowance-${Date.now()}`,
      name: '',
      type: 'allowance',
      amount: 0,
      isPercentage: false,
      isRecurring: true,
      description: ''
    };
    setAllowances([...allowances, newAllowance]);
  };

  const addDeduction = () => {
    const newDeduction: PayrollComponent = {
      id: `deduction-${Date.now()}`,
      name: '',
      type: 'deduction',
      amount: 0,
      isPercentage: false,
      isRecurring: true,
      description: ''
    };
    setDeductions([...deductions, newDeduction]);
  };

  const updateAllowance = (index: number, field: keyof PayrollComponent, value: any) => {
    const updated = [...allowances];
    (updated[index] as any)[field] = value;
    setAllowances(updated);
  };

  const updateDeduction = (index: number, field: keyof PayrollComponent, value: any) => {
    const updated = [...deductions];
    (updated[index] as any)[field] = value;
    setDeductions(updated);
  };

  const removeAllowance = (index: number) => {
    setAllowances(allowances.filter((_, i) => i !== index));
  };

  const removeDeduction = (index: number) => {
    setDeductions(deductions.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    // Calculate allowances
    const totalAllowances = allowances.reduce((sum, allowance) => {
      return sum + (allowance.isPercentage ? (baseSalary * allowance.amount / 100) : allowance.amount);
    }, 0);

    // Add overtime pay
    const overtimePay = overtimeHours > 0 ? 
      (baseSalary / (settings.workingDaysPerMonth * 8)) * overtimeHours * settings.overtimeMultiplier : 0;

    const grossSalary = baseSalary + totalAllowances + overtimePay;

    // Calculate deductions
    const totalDeductions = deductions.reduce((sum, deduction) => {
      return sum + (deduction.isPercentage ? 
        (deduction.name.toLowerCase().includes('income tax') ? grossSalary * deduction.amount / 100 : baseSalary * deduction.amount / 100) 
        : deduction.amount);
    }, 0) + advancePayment;

    const netSalary = grossSalary - totalDeductions;

    return { totalAllowances, overtimePay, grossSalary, totalDeductions, netSalary };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const employee = extendedMockEmployees.find(e => e.id === employeeId);
    if (!employee) return;

    const { grossSalary, netSalary } = calculateTotals();

    // Process allowances with calculated amounts
    const processedAllowances = allowances.map(allowance => ({
      ...allowance,
      amount: allowance.isPercentage ? (baseSalary * allowance.amount / 100) : allowance.amount
    }));

    // Add overtime if applicable
    if (overtimeHours > 0) {
      const overtimePay = (baseSalary / (settings.workingDaysPerMonth * 8)) * overtimeHours * settings.overtimeMultiplier;
      processedAllowances.push({
        id: `overtime-${employeeId}`,
        name: 'Overtime Pay',
        type: 'allowance',
        amount: overtimePay,
        isPercentage: false,
        isRecurring: false,
        description: `Overtime payment for ${overtimeHours} hours`
      });
    }

    // Process deductions with calculated amounts
    const processedDeductions = deductions.map(deduction => ({
      ...deduction,
      amount: deduction.isPercentage ? 
        (deduction.name.toLowerCase().includes('income tax') ? grossSalary * deduction.amount / 100 : baseSalary * deduction.amount / 100) 
        : deduction.amount
    }));

    // Add advance payment if applicable
    if (advancePayment > 0) {
      processedDeductions.push({
        id: `advance-${employeeId}`,
        name: 'Advance Payment',
        type: 'deduction',
        amount: advancePayment,
        isPercentage: false,
        isRecurring: false,
        description: 'Advance salary payment deduction'
      });
    }

    const newRecord: PayrollRecord = {
      id: payrollRecord ? payrollRecord.id : `payroll-${employeeId}-${period}`,
      employeeId,
      employeeName: employee.name,
      period,
      baseSalary,
      allowances: processedAllowances,
      deductions: processedDeductions,
      grossSalary,
      netSalary,
      workingDays: settings.workingDaysPerMonth,
      presentDays,
      overtimeHours,
      overtimeRate: baseSalary / (settings.workingDaysPerMonth * 8) * settings.overtimeMultiplier,
      advancePayment,
      status: payrollRecord ? payrollRecord.status : 'draft'
    };

    onSave(newRecord);
    onClose();
  };

  const { totalAllowances, overtimePay, grossSalary, totalDeductions, netSalary } = calculateTotals();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {payrollRecord ? 'Edit Payroll' : 'Add New Payroll'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
                <select
                  value={employeeId}
                  onChange={(e) => handleEmployeeChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={!!payrollRecord}
                >
                  <option value="">Select Employee</option>
                  {extendedMockEmployees.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} - {employee.position}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                <input
                  type="month"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Base Salary</label>
                <input
                  type="number"
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Attendance Information */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance & Overtime</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Present Days</label>
                <input
                  type="number"
                  value={presentDays}
                  onChange={(e) => setPresentDays(Number(e.target.value))}
                  max={settings.workingDaysPerMonth}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
                <input
                  type="number"
                  value={settings.workingDaysPerMonth}
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Overtime Hours</label>
                <input
                  type="number"
                  value={overtimeHours}
                  onChange={(e) => setOvertimeHours(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Allowances */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Allowances</h3>
              <button
                type="button"
                onClick={addAllowance}
                className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Allowance</span>
              </button>
            </div>
            <div className="space-y-3">
              {allowances.map((allowance, index) => (
                <div key={allowance.id} className="flex items-center space-x-3 bg-white p-3 rounded-lg">
                  <input
                    type="text"
                    placeholder="Allowance name"
                    value={allowance.name}
                    onChange={(e) => updateAllowance(index, 'name', e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={allowance.amount}
                    onChange={(e) => updateAllowance(index, 'amount', Number(e.target.value))}
                    className="w-24 border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                  <select
                    value={allowance.isPercentage ? 'percentage' : 'fixed'}
                    onChange={(e) => updateAllowance(index, 'isPercentage', e.target.value === 'percentage')}
                    className="w-24 border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="fixed">Fixed</option>
                    <option value="percentage">%</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeAllowance(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Deductions */}
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Deductions</h3>
              <button
                type="button"
                onClick={addDeduction}
                className="flex items-center space-x-2 px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Deduction</span>
              </button>
            </div>
            <div className="space-y-3">
              {deductions.map((deduction, index) => (
                <div key={deduction.id} className="flex items-center space-x-3 bg-white p-3 rounded-lg">
                  <input
                    type="text"
                    placeholder="Deduction name"
                    value={deduction.name}
                    onChange={(e) => updateDeduction(index, 'name', e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={deduction.amount}
                    onChange={(e) => updateDeduction(index, 'amount', Number(e.target.value))}
                    className="w-24 border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                  <select
                    value={deduction.isPercentage ? 'percentage' : 'fixed'}
                    onChange={(e) => updateDeduction(index, 'isPercentage', e.target.value === 'percentage')}
                    className="w-24 border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="fixed">Fixed</option>
                    <option value="percentage">%</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeDeduction(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Advance Payment */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Advance Payment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Advance Amount</label>
                <input
                  type="number"
                  value={advancePayment}
                  onChange={(e) => setAdvancePayment(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Calculations Summary */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Calculator className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Salary Calculation</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Base Salary</p>
                <p className="font-semibold text-lg">${baseSalary.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-green-600">+ Allowances</p>
                <p className="font-semibold text-lg text-green-600">+${(totalAllowances + overtimePay).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-red-600">- Deductions</p>
                <p className="font-semibold text-lg text-red-600">-${totalDeductions.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <p className="text-blue-600">Net Salary</p>
                <p className="font-bold text-xl text-blue-600">${netSalary.toLocaleString()}</p>
              </div>
            </div>
          </div>

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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {payrollRecord ? 'Update Payroll' : 'Save Payroll'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};