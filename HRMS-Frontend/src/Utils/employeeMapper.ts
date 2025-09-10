import {
  Employee,
  CreateEmployeeRequest,
  EmployeeFormData,
  EmployeeWithStatutoryDetails,
  UpdateEmployeeRequest,
  StatutoryDetails,
  CreateStatutoryDetailsRequest,
  UpdateStatutoryDetailsRequest
} from '../types/employee.types';

// Simple form data to API mapping - minimal transformation needed
export const mapFormDataToEmployeeAPI = (formData: EmployeeFormData): CreateEmployeeRequest => {
  return {
    fullName: formData.fullName,
    email: formData.email,
    contactNumber: formData.contactNumber,
    dateOfBirth: formData.dateOfBirth || undefined,
    joiningDate: formData.joiningDate,
    trainingstatus: formData.trainingstatus || undefined,
    emergencyContact: formData.emergencyContact || undefined,
    address: formData.address || undefined,
    city: formData.city || undefined,
    state: formData.state || undefined, // Changed from stateName to state
    pinCode: formData.pinCode || undefined,
    designation: formData.designation || undefined,
    departmentName: formData.departmentName || undefined,
    employeeType: formData.employeeType || undefined,
    status: formData.status || 'ACTIVE',
    avatar: formData.photo || undefined,
  };
};

// Simple statutory data mapping
export const mapFormDataToStatutoryAPI = (formData: EmployeeFormData, employeeId: number): CreateStatutoryDetailsRequest => {
  return {
    employeeId,
    panNumber: formData.panNumber || undefined,
    aadhaarNumber: formData.aadhaarNumber || undefined,
    bankName: formData.bankName || undefined,
    bankAccount: formData.bankAccount || undefined,
    ifscCode: formData.ifscCode || undefined,
    uanNumber: formData.uanNumber || undefined,
    esicNumber: formData.esicNumber || undefined,
  };
};

// Convert API data to form data - direct mapping
export const mapEmployeeToFormData = (employee: EmployeeWithStatutoryDetails): EmployeeFormData => {
  return {
    fullName: employee.fullName || '',
    email: employee.email || '',
    contactNumber: employee.contactNumber || '',
    dateOfBirth: employee.dateOfBirth ? new Date(employee.dateOfBirth).toISOString().split('T')[0] : '',
    joiningDate: employee.joiningDate ? new Date(employee.joiningDate).toISOString().split('T')[0] : '',
    trainingstatus: employee.trainingstatus || '',
    emergencyContact: employee.emergencyContact || '',
    address: employee.address || '',
    city: employee.city || '',
    state: employee.state || '', // Changed from stateName to state
    pinCode: employee.pinCode || '',
    designation: employee.designation || '',
    departmentName: employee.departmentName || '',
    employeeType: employee.employeeType || '',
    status: employee.status || 'ACTIVE',
    avatar: employee.photo || '',
    // Statutory fields
    panNumber: employee.statutoryDetails?.panNumber || '',
    aadhaarNumber: employee.statutoryDetails?.aadhaarNumber || '',
    bankName: employee.statutoryDetails?.bankName || '',
    bankAccount: employee.statutoryDetails?.bankAccount || '',
    ifscCode: employee.statutoryDetails?.ifscCode || '',
    uanNumber: employee.statutoryDetails?.uanNumber || '',
    esicNumber: employee.statutoryDetails?.esicNumber || '',
  };
};

// Update mappings
export const mapFormDataToEmployeeUpdateAPI = (formData: EmployeeFormData, employeeId: number): UpdateEmployeeRequest => {
  return {
    id: employeeId,
    fullName: formData.fullName,
    email: formData.email,
    contactNumber: formData.contactNumber,
    dateOfBirth: formData.dateOfBirth || undefined,
    joiningDate: formData.joiningDate,
    trainingstatus: formData.trainingstatus || undefined,
    emergencyContact: formData.emergencyContact || undefined,
    address: formData.address || undefined,
    city: formData.city || undefined,
    state: formData.state || undefined, // Changed from stateName to state
    pinCode: formData.pinCode || undefined,
    designation: formData.designation || undefined,
    departmentName: formData.departmentName || undefined,
    employeeType: formData.employeeType || undefined,
    status: formData.status || 'ACTIVE',
    avatar: formData.photo || undefined,
  };
};

export const mapFormDataToStatutoryUpdateAPI = (formData: EmployeeFormData, employeeId: number): UpdateStatutoryDetailsRequest => {
  return {
    employeeId,
    panNumber: formData.panNumber || undefined,
    aadhaarNumber: formData.aadhaarNumber || undefined,
    bankName: formData.bankName || undefined,
    bankAccount: formData.bankAccount || undefined,
    ifscCode: formData.ifscCode || undefined,
    uanNumber: formData.uanNumber || undefined,
    esicNumber: formData.esicNumber || undefined,
  };
};

// Helper functions for status formatting
export const getstatusDisplay = (status: string): string => {
  switch (status) {
    case 'ACTIVE':
      return 'Active';
    case 'INACTIVE':
      return 'Inactive';
    case 'ON_LEAVE':
      return 'On Leave';
    default:
      return 'Active';
  }
};

export const getstatusBadgeClass = (status: string): string => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800';
    case 'INACTIVE':
      return 'bg-gray-100 text-gray-800';
    case 'ON_LEAVE':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-green-100 text-green-800';
  }
};

// Legacy function names for backward compatibility
export const mapDisplayToFormData = mapEmployeeToFormData;
export const mapAPIToDisplayData = (employee: EmployeeWithStatutoryDetails): EmployeeWithStatutoryDetails => employee;