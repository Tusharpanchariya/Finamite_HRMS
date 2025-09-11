// export interface PayrollComponent {
//   id: string;
//   name: string;
//   type: 'allowance' | 'deduction';
//   amount: number;
//   isPercentage: boolean;
//   isRecurring: boolean;
//   description?: string;
// }

// // Defines the structure for a complete payroll record.
// // This is the main data model for a single payslip.
// export interface PayrollRecord {
//   id: number;
//   employeeId: number;
//   employeeName: string;
//   period: string;
//   baseSalary: number;
//   allowances: PayrollComponent[];
//   deductions: PayrollComponent[];
//   grossSalary: number;
//   netSalary: number;
//   workingDays: number;
//   presentDays: number;
//   overtimeHours: number;
//   overtimeRate?: number;
//   advancePayment?: number;
//   status: 'draft' | 'processed' | 'paid';
//   processedDate?: Date;
//   paymentDate?: Date;
// }

// // Defines the structure for creating a new payroll record via the API.
// // Note: It's a subset of PayrollRecord, as some fields are calculated by the backend.
// export interface CreatePayrollRequest {
//   employeeId: number;
//   period: string;
//   baseSalary: number;
//   allowances: PayrollComponent[];
//   deductions: PayrollComponent[];
//   presentDays: number;
//   workingDays: number;
//   overtimeHours: number;
//   advancePayment?: number;
//   status?: 'draft' | 'processed' | 'paid';
//   grossSalary?: number;
//   netSalary?: number;
// }

// // Defines the structure for the global payroll settings.
// // This is used for default values and calculations.
// export interface PayrollSettings {
//   workingDaysPerMonth: number;
//   overtimeMultiplier: number;
//   currency: string;
//   defaultAllowances: PayrollComponent[];
//   defaultDeductions: PayrollComponent[];
//   defaultAdvanceRepaymentMonths?: number;
//   maxAdvancePercentage?: number;
//   taxSettings: {
//     incomeTaxRate: number;
//     socialSecurityRate: number;
//     healthInsuranceRate: number;
//   };
//   companyContributions: {
//     providentFund: number;
//     healthInsurance: number;
//     lifeInsurance: number;
//   };
// }

// // Defines the structure for an employee from mock data.
// // This is used to link a payroll record to an employee's data.
// export interface Employee {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   position: string;
//   salary: number;
//   joiningDate: string;
//   status: string;
//   department: string;
//   role: string;
// }
