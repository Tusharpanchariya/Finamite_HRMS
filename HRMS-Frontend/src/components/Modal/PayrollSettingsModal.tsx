import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, Settings, DollarSign } from 'lucide-react';
import { PayrollSettings, PayrollComponent } from '../../types';

interface PayrollSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: PayrollSettings) => void;
  settings: PayrollSettings;
}

export const PayrollSettingsModal: React.FC<PayrollSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  settings
}) => {
  const [localSettings, setLocalSettings] = useState<PayrollSettings>(settings);

  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  const addAllowance = () => {
    const newAllowance: PayrollComponent = {
      id: `allowance-${Date.now()}`,
      name: '',
      type: 'allowance',
      amount: 0,
      isPercentage: false,
      isRecurring: true,
      description: '',
      isActive: true
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
      description: '',
      isActive: true
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Payroll Settings</h2>
                <p className="text-sm text-gray-500">Configure default allowances, deductions, and payroll policies</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Settings */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
              Basic Payroll Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Working Days per Month</label>
                <input
                  type="number"
                  value={localSettings.workingDaysPerMonth}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    workingDaysPerMonth: Number(e.target.value)
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="20"
                  max="31"
                  required
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  max="3"
                  required
                />
              </div>
            </div>
          </div>

          {/* Tax Settings */}
          <div className="bg-red-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax & Contribution Rates (%)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Income Tax Rate</label>
                <input
                  type="number"
                  step="0.1"
                  value={localSettings.taxSettings.incomeTaxRate}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    taxSettings: {
                      ...localSettings.taxSettings,
                      incomeTaxRate: Number(e.target.value)
                    }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Social Security Rate</label>
                <input
                  type="number"
                  step="0.1"
                  value={localSettings.taxSettings.socialSecurityRate}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    taxSettings: {
                      ...localSettings.taxSettings,
                      socialSecurityRate: Number(e.target.value)
                    }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Health Insurance Rate</label>
                <input
                  type="number"
                  step="0.1"
                  value={localSettings.taxSettings.healthInsuranceRate}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    taxSettings: {
                      ...localSettings.taxSettings,
                      healthInsuranceRate: Number(e.target.value)
                    }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="10"
                />
              </div>
            </div>
          </div>

          {/* Default Allowances */}
          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Default Allowances</h3>
              <button
                type="button"
                onClick={addAllowance}
                className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Allowance</span>
              </button>
            </div>
            <div className="space-y-4">
              {localSettings.defaultAllowances.map((allowance, index) => (
                <div key={allowance.id} className="bg-white p-4 rounded-lg border border-green-200">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        placeholder="Allowance name"
                        value={allowance.name}
                        onChange={(e) => updateAllowance(index, 'name', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Amount</label>
                      <input
                        type="number"
                        placeholder="Amount"
                        value={allowance.amount}
                        onChange={(e) => updateAllowance(index, 'amount', Number(e.target.value))}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={allowance.isPercentage ? 'percentage' : 'fixed'}
                        onChange={(e) => updateAllowance(index, 'isPercentage', e.target.value === 'percentage')}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      >
                        <option value="fixed">Fixed</option>
                        <option value="percentage">%</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={allowance.isActive}
                        onChange={(e) => updateAllowance(index, 'isActive', e.target.checked)}
                        className="mr-2"
                      />
                      <label className="text-xs text-gray-700">Active</label>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeAllowance(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      placeholder="Description"
                      value={allowance.description}
                      onChange={(e) => updateAllowance(index, 'description', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Default Deductions */}
          <div className="bg-red-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Default Deductions</h3>
              <button
                type="button"
                onClick={addDeduction}
                className="flex items-center space-x-2 px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Deduction</span>
              </button>
            </div>
            <div className="space-y-4">
              {localSettings.defaultDeductions.map((deduction, index) => (
                <div key={deduction.id} className="bg-white p-4 rounded-lg border border-red-200">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        placeholder="Deduction name"
                        value={deduction.name}
                        onChange={(e) => updateDeduction(index, 'name', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Amount</label>
                      <input
                        type="number"
                        placeholder="Amount"
                        value={deduction.amount}
                        onChange={(e) => updateDeduction(index, 'amount', Number(e.target.value))}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={deduction.isPercentage ? 'percentage' : 'fixed'}
                        onChange={(e) => updateDeduction(index, 'isPercentage', e.target.value === 'percentage')}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      >
                        <option value="fixed">Fixed</option>
                        <option value="percentage">%</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={deduction.isActive}
                        onChange={(e) => updateDeduction(index, 'isActive', e.target.checked)}
                        className="mr-2"
                      />
                      <label className="text-xs text-gray-700">Active</label>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeDeduction(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      placeholder="Description"
                      value={deduction.description}
                      onChange={(e) => updateDeduction(index, 'description', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company Contributions */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Contributions (%)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Provident Fund</label>
                <input
                  type="number"
                  step="0.1"
                  value={localSettings.companyContributions.providentFund}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    companyContributions: {
                      ...localSettings.companyContributions,
                      providentFund: Number(e.target.value)
                    }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Health Insurance</label>
                <input
                  type="number"
                  value={localSettings.companyContributions.healthInsurance}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    companyContributions: {
                      ...localSettings.companyContributions,
                      healthInsurance: Number(e.target.value)
                    }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Life Insurance</label>
                <input
                  type="number"
                  value={localSettings.companyContributions.lifeInsurance}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    companyContributions: {
                      ...localSettings.companyContributions,
                      lifeInsurance: Number(e.target.value)
                    }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
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
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};