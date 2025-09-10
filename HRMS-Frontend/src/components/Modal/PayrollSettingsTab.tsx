import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  DollarSign, 
  Settings as SettingsIcon,
  Calendar,
  Calculator,
  AlertCircle
} from 'lucide-react';
import { PayrollComponent, PayrollSettings } from '../../types';

interface PayrollSettingsTabProps {
  settings: PayrollSettings;
  onSave: (settings: PayrollSettings) => void;
}

export const PayrollSettingsTab: React.FC<PayrollSettingsTabProps> = ({
  settings,
  onSave
}) => {
  const [localSettings, setLocalSettings] = useState<PayrollSettings>(settings);
  const [savedMessage, setSavedMessage] = useState('');

  const showSaveMessage = (message: string) => {
    setSavedMessage(message);
    setTimeout(() => setSavedMessage(''), 3000);
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
    setLocalSettings({
      ...localSettings,
      defaultAllowances: [...localSettings.defaultAllowances, newAllowance]
    });
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
    setLocalSettings({
      ...localSettings,
      defaultDeductions: [...localSettings.defaultDeductions, newDeduction]
    });
  };

  const updateAllowance = (index: number, field: keyof PayrollComponent, value: any) => {
    const updated = [...localSettings.defaultAllowances];
    (updated[index] as any)[field] = value;
    setLocalSettings({
      ...localSettings,
      defaultAllowances: updated
    });
  };

  const updateDeduction = (index: number, field: keyof PayrollComponent, value: any) => {
    const updated = [...localSettings.defaultDeductions];
    (updated[index] as any)[field] = value;
    setLocalSettings({
      ...localSettings,
      defaultDeductions: updated
    });
  };

  const removeAllowance = (index: number) => {
    setLocalSettings({
      ...localSettings,
      defaultAllowances: localSettings.defaultAllowances.filter((_, i) => i !== index)
    });
  };

  const removeDeduction = (index: number) => {
    setLocalSettings({
      ...localSettings,
      defaultDeductions: localSettings.defaultDeductions.filter((_, i) => i !== index)
    });
  };

  const handleSave = () => {
    onSave(localSettings);
    showSaveMessage('Payroll settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {savedMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
          <SettingsIcon className="w-5 h-5" />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* Basic Payroll Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Basic Payroll Configuration
          </h3>
          <p className="text-sm text-gray-500">Configure basic payroll calculation settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Working Days per Month</label>
            <input
              type="number"
              value={localSettings.workingDaysPerMonth}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                workingDaysPerMonth: Number(e.target.value)
              })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              max="31"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Overtime Multiplier</label>
            <input
              type="number"
              step="0.1"
              value={localSettings.overtimeMultiplier}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                overtimeMultiplier: Number(e.target.value)
              })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              max="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select
              value={localSettings.currency || 'USD'}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                currency: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD (C$)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Default Allowances */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Default Allowances
            </h3>
            <p className="text-sm text-gray-500">Configure default allowances that will be applied to all new payroll records</p>
          </div>
          <button
            onClick={addAllowance}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Allowance</span>
          </button>
        </div>

        <div className="space-y-4">
          {localSettings.defaultAllowances.map((allowance, index) => (
            <div key={allowance.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="Allowance name"
                    value={allowance.name}
                    onChange={(e) => updateAllowance(index, 'name', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={allowance.amount}
                    onChange={(e) => updateAllowance(index, 'amount', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={allowance.isPercentage ? 'percentage' : 'fixed'}
                    onChange={(e) => updateAllowance(index, 'isPercentage', e.target.value === 'percentage')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="fixed">Fixed Amount</option>
                    <option value="percentage">Percentage</option>
                  </select>
                </div>
                <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={allowance.description}
                    onChange={(e) => updateAllowance(index, 'description', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-1">
                  <button
                    onClick={() => removeAllowance(index)}
                    className="w-full p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Remove allowance"
                  >
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {localSettings.defaultAllowances.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No default allowances configured</p>
              <p className="text-sm">Click "Add Allowance" to create your first default allowance</p>
            </div>
          )}
        </div>
      </div>

      {/* Default Deductions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-red-600" />
              Default Deductions
            </h3>
            <p className="text-sm text-gray-500">Configure default deductions that will be applied to all new payroll records</p>
          </div>
          <button
            onClick={addDeduction}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Deduction</span>
          </button>
        </div>

        <div className="space-y-4">
          {localSettings.defaultDeductions.map((deduction, index) => (
            <div key={deduction.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="Deduction name"
                    value={deduction.name}
                    onChange={(e) => updateDeduction(index, 'name', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={deduction.amount}
                    onChange={(e) => updateDeduction(index, 'amount', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={deduction.isPercentage ? 'percentage' : 'fixed'}
                    onChange={(e) => updateDeduction(index, 'isPercentage', e.target.value === 'percentage')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="fixed">Fixed Amount</option>
                    <option value="percentage">Percentage</option>
                  </select>
                </div>
                <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={deduction.description}
                    onChange={(e) => updateDeduction(index, 'description', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-1">
                  <button
                    onClick={() => removeDeduction(index)}
                    className="w-full p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Remove deduction"
                  >
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {localSettings.defaultDeductions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No default deductions configured</p>
              <p className="text-sm">Click "Add Deduction" to create your first default deduction</p>
            </div>
          )}
        </div>
      </div>

      {/* Advance Payment Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-yellow-600" />
            Advance Payment Settings
          </h3>
          <p className="text-sm text-gray-500">Configure default settings for advance payments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Repayment Months</label>
            <input
              type="number"
              value={localSettings.defaultAdvanceRepaymentMonths || 1}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                defaultAdvanceRepaymentMonths: Number(e.target.value)
              })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              max="12"
            />
            <p className="text-xs text-gray-500 mt-1">Default number of months to repay advance payments</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Advance Percentage</label>
            <input
              type="number"
              value={localSettings.maxAdvancePercentage || 50}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                maxAdvancePercentage: Number(e.target.value)
              })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              max="100"
            />
            <p className="text-xs text-gray-500 mt-1">Maximum percentage of salary that can be advanced</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Advance Payment Guidelines</h4>
              <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                <li>• Advance payments can be set up with flexible repayment terms</li>
                <li>• Previous month advances will be automatically calculated</li>
                <li>• Outstanding advances will be tracked across multiple months</li>
                <li>• Manual advance entries can override automatic calculations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          <Save className="w-5 h-5" />
          <span>Save Payroll Settings</span>
        </button>
      </div>
    </div>
  );
};