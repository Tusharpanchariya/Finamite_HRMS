import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const attendanceApi = axios.create({
  baseURL: `${API_BASE_URL}/attendance`,
});

// Add request interceptor to include auth token
attendanceApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
attendanceApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface AttendanceRecord {
  totalHours: number;
  overtimeHours: number;
  id: string;
  employeeId: number;
  employeeName: string;
  attendanceDate: string;
  inTime: string;
  outTime: string;
  hoursWorked: number;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE' | 'HOLIDAY';
  overtime: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAttendanceRequest {
  employeefullName: any;
  employeeId: number;
  employeeName: string;
  attendanceDate: string;
  inTime?: string | null;
  outTime?: string | null;
  status?: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE' | 'HOLIDAY';
}

export interface UpdateAttendanceRequest extends Partial<CreateAttendanceRequest> {
  hoursWorked?: number;
  overtime?: number;
}

export interface AttendanceFilters {
  page?: number;
  limit?: number;
  employeeName?: string;
  status?: string;
  month?: number;
  year?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface AttendanceResponse {
  attendances: AttendanceRecord[];
  total: number;
  page: number;
  totalPages: number;
  success: boolean;
  data?: AttendanceRecord;
  pagination?: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

export interface BulkUploadResponse {
  success: number;
  failed: number;
  errors: string[];
}

class AttendanceService {
  // Create manual attendance
  async createManualAttendance(data: CreateAttendanceRequest): Promise<AttendanceRecord> {
    const response = await attendanceApi.post('/manual', data);
    return response.data;
  }

  // Get all attendances with filters
  async getAllAttendances(filters: AttendanceFilters = {}): Promise<AttendanceResponse> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await attendanceApi.get(`/?${params.toString()}`);
    return response.data;
  }

  // Get attendance by ID
  async getAttendanceById(id: string): Promise<AttendanceRecord> {
    const response = await attendanceApi.get(`/${id}`);
    return response.data;
  }

  // Update attendance
  async updateAttendance(id: string, data: UpdateAttendanceRequest): Promise<AttendanceRecord> {
    const response = await attendanceApi.put(`/${id}`, data);
    return response.data;
  }

  // Delete attendance
  async deleteAttendance(id: string): Promise<{ message: string }> {
    const response = await attendanceApi.delete(`/${id}`);
    return response.data;
  }

  // Bulk upload attendance
async bulkUploadAttendance(file: File): Promise<BulkUploadResponse> {
  const formData = new FormData();
  formData.append('file', file); // <-- must match backend

  const response = await attendanceApi.post('/upload', formData);
  return response.data;
}
}

export const attendanceService = new AttendanceService();