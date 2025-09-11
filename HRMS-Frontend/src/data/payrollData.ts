import { PayrollRecord, PayrollComponent, PayrollSettings } from '../types';
import { extendedMockEmployees, mockAttendanceRecords } from './mockData';

// ✅ Currency Formatter (always INR $)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",     // 👈 This ensures $ instead of $
    maximumFractionDigits: 0,
  }).format(amount);
};

export const defaultPayrollComponents: PayrollComponent[] = [
  {
    id: '1',
    name: 'House Rent Allowance',
    type: 'allowance',
    amount: 40,
    isPercentage: true,
    isRecurring: true,
    description: 'Housing allowance - 40% of basic salary'
  },
  {
    id: '2',
    name: 'Medical Allowance',
    type: 'allowance',
    amount: 1500,
    isPercentage: false,
    isRecurring: true,
    description: 'Monthly medical allowance'
  },
  {
    id: '3',
    name: 'Transport Allowance',
    type: 'allowance',
    amount: 800,
    isPercentage: false,
    isRecurring: true,
    description: 'Transportation allowance'
  },
  {
    id: '4',
    name: 'Income Tax',
    type: 'deduction',
    amount: 15,
    isPercentage: true,
    isRecurring: true,
    description: 'Income tax deduction - 15% of gross salary'
  },
  {
    id: '5',
    name: 'Social Security',
    type: 'deduction',
    amount: 8,
    isPercentage: true,
    isRecurring: true,
    description: 'Social security contribution - 8% of basic salary'
  },
  {
    id: '6',
    name: 'Health Insurance',
    type: 'deduction',
    amount: 500,
    isPercentage: false,
    isRecurring: true,
    description: 'Monthly health insurance premium'
  }
];

export const payrollSettings: PayrollSettings = {
  workingDaysPerMonth: 22,
  overtimeMultiplier: 1.5,
  defaultAllowances: defaultPayrollComponents.filter(c => c.type === 'allowance'),
  defaultDeductions: defaultPayrollComponents.filter(c => c.type === 'deduction')
};

// Generate mock payroll data
export const mockPayrollRecords: PayrollRecord[] = extendedMockEmployees.slice(0, 6).map((employee, index) => {
  const baseSalary = employee.salary || 50000;
  const presentDays = 20 + Math.floor(Math.random() * 3); // 20-22 days
  const overtimeHours = Math.floor(Math.random() * 10); // 0-10 hours
  const advancePayment = index % 3 === 0 ? Math.floor(Math.random() * 5000) : 0;

  // Calculate allowances
  const allowances: PayrollComponent[] = [
    {
      id: '1',
      name: 'House Rent Allowance',
      type: 'allowance',
      amount: baseSalary * 0.4,
      isPercentage: true,
      isRecurring: true,
      description: 'Housing allowance - 40% of basic salary'
    },
    {
      id: '2',
      name: 'Medical Allowance',
      type: 'allowance',
      amount: 1500,
      isPercentage: false,
      isRecurring: true,
      description: 'Monthly medical allowance'
    },
    {
      id: '3',
      name: 'Transport Allowance',
      type: 'allowance',
      amount: 800,
      isPercentage: false,
      isRecurring: true,
      description: 'Transportation allowance'
    },
    ...(overtimeHours > 0 ? [{
      id: `overtime-${employee.id}`,
      name: 'Overtime Pay',
      type: 'allowance' as const,
      amount: (baseSalary / (payrollSettings.workingDaysPerMonth * 8)) * overtimeHours * payrollSettings.overtimeMultiplier,
      isPercentage: false,
      isRecurring: false,
      description: `Overtime payment for ${overtimeHours} hours`
    }] : [])
  ];

  // Calculate deductions
  const totalAllowances = allowances.reduce((sum, allowance) => sum + allowance.amount, 0);
  const grossSalary = baseSalary + totalAllowances;

  const deductions: PayrollComponent[] = [
    {
      id: '4',
      name: 'Income Tax',
      type: 'deduction',
      amount: grossSalary * 0.15,
      isPercentage: true,
      isRecurring: true,
      description: 'Income tax deduction - 15% of gross salary'
    },
    {
      id: '5',
      name: 'Social Security',
      type: 'deduction',
      amount: baseSalary * 0.08,
      isPercentage: true,
      isRecurring: true,
      description: 'Social security contribution - 8% of basic salary'
    },
    {
      id: '6',
      name: 'Health Insurance',
      type: 'deduction',
      amount: 500,
      isPercentage: false,
      isRecurring: true,
      description: 'Monthly health insurance premium'
    },
    ...(advancePayment > 0 ? [{
      id: `advance-${employee.id}`,
      name: 'Advance Payment',
      type: 'deduction' as const,
      amount: advancePayment,
      isPercentage: false,
      isRecurring: false,
      description: 'Advance salary payment deduction'
    }] : [])
  ];

  const totalDeductions = deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
  const netSalary = grossSalary - totalDeductions;

  return {
    id: `payroll-${employee.id}`,
    employeeId: employee.id,
    employeeName: employee.name,
    period: '2024-01',
    baseSalary,
    allowances,
    deductions,
    grossSalary,
    netSalary,
    workingDays: payrollSettings.workingDaysPerMonth,
    presentDays,
    overtimeHours,
    overtimeRate: baseSalary / (payrollSettings.workingDaysPerMonth * 8) * payrollSettings.overtimeMultiplier,
    advancePayment,
    status: index < 2 ? 'paid' : index < 4 ? 'processed' : 'draft',
    processedDate: index < 4 ? '2024-01-28' : undefined,
    paymentDate: index < 2 ? '2024-01-31' : undefined
  };
});
