import {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeFilters,
  EmployeeResponse,
  StatutoryDetails,
  CreateStatutoryDetailsRequest,
  UpdateStatutoryDetailsRequest,
  StatutoryDetailsResponse,
  EmployeeWithStatutoryDetails
} from '../types/employee.types';

// The base URL for the backend API.
const API_BASE_URL = 'http://localhost:5000/api';

class EmployeeService {
  // Method to get authorization headers, including a token if available.
  private getAuthHeaders() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Handle API responses with proper error handling
  private async handleResponse(response: Response): Promise<any> {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }
      return data;
    } else {
      const errorText = await response.text();
      throw new Error(`Server responded with status ${response.status} (${response.statusText}). It likely returned a non-JSON response. Please check the API endpoint.`);
    }
  }

  // Employee basic data operations
  async createEmployee(employeeData: CreateEmployeeRequest): Promise<EmployeeResponse> {
    const response = await fetch(`${API_BASE_URL}/employe`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(employeeData)
    });

    return this.handleResponse(response);
  }

  async getAllEmployees(filters?: EmployeeFilters): Promise<EmployeeResponse> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/employe?${queryParams.toString()}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }

  async getEmployeeById(id: number): Promise<EmployeeResponse> {
    const response = await fetch(`${API_BASE_URL}/employe/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }

  async updateEmployee(employeeData: UpdateEmployeeRequest): Promise<EmployeeResponse> {
    const { id, ...updateData } = employeeData;

    if (!id) {
      throw new Error('Employee ID is required for updating.');
    }

    const response = await fetch(`${API_BASE_URL}/employe/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updateData)
    });

    return this.handleResponse(response);
  }

  async updateEmployeestatus(id: number, status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE'): Promise<EmployeeResponse> {
    const response = await fetch(`${API_BASE_URL}/employe/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status })
    });

    return this.handleResponse(response);
  }

  async deleteEmployee(id: number): Promise<EmployeeResponse> {
    const response = await fetch(`${API_BASE_URL}/employe/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }

  // Statutory details operations
  async createStatutoryDetails(statutoryData: CreateStatutoryDetailsRequest): Promise<StatutoryDetailsResponse> {
    const response = await fetch(`${API_BASE_URL}/statutory-details`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(statutoryData)
    });

    return this.handleResponse(response);
  }

  async getStatutoryDetailsByEmployeeId(employeeId: number): Promise<StatutoryDetailsResponse> {
    const response = await fetch(`${API_BASE_URL}/statutory-details?employeeId=${employeeId}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }

  async updateStatutoryDetails(statutoryData: UpdateStatutoryDetailsRequest): Promise<StatutoryDetailsResponse> {
    const { employeeId } = statutoryData;

    const response = await fetch(`${API_BASE_URL}/statutory-details/${employeeId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(statutoryData)
    });

    return this.handleResponse(response);
  }

  async deleteStatutoryDetails(employeeId: number): Promise<StatutoryDetailsResponse> {
    const response = await fetch(`${API_BASE_URL}/statutory-details/${employeeId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }

  // Combined operations for easier use
  async createEmployeeWithStatutoryDetails(
    employeeData: CreateEmployeeRequest,
    statutoryData: Omit<CreateStatutoryDetailsRequest, 'employeeId'>
  ): Promise<{ employee: EmployeeResponse; statutory: StatutoryDetailsResponse }> {
    // First create the employee
    const employeeResponse = await this.createEmployee(employeeData);
    
    if (!employeeResponse.success || !employeeResponse.data) {
      throw new Error('Failed to create employee');
    }

    const employee = Array.isArray(employeeResponse.data) ? employeeResponse.data[0] : employeeResponse.data;
    
    // Then create statutory details if any statutory data is provided
    let statutoryResponse: StatutoryDetailsResponse | null = null;
    const hasStatutoryData = Object.values(statutoryData).some(value => value !== undefined && value !== '');
    
    if (hasStatutoryData) {
      const statutoryRequest: CreateStatutoryDetailsRequest = {
        ...statutoryData,
        employeeId: employee.id
      };
      
      try {
        statutoryResponse = await this.createStatutoryDetails(statutoryRequest);
      } catch (error) {
        console.warn('Failed to create statutory details:', error);
        // Don't throw error here, as employee was created successfully
      }
    }

    return {
      employee: employeeResponse,
      statutory: statutoryResponse || { success: false, message: 'No statutory data provided', data: [] as StatutoryDetails[] }
    };
  }

  async getEmployeeWithStatutoryDetails(employeeId: number): Promise<EmployeeWithStatutoryDetails | null> {
    try {
      // Get employee basic data
      const employeeResponse = await this.getEmployeeById(employeeId);
      if (!employeeResponse.success || !employeeResponse.data) {
        return null;
      }

      const employee = Array.isArray(employeeResponse.data) ? employeeResponse.data[0] : employeeResponse.data;
      
      // Get statutory details
      let statutoryDetails: StatutoryDetails | undefined;
      try {
        const statutoryResponse = await this.getStatutoryDetailsByEmployeeId(employeeId);
        if (statutoryResponse.success && statutoryResponse.data) {
          statutoryDetails = Array.isArray(statutoryResponse.data) ? statutoryResponse.data[0] : statutoryResponse.data;
        }
      } catch (error) {
        console.warn('Failed to fetch statutory details:', error);
        // Continue without statutory details
      }

      return {
        ...employee,
        statutoryDetails
      };
    } catch (error) {
      console.error('Failed to fetch employee with statutory details:', error);
      return null;
    }
  }

  async getAllEmployeesWithStatutoryDetails(filters?: EmployeeFilters): Promise<EmployeeWithStatutoryDetails[]> {
    try {
      // Get all employees
      const employeesResponse = await this.getAllEmployees(filters);
      if (!employeesResponse.success || !employeesResponse.data) {
        return [];
      }

      const employees = Array.isArray(employeesResponse.data) ? employeesResponse.data : [employeesResponse.data];
      
      // Get statutory details for each employee
      const employeesWithStatutory = await Promise.all(
        employees.map(async (employee) => {
          let statutoryDetails: StatutoryDetails | undefined;
          try {
            const statutoryResponse = await this.getStatutoryDetailsByEmployeeId(employee.id);
            if (statutoryResponse.success && statutoryResponse.data) {
              statutoryDetails = Array.isArray(statutoryResponse.data) ? statutoryResponse.data[0] : statutoryResponse.data;
            }
          } catch (error) {
            console.warn(`Failed to fetch statutory details for employee ${employee.id}:`, error);
          }

          return {
            ...employee,
            statutoryDetails
          };
        })
      );

      return employeesWithStatutory;
    } catch (error) {
      console.error('Failed to fetch employees with statutory details:', error);
      return [];
    }
  }

  async updateEmployeeWithStatutoryDetails(
    employeeData: UpdateEmployeeRequest,
    statutoryData: UpdateStatutoryDetailsRequest
  ): Promise<{ employee: EmployeeResponse; statutory: StatutoryDetailsResponse }> {
    // Update employee basic data
    const employeeResponse = await this.updateEmployee(employeeData);
    
    if (!employeeResponse.success) {
      throw new Error('Failed to update employee');
    }

    // Update statutory details
    let statutoryResponse: StatutoryDetailsResponse;
    try {
      statutoryResponse = await this.updateStatutoryDetails(statutoryData);
    } catch (error) {
      // If statutory details don't exist, try to create them
      try {
        const createStatutoryData: CreateStatutoryDetailsRequest = {
          employeeId: statutoryData.employeeId,
          panNumber: statutoryData.panNumber,
          aadhaarNumber: statutoryData.aadhaarNumber,
          bankName: statutoryData.bankName,
          bankAccount: statutoryData.bankAccount,
          ifscCode: statutoryData.ifscCode,
          uanNumber: statutoryData.uanNumber,
          esicNumber: statutoryData.esicNumber,
        };
        statutoryResponse = await this.createStatutoryDetails(createStatutoryData);
      } catch (createError) {
        console.warn('Failed to create statutory details:', createError);
        statutoryResponse = { success: false, message: 'Failed to update statutory details', data: [] as StatutoryDetails[] };
      }
    }

    return {
      employee: employeeResponse,
      statutory: statutoryResponse
    };
  }
}

export const employeeService = new EmployeeService();