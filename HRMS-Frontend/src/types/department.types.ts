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