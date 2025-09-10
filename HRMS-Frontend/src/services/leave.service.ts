// leave.service.ts
import { apiClient, ApiResponse, PaginatedResponse } from './api';
import {
  LeaveRequest,
  CreateLeaveRequestDto,
  UpdateLeaveRequestDto,
  ApproveRejectLeaveDto,
  LeaveRequestFilters,
  LeaveStats,
  LeaveBalance,
  Employee,
} from '../types/leaves.types';

class LeaveService {
  private readonly basePath = '/leavemanagement';

  // Fetch all leave requests
  async getLeaveRequests(filters?: LeaveRequestFilters): Promise<ApiResponse<PaginatedResponse<LeaveRequest>>> {
    return apiClient.get(`${this.basePath}`, filters);
  }

  // Get leave by ID
  async getLeaveRequestById(id: string): Promise<ApiResponse<LeaveRequest>> {
    return apiClient.get(`${this.basePath}/${id}`);
  }

  // Create leave request
  async createLeaveRequest(data: CreateLeaveRequestDto): Promise<ApiResponse<LeaveRequest>> {
    return apiClient.post(`${this.basePath}`, data);
  }

  // Update leave request
  async updateLeaveRequest(id: string, data: UpdateLeaveRequestDto): Promise<ApiResponse<LeaveRequest>> {
    return apiClient.put(`${this.basePath}/${id}`, data);
  }

  // Approve or reject leave request (AUTO DEDUCTION handled on backend)
  async approveRejectLeaveRequest(id: string, data: ApproveRejectLeaveDto): Promise<ApiResponse<LeaveRequest>> {
    return apiClient.put(`${this.basePath}/status/${id}`, data);
  }

  // Cancel leave request
  async cancelLeaveRequest(id: string, leaveReason?: string): Promise<ApiResponse<LeaveRequest>> {
    return apiClient.put(`${this.basePath}/cancel/${id}`, { leaveReason });
  }

  // Delete leave request
  async deleteLeaveRequest(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.basePath}/${id}`);
  }

  // Get leave requests for a specific employee
  async getEmployeeLeaveRequests(
    employeeId: string,
    filters?: Omit<LeaveRequestFilters, 'employeeId'>
  ): Promise<ApiResponse<PaginatedResponse<LeaveRequest>>> {
    return apiClient.get(`/employees/${employeeId}${this.basePath}`, filters);
  }

  // Get all pending leave requests
  async getPendingLeaveRequests(filters?: Omit<LeaveRequestFilters, 'status'>): Promise<ApiResponse<PaginatedResponse<LeaveRequest>>> {
    return apiClient.get(`${this.basePath}/pending`, filters);
  }

  // Get leave statistics (used in dashboards)
async getLeaveStats(filters?: Pick<LeaveRequestFilters, 'startDate' | 'endDate' | 'employeeId' | 'approvalStatus'>): Promise<ApiResponse<LeaveStats>> {
  return apiClient.get(`${this.basePath}/stats`, filters);
}

  // Get leave calendar
  async getLeaveCalendar(startDate: string, endDate: string): Promise<ApiResponse<LeaveRequest[]>> {
    return apiClient.get(`${this.basePath}/calendar`, { startDate, endDate });
  }

  // Get leave balance of a single employee
  async getEmployeeLeaveBalances(employeeId: string, year?: number): Promise<ApiResponse<LeaveBalance[]>> {
    return apiClient.get(`/employees/${employeeId}/leave-balances`, { year });
  }
async getEmployeesWithLeaveStats(): Promise<ApiResponse<Employee[]>> {
  return apiClient.get('/employees/leave-stats');
}
  // Get leave balance of all employees
  async getAllLeaveBalances(year?: number): Promise<ApiResponse<LeaveBalance[]>> {
    return apiClient.get('/leave-balances', { year });
  }

  // Update specific leave balance for an employee (used after approval)
  async updateLeaveBalance(employeeId: string, leaveType: string, data: Partial<LeaveBalance>): Promise<ApiResponse<LeaveBalance>> {
    return apiClient.put(`/employees/${employeeId}/leave-balances/${leaveType}`, data);
  }


  
}

export const leaveService = new LeaveService();
