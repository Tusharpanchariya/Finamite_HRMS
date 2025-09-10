import React, { useState, useEffect } from 'react';
import { X, CalendarDays, User, Tag, FileText, Clock } from 'lucide-react';
import { Employee } from '../../types/leaves.types';

interface LeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (leaveRequest: any) => void;
  employees: Employee[];
}

const LeaveModal: React.FC<LeaveModalProps> = ({ isOpen, onClose, onSubmit, employees }) => {
const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [leaveType, setLeaveType] = useState('');
  const [leaveleaveReason, setLeaveleaveReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalLeaveDays, setTotalLeaveDays] = useState(0);

  // Effect to reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setEmployeeId('');
      setLeaveType('');
      setLeaveleaveReason('');
      setStartDate('');
      setEndDate('');
      setTotalLeaveDays(0);
    }
  }, [isOpen]);

  // Effect to calculate total leave days
  useEffect(() => {
    if (leaveType === 'Half Day') {
      setTotalLeaveDays(0.5);
      setEndDate(startDate); // For half day, end date is same as start date
    } else if (leaveType === 'EARNED') {
      setTotalLeaveDays(0.25);
      setEndDate(startDate); // For EARNED, end date is same as start date
    } else if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      // Ensure end date is not before start date
      if (end < start) {
        setTotalLeaveDays(0);
        return;
      }
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end day
      setTotalLeaveDays(diffDays);
    } else {
      setTotalLeaveDays(0);
    }
  }, [leaveType, startDate, endDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
 const selectedEmployee = employees.find(emp => emp.id === employeeId);
  if (!selectedEmployee) {
    console.error("Selected employee not found.");
    return;
  }

  const newLeaveRequest = {
    id: `req-${Date.now()}`,
    employeeId: selectedEmployee.id,
    employeefullName: selectedEmployee.fullName,
    leaveType,
    leaveReason: leaveleaveReason,
    startDate,
    endDate,
    days: totalLeaveDays,
    approvalstatus: 'pending',
    requestedDate: new Date().toISOString().split('T')[0],
  };
  onSubmit(newLeaveRequest);
  onClose();
};


  const availableLeaveTypes = [
    'Annual Leave',
    'SICK',
    'MATERNITY',
    'PATERNITY',
    'Emergency Leave',
    'Half Day',
    'EARNED',
    'CASUAL',
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative transform transition-all duration-300 scale-100 opacity-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">New Leave Request</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Employee Name Dropdown */}
          <div>
            <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline-block w-4 h-4 mr-1 text-gray-500" /> Employee Name
            </label>
<select
  id="employeeName"
  value={employeeId ?? ""}   // if null, show empty string
  onChange={(e) => setEmployeeId(Number(e.target.value))}
  required
  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
>
  <option value="" disabled>Select Employee</option>
  {employees.map((employee) => (
    <option key={employee.id} value={employee.id}>
      {employee.fullName}
    </option>
  ))}
</select>
          </div>

          {/* Leave Type Dropdown */}
          <div>
            <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="inline-block w-4 h-4 mr-1 text-gray-500" /> Leave Type
            </label>
            <select
              id="leaveType"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              required
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
            >
              <option value="" disabled>Select Leave Type</option>
              {availableLeaveTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Leave leaveReason Textarea */}
          <div>
            <label htmlFor="leaveleaveReason" className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline-block w-4 h-4 mr-1 text-gray-500" /> Leave leaveReason
            </label>
            <textarea
              id="leaveleaveReason"
              rows={3}
              value={leaveleaveReason}
              onChange={(e) => setLeaveleaveReason(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-y"
              placeholder="Briefly describe your leaveReason for leave..."
            ></textarea>
          </div>

          {/* Start Date and End Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                <CalendarDays className="inline-block w-4 h-4 mr-1 text-gray-500" /> Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                <CalendarDays className="inline-block w-4 h-4 mr-1 text-gray-500" /> End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required={!['Half Day', 'EARNED'].includes(leaveType)} // End date not required for half/short day
                disabled={['Half Day', 'EARNED'].includes(leaveType)} // Disable for half/short day
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  ['Half Day', 'EARNED'].includes(leaveType) ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              />
            </div>
          </div>

          {/* Total Leave Days (Auto) */}
          <div>
            <label htmlFor="totalDays" className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline-block w-4 h-4 mr-1 text-gray-500" /> Total Leave Days
            </label>
            <input
              type="text"
              id="totalDays"
              value={totalLeaveDays}
              readOnly
              className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm p-2 sm:text-sm text-gray-700 cursor-not-allowed"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveModal;
