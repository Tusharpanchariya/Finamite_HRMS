// Backend API models - keeping these as the source of truth
export interface Employee {
  photo: string;
  unpaidUsed: number;
  maternityUsed: number;
  gender: string;
  earnedUsed: number;
  earnedTotal: number;
  sickUsed: number;
  annualUsed: number;
  id: number;
  fullName: string;
  email: string;
  contactNumber: string;
  dateOfBirth?: string;
  joiningDate: string;
  trainingstatus?: string;
  emergencyContact?: string;
  address?: string;
  city?: string;
  state?: string; // Changed from stateName to state
  pinCode?: string;
  designation?: string;
  departmentName?: string;
  employeeType?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Statutory Details API model
export interface StatutoryDetails {
  id?: number;
  employeeId: number;
  employeeCode?: string;
  panNumber?: string;
  aadhaarNumber?: string;
  bankName?: string;
  bankAccount?: string;
  ifscCode?: string;
  uanNumber?: string;
  esicNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEmployeeRequest {
  fullName: string;
  email: string;
  contactNumber: string;
  dateOfBirth?: string;
  joiningDate: string;
  trainingstatus?: string;
  emergencyContact?: string;
  address?: string;
  city?: string;
  state?: string; // Changed from stateName to state
  pinCode?: string;
  designation?: string;
  departmentName?: string;
  employeeType?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  photo?: string;
  userId?: number;
}

export interface CreateStatutoryDetailsRequest {
  employeeId: number;
  employeeCode?: string;
  panNumber?: string;
  aadhaarNumber?: string;
  bankName?: string;
  bankAccount?: string;
  ifscCode?: string;
  uanNumber?: string;
  esicNumber?: string;
}

export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {
  id: number;
} 

export interface UpdateStatutoryDetailsRequest extends Partial<CreateStatutoryDetailsRequest> {
  id?: number;
  employeeId: number;
}

export interface EmployeeFilters {
  searchTerm?: string;
  department?: string;
  name?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface EmployeeResponse {
  success: boolean;
  message: string;
  data: Employee | Employee[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface StatutoryDetailsResponse {
  success: boolean;
  message: string;
  data: StatutoryDetails | StatutoryDetails[];
}

// Combined employee data with statutory details - this becomes our main interface
export interface EmployeeWithStatutoryDetails extends Employee {
  avatar: string;
  department: any;
  photo: string;
  statutoryDetails?: StatutoryDetails;
}

// Frontend form data interface - now matches backend structure
export interface EmployeeFormData {
  photo: string;
  fullName: string;
  email: string;
  contactNumber: string;
  dateOfBirth: string;
  joiningDate: string;
  trainingstatus: string;
  emergencyContact: string;
  address: string;
  city: string;
  state: string; // Changed from stateName to state
  pinCode: string;
  designation: string;
  departmentName: string;
  employeeType: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  // photo: string;
  // Statutory fields
  panNumber: string;
  aadhaarNumber: string;
  bankName: string;
  bankAccount: string;
  ifscCode: string;
  uanNumber: string;
  esicNumber: string;
}

// Remove DisplayEmployee - use EmployeeWithStatutoryDetails directly
export type DisplayEmployee = EmployeeWithStatutoryDetails;

export interface Department {
  id: number;
  name: string;
  description: string;
  manager: string;
  location: string;
  establishDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepartmentRequest {
  name: string;
  description: string;
  manager: string;
  location: string;
  establishDate?: string | null;
}

export interface UpdateDepartmentRequest {
  name?: string;
  description?: string;
  manager?: string;
  location?: string;
  establishDate?: string | null;
}

export interface DepartmentResponse {
  success: boolean;
  message: string;
  data?: Department;
}

export interface DepartmentsResponse {
  success: boolean;
  data: Department[];
}