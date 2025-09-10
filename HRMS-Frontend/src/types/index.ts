export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  avatar: string;
  salary: number;
}

export interface LeaveRequest {
  employeefullName: any;
  id: string;
  employeeName: string;
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  leaveReason: string;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveToday: number;
  pendingRequests: number;
  newHires: number;
  totalDepartments: number;
}

export interface Department {
  id: string;
  name: string;
  manager: string;
  employeeCount: number;
  budget: number;
  description: string;
  location: string;
  established: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  hoursWorked: number;
  status: 'present' | 'absent' | 'late' | 'half-day';
  overtime: number;
}

export interface TimeEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  project: string;
  task: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  description: string;
  billable: boolean;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewPeriod: string;
  reviewer: string;
  overallRating: number;
  goals: string[];
  achievements: string[];
  areasForImprovement: string[];
  nextReviewDate: string;
  status: 'draft' | 'completed' | 'pending';
}

export interface Document {
  id: string;
  name: string;
  type: 'contract' | 'policy' | 'handbook' | 'form' | 'certificate';
  category: string;
  uploadDate: string;
  size: string;
  uploadedBy: string;
  description: string;
  isPublic: boolean;
}

export interface ReportData {
  id: string;
  title: string;
  type: 'attendance' | 'performance' | 'payroll' | 'leave' | 'recruitment';
  generatedDate: string;
  generatedBy: string;
  period: string;
  status: 'ready' | 'generating' | 'scheduled';
  downloadUrl?: string;
}