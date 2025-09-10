import { useState, useEffect, useCallback } from 'react';
import { leaveService } from '../services/leave.service';
import {
  LeaveRequest,
  LeaveRequestFilters,
  CreateLeaveRequestDto,
  UpdateLeaveRequestDto,
  ApproveRejectLeaveDto
} from '../types/leaves.types';

export const useLeaveRequests = (initialFilters?: LeaveRequestFilters) => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<LeaveRequestFilters>(initialFilters || {});

  // FIXED: Memoized fetch function
  const fetchLeaveRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/leavemanagement');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setLeaveRequests(Array.isArray(data.data) ? data.data : []);
      if (data.meta?.pagination?.total) {
        setTotalCount(data.meta.pagination.total);
      }
    } catch (err) {
      console.error('Failed to fetch leave requests:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch leave requests');
      setLeaveRequests([]);
    } finally {
      setLoading(false);
    }
  }, []); // <- no dependencies → stable reference

  const createLeaveRequest = async (requestData: CreateLeaveRequestDto) => {
    try {
      const res = await fetch('http://localhost:5000/api/leavemanagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          `Failed to create leave request (status: ${res.status}): ${data.message || JSON.stringify(data)}`
        );
      }
      return data;
    } catch (err) {
      console.error('Error in createLeaveRequest:', err);
      throw err;
    }
  };

  const updateLeaveRequest = async (id: string, data: UpdateLeaveRequestDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await leaveService.updateLeaveRequest(id, data);
      if (response.success) {
        setLeaveRequests(prev => prev.map(req => (req.id === id ? response.data : req)));
        return response.data;
      } else {
        setError(response.message || 'Failed to update leave request');
        throw new Error(response.message || 'Failed to update leave request');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveRejectLeaveRequest = async (id: string, data: ApproveRejectLeaveDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await leaveService.approveRejectLeaveRequest(id, data);
      if (response.success) {
        setLeaveRequests(prev => prev.map(req => (req.id === id ? response.data : req)));
        return response.data;
      } else {
        setError(response.message || 'Failed to update leave request status');
        throw new Error(response.message || 'Failed to update leave request status');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelLeaveRequest = async (id: string, leaveReason?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await leaveService.cancelLeaveRequest(id, leaveReason);
      if (response.success) {
        setLeaveRequests(prev => prev.map(req => (req.id === id ? response.data : req)));
        return response.data;
      } else {
        setError(response.message || 'Failed to cancel leave request');
        throw new Error(response.message || 'Failed to cancel leave request');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLeaveRequest = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await leaveService.deleteLeaveRequest(id);
      if (response.success) {
        setLeaveRequests(prev => prev.filter(req => req.id !== id));
        setTotalCount(prev => prev - 1);
      } else {
        setError(response.message || 'Failed to delete leave request');
        throw new Error(response.message || 'Failed to delete leave request');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: Partial<LeaveRequestFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  // FIXED: Runs only on mount unless fetchLeaveRequests changes
  useEffect(() => {
    fetchLeaveRequests();
  }, [fetchLeaveRequests]);

  return {
    leaveRequests,
    loading,
    error,
    totalCount,
    currentPage,
    filters,
    createLeaveRequest,
    updateLeaveRequest,
    approveRejectLeaveRequest,
    cancelLeaveRequest,
    deleteLeaveRequest,
    updateFilters,
    changePage,
    refetch: fetchLeaveRequests, // Manual refetch when needed
  };
};
