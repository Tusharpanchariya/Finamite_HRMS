import { useState, useEffect, useCallback } from 'react';
import { employeeService } from '../services/employee.service';
import {
  Employee,
  EmployeeFilters,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
} from '../types/employee.types';

export const useEmployees = (initialFilters?: EmployeeFilters) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<EmployeeFilters>(initialFilters || {});

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await employeeService.getAllEmployees({ ...filters, page: currentPage });

      if (response.success) {
        const data = Array.isArray(response.data) ? response.data : [response.data];
        setEmployees(data);
        setTotalCount(response.total ?? data.length);
      } else {
        setError(response.message || 'Failed to fetch employees');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  const createEmployee = async (data: CreateEmployeeRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await employeeService.createEmployee(data);

      if (response.success) {
        await fetchEmployees();
        return response.data;
      } else {
        setError(response.message || 'Failed to create employee');
        throw new Error(response.message || 'Failed to create employee');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (data: UpdateEmployeeRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await employeeService.updateEmployee(data);

      if (response.success) {
        setEmployees(prev =>
          prev.map(emp => emp.id === data.id ? response.data : emp)
        );
        return response.data;
      } else {
        setError(response.message || 'Failed to update employee');
        throw new Error(response.message || 'Failed to update employee');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await employeeService.deleteEmployee(id);

      if (response.success) {
        setEmployees(prev => prev.filter(emp => emp.id !== id));
        setTotalCount(prev => prev - 1);
      } else {
        setError(response.message || 'Failed to delete employee');
        throw new Error(response.message || 'Failed to delete employee');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: Partial<EmployeeFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,
    loading,
    error,
    totalCount,
    currentPage,
    filters,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    updateFilters,
    changePage,
    refetch: fetchEmployees,
  };
};

// Hook for a single employee
export const useEmployee = (id: number) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployee = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await employeeService.getEmployeeById(id);

      if (response.success) {
        const data = Array.isArray(response.data) ? response.data[0] : response.data;
        setEmployee(data);
      } else {
        setError(response.message || 'Failed to fetch employee');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  return {
    employee,
    loading,
    error,
    refetch: fetchEmployee,
  };
};