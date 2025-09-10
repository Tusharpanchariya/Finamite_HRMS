import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Save, Loader2 } from 'lucide-react';
import { attendanceService, CreateAttendanceRequest } from '../../services/attendanceApi';
import { employeeService } from '../../services/employee.service';
import { Employee } from '../../types/employee.types';

interface AddAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddAttendanceModal: React.FC<AddAttendanceModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CreateAttendanceRequest>({
    employeeId: 0,
    employeeName: '',
    attendanceDate: new Date().toISOString().split('T')[0],
    inTime: '',
    outTime: '',
    status: 'PRESENT',
  });

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen]);

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await employeeService.getAllEmployees();
      if (response.success && response.data) {
        const employeeList = Array.isArray(response.data) ? response.data : [response.data];
        setEmployees(employeeList);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees');
    } finally {
      setLoadingEmployees(false);
    }
  };

  const isValidTime = (time: string) => {
    // Validate time format (HH:mm, e.g., "09:00")
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const combineDateTime = (date: string, time: string) => {
    if (!date || !time || !isValidTime(time)) return null;
    const dateTime = new Date(`${date}T${time}:00Z`);
    return isNaN(dateTime.getTime()) ? null : dateTime.toISOString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate inputs
    if (formData.inTime && !isValidTime(formData.inTime)) {
      setError('Invalid check-in time format. Please use HH:mm (e.g., 09:00).');
      setLoading(false);
      return;
    }
    if (formData.outTime && !isValidTime(formData.outTime)) {
      setError('Invalid check-out time format. Please use HH:mm (e.g., 17:00).');
      setLoading(false);
      return;
    }

    try {
      const submitData: CreateAttendanceRequest = {
        employeeId: formData.employeeId,
        employeeName: formData.employeefullName,
        attendanceDate: new Date(formData.attendanceDate).toISOString().split('T')[0], // Date only
        inTime: formData.inTime ? combineDateTime(formData.attendanceDate, formData.inTime) : null,
        outTime: formData.outTime ? combineDateTime(formData.attendanceDate, formData.outTime) : null,
        status: formData.status.toUpperCase() as 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE' | 'HOLIDAY',
        employeefullName: undefined
      };

      console.log("Submitting Attendance:", submitData);

      const response = await attendanceService.createManualAttendance(submitData);

      if (response) {
        onSuccess();
        onClose();
        setFormData({
          employeeId: 0,
          employeeName: '',
          attendanceDate: new Date().toISOString().split('T')[0],
          inTime: '',
          outTime: '',
          status: 'PRESENT',
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create attendance record');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateAttendanceRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Add Attendance Entry</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Employee
            </label>
            <select
              value={formData.employeeId || ''}
              onChange={(e) => {
                const selectedId = Number(e.target.value);
                const emp = employees.find(emp => emp.id === selectedId);
                if (emp) {
                  setFormData(prev => ({
                    ...prev,
                    employeeId: emp.id,
                    employeeName: emp.fullName,
                  }));
                }
              }}
              required
              disabled={loadingEmployees}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">
                {loadingEmployees ? 'Loading employees...' : 'Select Employee'}
              </option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.fullName} - {employee.departmentName || 'No Department'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date
            </label>
            <input
              type="date"
              value={formData.attendanceDate}
              onChange={(e) => handleInputChange('attendanceDate', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Check In Time
              </label>
              <input
                type="time"
                value={formData.inTime}
                onChange={(e) => handleInputChange('inTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Check Out Time
              </label>
              <input
                type="time"
                value={formData.outTime}
                onChange={(e) => handleInputChange('outTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
              <option value="HALF_DAY">Half Day</option>
              <option value="LEAVE">Leave</option>
              <option value="HOLIDAY">Holiday</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || loadingEmployees}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{loading ? 'Saving...' : 'Save Entry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};