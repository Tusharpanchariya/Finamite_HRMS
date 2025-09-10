import { 
  Department, 
  CreateDepartmentRequest, 
  UpdateDepartmentRequest,
  DepartmentResponse,
  DepartmentsResponse 
} from '../types/department.types';

const API_BASE_URL = 'http://localhost:5000/api';

class DepartmentApiService {
  private getAuthHeaders() {
    // Check both localStorage and sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async handleResponse(response: Response) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }
    
    return data;
  }

  async getAllDepartments(): Promise<DepartmentsResponse> {
    const response = await fetch(`${API_BASE_URL}/department`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }

  async createDepartment(departmentData: CreateDepartmentRequest): Promise<DepartmentResponse> {
    const response = await fetch(`${API_BASE_URL}/department`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(departmentData)
    });

    return this.handleResponse(response);
  }

  async updateDepartment(id: number, departmentData: UpdateDepartmentRequest): Promise<DepartmentResponse> {
    const response = await fetch(`${API_BASE_URL}/department/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(departmentData)
    });

    return this.handleResponse(response);
  }

  async deleteDepartment(id: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/department/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }
}

export const departmentApiService = new DepartmentApiService();