// Common types for API responses and data models

import { ReactNode } from "react";

export interface Employee {
  [x: string]: ReactNode;
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  managerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveRequest {
  employee: any;
  Employee: any;
  status: string;
  id: string;
  employeeId: string;
  employeefullName: string;
  leaveType: LeaveType;
  leaveReason: string;
  startDate: string;
  endDate: string;
  days: number;
  approvalStatus: Leavestatus;
  requestedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  approvalleaveReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type LeaveType = 
  | 'Annual Leave'
  | 'SICK'
  | 'MATERNITY'
  | 'PATERNITY'
  | 'Emergency Leave'
  | 'Half Day'
  | 'EARNED'
  | 'CASUAL';

export type Leavestatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export type LeaveBalance = {
employee: any;
employeeId: number;
fullName: string;
annualLeave: { total: number; used: number; remaining: number };
sickLeave: { total: number; used: number; remaining: number };
earnedLeave: { total: number; used: number; remaining: number };
maternityLeave: null | { total: number; used: number; remaining: number };
unpaidLeave: { total: number; used: number; remaining: number };
};

export interface CreateLeaveRequestDto {
  employeeId: string;
  leaveType: LeaveType;
  leaveReason: string;
  startDate: string;
  endDate: string;
}

export interface UpdateLeaveRequestDto {
  startDate?: string;
  endDate?: string;
  leaveReason?: string;
}

export interface ApproveRejectLeaveDto {
  approvalStatus: 'approved' | 'rejected';
  leaveReason?: string;
}

export interface LeaveRequestFilters {
  employeeId?: string;
  approvalStatus?: Leavestatus;
  leaveType?: LeaveType;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface LeaveStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  cancelledRequests: number;
  totalDaysRequested: number;
}