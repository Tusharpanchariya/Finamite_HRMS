import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Plus, Search, Filter, User, CalendarDays, ChevronLeft, ChevronRight, Edit3, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Table } from '../ui/Table';
import { useLeaveRequests } from '../../hooks/useLeaveRequest';
import { useEmployees } from '../../hooks/useEmployees';
import { LeaveRequest, Leavestatus, LeaveType } from '../../types/leaves.types';
import LeaveModal from '../Modal/LeaveModal'; // Import the new LeaveModal
import ApproveRejectModal from '../Modal/ApproveRejectModal'; // Import the new ApproveRejectModal
import LeaveDetailsModal from '../Modal/LeaveDetailsModal'; // Import the new LeaveDetailsModal

// Leave Calendar Component
interface LeaveCalendarProps {
  leaveRequests: LeaveRequest[];
}

const LeaveCalendar: React.FC<LeaveCalendarProps> = ({ leaveRequests }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay(); // 0 = Sunday
  const daysInMonth = lastDayOfMonth.getDate();

  // Get previous month's last days to fill the calendar
  const prevMonth = new Date(currentYear, currentMonth - 1, 0);
  const daysInPrevMonth = prevMonth.getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Navigate months
  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Check if a date has any leaves (both approved and pending)
  const getLeaveForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return leaveRequests.filter(request => {
      // Show approved, pending, and cancelled leaves on calendar
      if (request.status === 'rejected') return false;
      const startDate = new Date(request.startDate);
      const endDate = new Date(request.endDate);
      // Normalize dates to compare only date part
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      return checkDate >= startDate && checkDate <= endDate;
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];

    // Previous month's days
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(currentYear, currentMonth - 1, day);
      days.push({
        day,
        date,
        isCurrentMonth: false,
        leaves: getLeaveForDate(date)
      });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      days.push({
        day,
        date,
        isCurrentMonth: true,
        leaves: getLeaveForDate(date)
      });
    }

    // Next month's days to complete the grid
    const totalCells = Math.ceil((firstDayWeekday + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (firstDayWeekday + daysInMonth);

    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(currentYear, currentMonth + 1, day);
      days.push({
        day,
        date,
        isCurrentMonth: false,
        leaves: getLeaveForDate(date)
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

const getLeaveTypeColor = (leaveType: string, status: string) => {
  // Map leave types to Tailwind classes (not just color name)
  const baseColors: Record<string, { bg: string; text: string; border?: string }> = {
    'ANNUAL': { bg: 'bg-blue-500', text: 'text-white' },
    'SICK': { bg: 'bg-red-500', text: 'text-white' },
    'MATERNITY': { bg: 'bg-pink-500', text: 'text-white' },
    'PATERNITY': { bg: 'bg-purple-500', text: 'text-white' },
    'EMERGENCY': { bg: 'bg-orange-500', text: 'text-white' },
    'HALF DAY': { bg: 'bg-teal-500', text: 'text-white' },
    'EARNED': { bg: 'bg-indigo-500', text: 'text-white' },
    'CASUAL': { bg: 'bg-lime-500', text: 'text-white' }
  };

  // Normalize leaveType for matching
  const normalizedType = leaveType?.toUpperCase() || '';
  const color = baseColors[normalizedType] || { bg: 'bg-gray-500', text: 'text-white' };

  if (status?.toUpperCase() === 'APPROVED') {
    return `${color.bg} ${color.text}`;
  } else if (status?.toUpperCase() === 'PENDING') {
    return `${color.bg.replace('-500', '-100')} ${color.text.replace('text-white', `text-${color.bg.split('-')[1]}-700`)} border border-${color.bg.split('-')[1]}-300`;
  } else if (status?.toUpperCase() === 'CANCELLED') {
    return `bg-gray-300 text-gray-700 border border-gray-400 line-through`;
  }

  return `${color.bg} ${color.text}`;
};

  return (
    <div>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={goToPrevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <h3 className="text-xl font-semibold text-gray-900">
            {monthNames[currentMonth]} {currentYear}
          </h3>

          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <button
          onClick={() => setCurrentDate(new Date())}
          className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Today
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-gray-50">
          {dayNames.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const isToday = day.date.getTime() === today.getTime();

            return (
              <div
                key={index}
                className={`min-h-[100px] p-2 border-r border-b border-gray-200 last:border-r-0 ${
                  !day.isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                } hover:bg-gray-50 transition-colors`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  !day.isCurrentMonth
                    ? 'text-gray-400'
                    : isToday
                      ? 'text-white bg-blue-600 w-6 h-6 rounded-full flex items-center justify-center'
                      : 'text-gray-900'
                }`}>
                  {day.day}
                </div>

                {/* Leave indicators */}
               <div className="space-y-1">
  {day.leaves.slice(0, 3).map((leave, leaveIndex) => (
    <div
      key={leaveIndex}
      className={`text-xs px-1 py-0.5 rounded truncate relative ${
        getLeaveTypeColor(leave.leaveType, leave.status)
      }`}
      title={`${leave.employee.fullName} - ${leave.leaveType} (${leave.approvalStatus?.toUpperCase()})`}
    >
      <div className="flex flex-col">
        {/* Employee Name */}
        <span className="text-[11px] font-medium leading-tight truncate">
          {leave.employee.fullName.split(' ')[0]}
        </span>

        {/* Status Badge */}
        <span
          className={`mt-0.5 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium shadow-sm
            ${
              leave.approvalStatus?.toUpperCase() === 'APPROVED'
                ? 'bg-green-100 text-green-700'
                : leave.approvalStatus?.toUpperCase() === 'PENDING'
                ? 'bg-yellow-100 text-yellow-700'
                : leave.approvalStatus?.toUpperCase() === 'CANCELLED'
                ? 'bg-gray-200 text-gray-600'
                : ''
            }
          `}
        >
          {leave.approvalStatus?.toUpperCase() === 'APPROVED' && (
            <>
              <CheckCircle className="w-3 h-3 mr-1" /> Approved
            </>
          )}
          {leave.approvalStatus?.toUpperCase() === 'PENDING' && (
            <>
              <Clock className="w-3 h-3 mr-1" /> Pending
            </>
          )}
          {leave.approvalStatus?.toUpperCase() === 'CANCELLED' && (
            <>
              <XCircle className="w-3 h-3 mr-1" /> Cancelled
            </>
          )}
        </span>
      </div>
    </div>
  ))}

  {day.leaves.length > 3 && (
    <div
      className="text-xs text-gray-500 px-1"
      title={`${day.leaves
        .slice(3)
        .map(
          (l) => `${l.employee.fullName} - ${l.leaveType} (${l.status})`
        )
        .join(', ')}`}
    >
      +{day.leaves.length - 3} more
    </div>
  )}
</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Leave Types */}
          <div>
            <div className="text-sm text-gray-600 font-medium mb-3">Leave Types:</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: 'Annual Leave', color: 'blue' },
                { type: 'SICK', color: 'red' },
                { type: 'MATERNITY', color: 'pink' },
                { type: 'PATERNITY', color: 'purple' },
                { type: 'Emergency Leave', color: 'orange' },
                { type: 'Half Day', color: 'teal' }, // New legend entry
                { type: 'EARNED', color: 'indigo' }, // New legend entry
                { type: 'CASUAL', color: 'lime' } // New legend entry
              ].map(({ type, color }) => (
                <div key={type} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded bg-${color}-500`}></div>
                  <span className="text-sm text-gray-600">{type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* status Types */}
          <div>
            <div className="text-sm text-gray-600 font-medium mb-3">status Indicators:</div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="px-2 py-1 bg-blue-500 text-white text-xs rounded">Approved</div>
                <span className="text-sm text-gray-600">Confirmed leave</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="px-2 py-1 bg-blue-100 text-blue-700 border border-blue-300 text-xs rounded flex items-center">
                  Pending <span className="ml-1">⏳</span>
                </div>
                <span className="text-sm text-gray-600">Awaiting approval</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="px-2 py-1 bg-gray-300 text-gray-700 border border-gray-400 text-xs rounded flex items-center">
                  Cancelled <span className="ml-1">🚫</span>
                </div>
                <span className="text-sm text-gray-600">Leave cancelled by employee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LeaveManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterstatus, setFilterstatus] = useState<Leavestatus | 'all'>('all');
  const [filterType, setFilterType] = useState<LeaveType | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'requests' | 'calendar' | 'balance'>('requests');
  const [showLeaveModal, setShowLeaveModal] = useState(false); // State for new leave request modal visibility

  // Use custom hooks for data management
 const {
  leaveRequests: allLeaveRequests = [],
  loading: leaveRequestsLoading,
  error: leaveRequestsError,
  createLeaveRequest,
  updateLeaveRequest,
  approveRejectLeaveRequest,
  cancelLeaveRequest,
  updateFilters: updateLeaveFilters,
} = useLeaveRequests();

  const {
    employees,
    loading: employeesLoading,
    error: employeesError,
  } = useEmployees();

  // State for approve/reject modal
  const [showApproveRejectModal, setShowApproveRejectModal] = useState(false);
  const [isRejectAction, setIsRejectAction] = useState(false); // true for reject, false for approve
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<LeaveRequest | null>(null);

  // State for leave details modal
  const [showLeaveDetailsModal, setShowLeaveDetailsModal] = useState(false);

  // Filter leave requests
const filteredRequests = Array.isArray(allLeaveRequests)
  ? allLeaveRequests.filter(request => {
      const employeeName = request.employeefullName || '';
      const leaveType = request.leaveType || '';
      const matchesSearch = employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           leaveType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesstatus = filterstatus === 'all' || request.status === filterstatus;
      const matchesType = filterType === 'all' || leaveType === filterType;
      return matchesSearch && matchesstatus && matchesType;
    })
  : []
  console.log('allLeaveRequests:', allLeaveRequests);

const getapprovalStatusBadge = (status: string | null | undefined) => {
  const safeStatus = status ? status.toUpperCase() : 'N/A'; // Safe check before toUpperCase
  switch (safeStatus) {
    case 'APPROVED':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Approved</span>;
    case 'PENDING':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
    case 'REJECTED':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
    case 'CANCELLED':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Cancelled</span>;
    default:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">N/A</span>;
  }
};

  const getLeaveTypeIcon = (type: string) => {
    const icons = {
      'Annual Leave': '🏖️',
      'SICK': '🏥',
      'MATERNITY': '👶',
      'PATERNITY': '👤',
      'Emergency Leave': '🚨',
      'Half Day': '☀️', // Icon for Half Day
      'EARNED': '⏱️', // Icon for EARNED
      'CASUAL': '🚶', // Icon for Casual Leave
    };
    return icons[type as keyof typeof icons] || '📅';
  };
const getStatusBadge = (status?: string | null) => {
  const styles: Record<string, string> = {
    PRESENT: 'bg-green-100 text-green-800',
    ABSENT: 'bg-red-100 text-red-800',
    LATE: 'bg-yellow-100 text-yellow-800',
    HALF_DAY: 'bg-teal-100 text-teal-800',
    UNKNOWN: 'bg-gray-100 text-gray-800',
  };

  // Normalize and handle null/undefined/empty string safely
  const safeStatus = (status && status.trim() !== '')
    ? status.trim().toUpperCase()
    : 'UNKNOWN';

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${
        styles[safeStatus] || styles.UNKNOWN
      }`}
    >
      {safeStatus}
    </span>
  );
};

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString();
    }

    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  const calculateDaysBetweenDates = (startDateStr: string, endDateStr: string) => {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end day
    return diffDays;
  };

  // Handler for approving/rejecting leave
const handleApproveReject = async (
  requestId: string,
  status: 'approved' | 'rejected',
  leaveReason: string
) => {
  try {
    await approveRejectLeaveRequest(requestId, {
      approvalStatus: status, // FIXED
      leaveReason
    });
  } catch (error) {
    console.error('Failed to update leave request:', error);
    // Optionally show a toast notification here
  }
};
  // Handler for editing leave dates
  const handleEditLeaveRequest = async (requestId: string, newStartDate: string, newEndDate: string) => {
    try {
      await updateLeaveRequest(requestId, {
        startDate: newStartDate,
        endDate: newEndDate,
      });
      setShowLeaveDetailsModal(false); // Close modal after editing
    } catch (error) {
      console.error('Failed to update leave request:', error);
      // You might want to show a toast notification here
    }
  };

  // Handler for cancelling leave
  const handleCancelLeaveRequest = async (requestId: string, leaveReason?: string) => {
    try {
      await cancelLeaveRequest(requestId, leaveReason);
      setShowLeaveDetailsModal(false); // Close modal after cancellation
    } catch (error) {
      console.error('Failed to cancel leave request:', error);
      // You might want to show a toast notification here
    }
  };

  // Handlers to open modals
const openApproveModal = (request: LeaveRequest) => {
  setSelectedLeaveRequest(request);
  setIsRejectAction(false);
  setShowApproveRejectModal(true);
};

const openRejectModal = (request: LeaveRequest) => {
  setSelectedLeaveRequest(request);
  setIsRejectAction(true);
  setShowApproveRejectModal(true);
};

const openLeaveDetailsModal = (request: LeaveRequest) => {
  setSelectedLeaveRequest(request);
  setShowLeaveDetailsModal(true);
};

  // Leave requests table columns
 const requestColumns = [
 {
  key: 'employeeName',
  label: 'Employee',
  render: (_: any, row: LeaveRequest) => {
    const employeeName = row.employee?.fullName || ''; // FIXED HERE
    return (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-blue-600">
            {employeeName
              ? employeeName.split(' ').map((n: string) => n[0]).join('')
              : 'NA'}
          </span>
        </div>
        <span className="font-medium text-gray-900">{employeeName || 'N/A'}</span>
      </div>
    );
  }
},
  {
    key: 'leaveType',
    label: 'Leave Type',
    render: (value: string) => (
      <div className="flex items-center space-x-2">
        <span className="text-lg">{getLeaveTypeIcon(value)}</span>
        <div>
          <p className="font-medium text-gray-900 text-sm">{value}</p>
          {getStatusBadge(value)}
        </div>
      </div>
    )
  },
  {
    key: 'dateRange',
    label: 'Date Range',
    render: (_: any, row: LeaveRequest) => (
      <div>
        <p className="font-medium text-gray-900 text-sm">
          {formatDateRange(row.startDate || '', row.endDate || '')}
        </p>
        <p className="text-xs text-gray-500">{(row.days || 0)} day{(row.days || 0) !== 1 ? 's' : ''}</p>
      </div>
    )
  },
  {
    key: 'leaveReason',
    label: 'leaveReason',
    render: (value: string) => (
      <div className="max-w-xs">
        <p className="text-sm text-gray-900 truncate" title={value}>
          {value}
        </p>
      </div>
    )
  },
{
    key: 'approvalStatus', // Ensure this matches your LeaveRequest interface
    label: 'Approval Status',
    render: (_: any, row: any) => {
      // console.log('Rendering approvalStatus for row:', row); // Debug log
      const approvalStatus = row.approvalStatus || 'N/A'; // Fallback for null/undefined
      return getapprovalStatusBadge(approvalStatus);
    }
  },
 {
  key: 'actions',
  label: 'Actions',
  render: (_: any, row: LeaveRequest) => (
    <div className="flex items-center space-x-2">
      {row.approvalStatus?.toLowerCase() === 'pending' && ( // FIXED HERE
        <>
          <button
            className="p-1 text-green-600 hover:bg-green-50 rounded"
            title="Approve"
            onClick={() => openApproveModal(row)}
          >
            <CheckCircle className="w-4 h-4" />
          </button>
          <button
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Reject"
            onClick={() => openRejectModal(row)}
          >
            <XCircle className="w-4 h-4" />
          </button>
        </>
      )}
      <button
        className="p-1 text-gray-600 hover:bg-gray-50 rounded"
        title="View Details"
        onClick={() => openLeaveDetailsModal(row)}
      >
        <Calendar className="w-4 h-4" />
      </button>
    </div>
  )
}
];
  // Calculate stats
const pendingRequests = allLeaveRequests?.filter(
  r => r.approvalStatus?.toUpperCase() === 'PENDING'
).length ?? 0;

const approvedRequests = allLeaveRequests?.filter(
  r => r.approvalStatus?.toUpperCase() === 'APPROVED'
).length ?? 0;

const rejectedRequests = allLeaveRequests?.filter(
  r => r.approvalStatus?.toUpperCase() === 'REJECTED'
).length ?? 0;

const cancelledRequests = allLeaveRequests?.filter(
  r => r.approvalStatus?.toUpperCase() === 'CANCELLED'
).length ?? 0;
  // Get unique leave types and statuses for filters
  // Ensure new leave types and 'cancelled' status are included in the filter options
const leaveTypes = [...new Set(Array.isArray(allLeaveRequests) ? allLeaveRequests.map(r => r.leaveType) : [])]
  const statuses = ['pending', 'approved', 'rejected']; // Added 'cancelled'

  // Mock leave balances for employees
const leaveBalances = employees?.map(emp => ({
  employeeId: emp.id,
  fullName: emp.fullName,
  annualLeave: {
    total: 24, // yearly quota
    used: emp.annualUsed || 0,
    remaining: 24 - (emp.annualUsed || 0)
  },
  sickLeave: {
    total: 12,
    used: emp.sickUsed || 0,
    remaining: 12 - (emp.sickUsed || 0)
  },
  earnedLeave: {
    total: emp.earnedTotal || 0, // depends on accrual policy
    used: emp.earnedUsed || 0,
    remaining: (emp.earnedTotal || 0) - (emp.earnedUsed || 0)
  },
  maternityLeave: emp.gender === 'female' ? {
    total: 182, // ~26 weeks
    used: emp.maternityUsed || 0,
    remaining: 182 - (emp.maternityUsed || 0)
  } : null,
  unpaidLeave: {
    total: 0, // unpaid leaves have no quota
    used: emp.unpaidUsed || 0,
    remaining: 0
  }
})) || [];

const handleAddLeaveRequest = async (newRequest: any) => {
  try {
    await createLeaveRequest({
      employeeId: newRequest.employeeId,
      leaveType: newRequest.leaveType,
      leaveReason: newRequest.leaveReason,
      startDate: newRequest.startDate,
      endDate: newRequest.endDate,
    });

    setShowLeaveModal(false);

    // 🔄 Refetch all leave requests after creating new one
    await useLeaveRequests();
  } catch (error: any) {
    console.error('Failed to create leave request:', error.message || error);
  }
};


  // Show loading state
  if (leaveRequestsLoading || employeesLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-15xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (leaveRequestsError || employeesError) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-15xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
              <p className="text-gray-600">{leaveRequestsError || employeesError}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-15xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Leave Management</h1>
            <p className="text-gray-600">Manage employee leave requests and track balances</p>
          </div>
          <button
            onClick={() => setShowLeaveModal(true)} // Open modal on click
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>New Leave Request</span>
          </button>
        </div>

        {/* Leave Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{pendingRequests}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{approvedRequests}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{rejectedRequests}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Cancelled</p> {/* New stat */}
                <p className="text-2xl font-bold text-gray-900">{cancelledRequests}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <Trash2 className="w-6 h-6 text-gray-600" /> {/* Icon for cancelled */}
              </div>
            </div>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              activeTab === 'requests'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <AlertCircle className="w-4 h-4 inline mr-2" />
            Leave Requests
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              activeTab === 'calendar'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Leave Calendar
          </button>
          <button
            onClick={() => setActiveTab('balance')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              activeTab === 'balance'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Leave Balances
          </button>
        </div>

        {/* Filters - Only show for requests tab */}
        {activeTab === 'requests' && (
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search employees or leave type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full sm:w-64"
                  />
                </div>

                {/* status Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={filterstatus}
                    onChange={(e) => setFilterstatus(e.target.value as Leavestatus | 'all')}
                    className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                  >
                    <option value="all">All status</option>
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type Filter */}
                <div className="relative">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as LeaveType | 'all')}
                    className="pl-4 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                  >
                    <option value="all">All Leave Types</option>
                    {leaveTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Content based on active tab */}
        {activeTab === 'requests' && (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Leave Requests ({filteredRequests.length})
                </h2>
                <p className="text-sm text-gray-500">
                  {searchTerm && `Showing results for "${searchTerm}"`}
                  {filterstatus !== 'all' && ` filtered by ${filterstatus}`}
                  {filterType !== 'all' && ` type: ${filterType}`}
                </p>
              </div>
            </div>

            <Table columns={requestColumns} data={filteredRequests} />
          </Card>
        )}

        {activeTab === 'calendar' && (
          <Card>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Leave Calendar</h2>
              <p className="text-sm text-gray-500">Visual calendar view of employee leaves</p>
            </div>

            <LeaveCalendar leaveRequests={allLeaveRequests || []} />
          </Card>
        )}

        {activeTab === 'balance' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {leaveBalances.map(employee => (
              <Card key={employee.id}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {employee.fullName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{employee.fullName}</h3>
                    <p className="text-sm text-gray-500">{employee.position}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Annual Leave */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">🏖️ Annual Leave</span>
                      <span className="text-sm text-gray-600">
                        {employee.annualLeave.remaining}/{employee.annualLeave.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(employee.annualLeave.remaining / employee.annualLeave.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* SICK */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">🏥 SICK</span>
                      <span className="text-sm text-gray-600">
                        {employee.sickLeave.remaining}/{employee.sickLeave.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${(employee.sickLeave.remaining / employee.sickLeave.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* PATERNITY */}
                  {/* <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">👤 PATERNITY</span>
                      <span className="text-sm text-gray-600">
                        {employee.personalLeave.remaining}/{employee.personalLeave.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${(employee.personalLeave.remaining / employee.personalLeave.total) * 100}%` }}
                      ></div>
                    </div>
                  </div> */}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Leave Request Modal (for adding new requests) */}
      <LeaveModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onSubmit={handleAddLeaveRequest}
        employees={employees || []}
      />

      {/* Approve/Reject Leave Modal */}
      <ApproveRejectModal
        isOpen={showApproveRejectModal}
        onClose={() => setShowApproveRejectModal(false)}
        onSubmit={handleApproveReject}
        isReject={isRejectAction}
        currentRequest={selectedLeaveRequest}
      />

      {/* Leave Details Modal */}
      <LeaveDetailsModal
        isOpen={showLeaveDetailsModal}
        onClose={() => setShowLeaveDetailsModal(false)}
        currentRequest={selectedLeaveRequest}
        onEdit={handleEditLeaveRequest}
        onCancelLeave={handleCancelLeaveRequest}
      />
    </div>
  );
};

function getapprovalStatusBadge(approvalStatus: any) {
  throw new Error('Function not implemented.');
}
