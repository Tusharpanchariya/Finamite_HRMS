import { useCallback, useEffect, useState } from 'react';
import type { Employee, LeaveBalance } from '../types/leaves.types';
import { leaveService } from '../services/leave.service';

export default function useLeaveBalances() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(false);

  // Build leave balances for each employee
const buildBalances = useCallback((data: Employee[]) => {
  return data.map((emp) => ({
    employeeId: emp.id,
    fullName: emp.fullName,
    annualLeave: {
      total: 24,
      used: +(emp.annualUsed ?? 0),
      remaining: Math.max(0, 24 - +(emp.annualUsed ?? 0)),
    },
    sickLeave: {
      total: 12,
      used: +(emp.sickUsed ?? 0),
      remaining: Math.max(0, 12 - +(emp.sickUsed ?? 0)),
    },
    earnedLeave: {
      total: +(emp.earnedTotal ?? 0),
      used: +(emp.earnedUsed ?? 0),
      remaining: Math.max(0, +(emp.earnedTotal ?? 0) - +(emp.earnedUsed ?? 0)),
    },
    maternityLeave: emp.gender === 'female'
      ? {
        total: 182,
        used: +(emp.maternityUsed ?? 0),
        remaining: Math.max(0, 182 - +(emp.maternityUsed ?? 0)),
      }
      : null,
    unpaidLeave: {
      total: 0,
      used: +(emp.unpaidUsed ?? 0),
      remaining: 0,
    },
  })) as unknown as LeaveBalance[];
}, []);


  // Load employee leave balances
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await leaveService.getEmployeesWithLeaveStats();
      const data = response.data || [];
      setEmployees(data);
      setLeaveBalances(buildBalances(data));
    } finally {
      setLoading(false);
    }
  }, [buildBalances]);

  useEffect(() => {
    void load();
  }, [load]);

  // Optional: function to update leave balance in state after approval/cancel
  const updateLeaveBalance = (employeeId: string, updatedBalance: LeaveBalance) => {
    setLeaveBalances((prev) =>
      prev.map((balance) =>
        balance.employee.Id === employeeId ? updatedBalance : balance
      )
    );
  };

  return { employees, leaveBalances, loading, updateLeaveBalance, reload: load };
}
