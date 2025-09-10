import React, { useState, useEffect } from 'react';
import { Clock, Users, Calendar, CheckCircle, XCircle, AlertCircle, Plus, Search, Filter, Download, Upload, Settings, Loader2, Edit, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Table } from '../ui/Table';
import { AddAttendanceModal } from '../Modal/AddAttendanceModal';
import { attendanceService, AttendanceRecord, AttendanceFilters } from '../../services/attendanceApi';
import { employeeService } from '../../services/employee.service';
import { Employee } from '../../types/employee.types';
import * as XLSX from 'xlsx';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (month: number, year: number, dateFrom: Date, dateTo: Date) => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({ isOpen, onClose, onGenerate }) => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGenerate = () => {
    setError('');
    const fromDate = new Date(`${year}-${String(month).padStart(2, '0')}-${String(dateFrom).padStart(2, '0')}`);
    const toDate = new Date(`${year}-${String(month).padStart(2, '0')}-${String(dateTo).padStart(2, '0')}`);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      setError('Please enter valid dates.');
      return;
    }
    if (fromDate > toDate) {
      setError('Start date cannot be after end date.');
      return;
    }
    if (fromDate.getMonth() + 1 !== month || toDate.getMonth() + 1 !== month || fromDate.getFullYear() !== year || toDate.getFullYear() !== year) {
      setError('Dates must be within the selected month and year.');
      return;
    }

    onGenerate(month, year, fromDate, toDate);
    onClose();
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Generate Attendance Template</h2>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {new Date(year, m - 1, 1).toLocaleString('en-US', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
            <input
              type="number"
              id="dateFrom"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              min="1"
              max="31"
              placeholder="e.g., 1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
            <input
              type="number"
              id="dateTo"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              min="1"
              max="31"
              placeholder="e.g., 31"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Generate Template</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface ParsedAttendanceRecord {
  employeeId: number;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'PRESENT' | 'ABSENT' | 'LEAVE' | 'HALF_DAY';
}

interface UploadAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: ParsedAttendanceRecord[], includeSundays: boolean) => void;
}

const UploadAttendanceModal: React.FC<UploadAttendanceModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [includeSundays, setIncludeSundays] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setError('');
    } else {
      setSelectedFile(null);
    }
  };

  const parseExcelData = (data: Array<Array<any>>): ParsedAttendanceRecord[] => {
    const parsedRecords: ParsedAttendanceRecord[] = [];

    if (data.length < 3) {
      setError('Invalid file format: Not enough rows. Expected at least 3 rows for dates, days, and first employee data.');
      return [];
    }

    const dateRow = data[0];
    const dates: Date[] = [];

    // Start from column C (index 2) since A=Employee ID, B=Employee Name
    for (let i = 2; i < dateRow.length; i++) {
      const cellValue = dateRow[i];

      if (!cellValue || cellValue === '') {
        dates.push(new Date('Invalid Date'));
        continue;
      }

      let parsedDate: Date;

      if (typeof cellValue === 'number') {
        const excelEpoch = new Date(1900, 0, 1);
        const daysSinceEpoch = cellValue - 1;
        parsedDate = new Date(excelEpoch.getTime() + daysSinceEpoch * 24 * 60 * 60 * 1000);
      } else {
        const dateStr = String(cellValue).trim().replace(/^'/, '');

        if (!dateStr) {
          dates.push(new Date('Invalid Date'));
          continue;
        }

        let dateComponents: number[] = [];

        const dmyMatch = dateStr.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
        if (dmyMatch) {
          const day = parseInt(dmyMatch[1], 10);
          const month = parseInt(dmyMatch[2], 10);
          const year = parseInt(dmyMatch[3], 10);
          dateComponents = [year, month - 1, day];
        }
        else if (dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)) {
          const parts = dateStr.split('/');
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10);
          const year = parseInt(parts[2], 10);
          dateComponents = [year, month - 1, day];
        }

        if (dateComponents.length === 3) {
          parsedDate = new Date(dateComponents[0], dateComponents[1], dateComponents[2]);
        } else {
          parsedDate = new Date(dateStr);
        }
      }

      if (!isNaN(parsedDate.getTime())) {
        dates.push(parsedDate);
      } else {
        dates.push(new Date('Invalid Date'));
      }
    }

    for (let i = 2; i < data.length; i += 2) {
      const inTimeRow = data[i];
      const outTimeRow = data[i + 1];

      if (!inTimeRow || !outTimeRow) continue;

      const employeeId = parseInt(String(inTimeRow[0] || '0').trim()) || 0;
      const employeeName = String(inTimeRow[1] || '').trim();

      if (!employeeName || !employeeId) continue;

      dates.forEach((date, dateIndex) => {
        if (isNaN(date.getTime())) return;

        if (!includeSundays && date.getDay() === 0) {
          return;
        }

        const checkInTime = inTimeRow[dateIndex + 2] ? String(inTimeRow[dateIndex + 2]).trim() : '';
        const checkOutTime = outTimeRow[dateIndex + 2] ? String(outTimeRow[dateIndex + 2]).trim() : '';

        if (checkInTime || checkOutTime) {
          const dateString = date.toISOString().split('T')[0];

          let status: ParsedAttendanceRecord['status'] = 'ABSENT';

          if (checkInTime && checkOutTime) {
            status = 'PRESENT';
          } else if (checkInTime) {
            status = 'PRESENT';
          } else if (checkOutTime) {
            status = 'PRESENT';
          }

          parsedRecords.push({
            employeeId: employeeId,
            employeeName: employeeName,
            date: dateString,
            checkIn: checkInTime,
            checkOut: checkOutTime,
            status: status,
          });
        }
      });
    }

    return parsedRecords;
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const parsedData = parseExcelData(json as Array<Array<any>>);
        onUpload(parsedData, includeSundays);
        onClose();
      } catch (err) {
        console.error("Error reading or parsing file:", err);
        setError('Failed to read or parse file. Please ensure it is a valid Excel/CSV format and matches the expected template structure.');
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setLoading(false);
      setError('Error reading file.');
    };
    reader.readAsBinaryString(selectedFile);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Attendance File</h2>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {loading && (
          <div className="flex items-center justify-center mb-4 text-blue-600">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <p>Uploading and processing...</p>
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
            Select Excel/CSV File
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500 mt-2">
            Please upload a file matching the generated template format.
          </p>
        </div>
        <div className="flex items-center mb-6">
          <input
            id="include-sundays"
            type="checkbox"
            checked={includeSundays}
            onChange={(e) => setIncludeSundays(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="include-sundays" className="ml-2 block text-sm text-gray-900">
            Include Sundays in attendance
          </label>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    companyStartTime: string;
    companyEndTime: string;
    overtimeStartTime: string;
  };
  onSave: (newSettings: {
    companyStartTime: string;
    companyEndTime: string;
    overtimeStartTime: string;
  }) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [companyStartTime, setCompanyStartTime] = useState(settings.companyStartTime);
  const [companyEndTime, setCompanyEndTime] = useState(settings.companyEndTime);
  const [overtimeStartTime, setOvertimeStartTime] = useState(settings.overtimeStartTime);

  useEffect(() => {
    setCompanyStartTime(settings.companyStartTime);
    setCompanyEndTime(settings.companyEndTime);
    setOvertimeStartTime(settings.overtimeStartTime);
  }, [settings]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ companyStartTime, companyEndTime, overtimeStartTime });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Company Settings</h2>
        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="companyStartTime" className="block text-sm font-medium text-gray-700 mb-1">
              Company Start Time
            </label>
            <input
              type="time"
              id="companyStartTime"
              value={companyStartTime}
              onChange={(e) => setCompanyStartTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label htmlFor="companyEndTime" className="block text-sm font-medium text-gray-700 mb-1">
              Company End Time
            </label>
            <input
              type="time"
              id="companyEndTime"
              value={companyEndTime}
              onChange={(e) => setCompanyEndTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label htmlFor="overtimeStartTime" className="block text-sm font-medium text-gray-700 mb-1">
              Overtime Start Time
            </label>
            <input
              type="time"
              id="overtimeStartTime"
              value={overtimeStartTime}
              onChange={(e) => setOvertimeStartTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export const AttendancePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterstatus, setFilterstatus] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  const [companySettings, setCompanySettings] = useState({
    companyStartTime: '10:00',
    companyEndTime: '18:30',
    overtimeStartTime: '18:45',
  });

  // Fetch employees for template generation
  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getAllEmployees();
      if (response.success && response.data) {
        const employeeList = Array.isArray(response.data) ? response.data : [response.data];
        setEmployees(employeeList);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch attendance data
  const fetchAttendanceData = async (filters: AttendanceFilters = {}) => {
    try {
      setLoading(true);
      setError('');

      const response = await attendanceService.getAllAttendances({
        ...filters,
        page: filters.page || 1,
        limit: 50,
        employeeName: searchTerm || undefined,
        status: filterstatus !== 'all' ? filterstatus : undefined,
        month: selectedMonth,
        year: selectedYear
      });

      if (response.success) {

setAttendanceData(
  Array.isArray(response.data)
    ? response.data.map((item: any) => {
        const emp = employees.find(e => e.id === item.employeeId);

        // Format date
        const formattedDate = item.attendanceDate
          ? new Date(item.attendanceDate).toLocaleDateString("en-GB") // dd/mm/yyyy
          : "";

        // Format time (in/out)
        const formatTime = (timeString: string) => {
          if (!timeString) return "";
          const d = new Date(timeString);
          return d.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        };

        const record = {
          id: item.id,
          employeeId: item.employeeId,
          employeeName: emp
            ? emp.fullName
            : item.employeeName || `Emp-${item.employeeId}`,
          attendanceDate: formattedDate,
          inTime: formatTime(item.inTime),
          outTime: formatTime(item.outTime),
          hoursWorked: item.hoursWorked || 0,
          overtime: item.overtime || 0,
          status: (item.status || "").toLowerCase(),
        };

        console.log("Mapped Attendance Record:", record);
        return record;
      })
    : []
);




        setPagination({
          page: response.pagination?.page || 1,
          totalPages: response.pagination?.totalPages || 1,
          total: response.pagination?.total || 0
        });
      } else {
        setAttendanceData([]);
        setPagination({ page: 1, totalPages: 1, total: 0 });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch attendance data');
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };


  // Initial load and when filters change
  useEffect(() => {
    fetchAttendanceData();
  }, [searchTerm, filterstatus, selectedMonth, selectedYear]);

  // Handle bulk upload
  const handleBulkUpload = async (parsedData: ParsedAttendanceRecord[]) => {
    try {
      setLoading(true);
      await attendanceService.bulkUploadAttendance(parsedData);
      await fetchAttendanceData(); // Refresh data
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to upload attendance data');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete attendance
  const handleDeleteAttendance = async (id: string) => {
    if (!confirm('Are you sure you want to delete this attendance record?')) {
      return;
    }

    try {
      await attendanceService.deleteAttendance(id);
      await fetchAttendanceData(); // Refresh data
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete attendance record');
    }
  };

  const getstatusBadge = (status: string) => {
    const styles = {
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      late: 'bg-yellow-100 text-yellow-800',
      'half-day': 'bg-blue-100 text-blue-800'
    };

    const icons = {
      present: <CheckCircle className="w-3 h-3 mr-1" />,
      absent: <XCircle className="w-3 h-3 mr-1" />,
      late: <AlertCircle className="w-3 h-3 mr-1" />,
      'half-day': <Clock className="w-3 h-3 mr-1" />
    };

    return (
      <span className={`flex items-center px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status.toUpperCase().replace('-', ' ')}
      </span>
    );
  };

  const formatTime = (time: string) => {
    if (!time) return '-';
    const timeParts = time.split(':');
    let formattedTime = time;
    if (timeParts.length === 2) {
      formattedTime = `${time}:00`;
    }
    return new Date(`2024-01-01T${formattedTime}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

 const attendanceColumns = [
  {
    key: 'employee',
    label: 'Employee',
    render: (_: any, row: AttendanceRecord) => (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-blue-600">
            {(row.employeeName || '').split(' ').map((n: string) => n[0]).join('')}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-900">{row.employeeName}</span>
          {row.employeeId && (
            <p className="text-xs text-gray-500">ID: {row.employeeId}</p>
          )}
        </div>
      </div>
    )
  },
  {
    key: 'attendanceDate',
    label: 'Date',
    // value is already like "30/11/2023"
    render: (value: string) => value || '-'
  },
  {
    key: 'inTime',
    label: 'Check In',
    // value is already like "02:30 PM"
    render: (value: string) => value || '-'
  },
  {
    key: 'outTime',
    label: 'Check Out',
    // value is already like "10:30 PM"
    render: (value: string) => value || '-'
  },
  {
    key: 'hoursWorked',
    label: 'Hours Worked',
    render: (value: number) => value > 0 ? formatDuration(value) : '-'
  },
  {
    key: 'overtime',
    label: 'Overtime',
    render: (value: number) => value > 0 ? (
      <span className="text-orange-600 font-medium">{formatDuration(value)}</span>
    ) : '-'
  },
  {
    key: 'status',
    label: 'status',
    render: (value: string) => getstatusBadge(value)
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (_: any, row: AttendanceRecord) => (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleDeleteAttendance(row.id)}
          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    )
  } 
];


const presentCount = attendanceData?.filter(r => r.status?.toUpperCase() === 'PRESENT').length ?? 0;
const absentCount = attendanceData?.filter(r => r.status?.toUpperCase() === 'ABSENT').length ?? 0;
const lateCount = (attendanceData || []).filter(r => r.status === 'LEAVE').length;
const totalHours = attendanceData?.reduce((sum, r) => sum + (r.totalHours || 0), 0) ?? 0;
const totalOvertime = attendanceData?.reduce((sum, r) => sum + (r.overtimeHours || 0), 0) ?? 0;

  const attendancestatuses = ['PRESENT', 'ABSENT', 'LEAVE', 'HALF_DAY'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const generateAttendanceTemplate = (month: number, year: number, dateFrom: Date, dateTo: Date) => {
    const dates: Date[] = [];
    let currentDate = new Date(dateFrom);
    while (currentDate <= dateTo) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const headerRow = [
      "Emp. ID",
      "Emp. Name",
      "status",
      ...dates.map(date => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const yearFourDigit = String(date.getFullYear());
        return `${day}-${month}-${yearFourDigit}`;
      })
    ];

    const dayNamesRow = [
      "",
      "",
      "",
      ...dates.map(date => date.toLocaleDateString('en-US', { weekday: 'short' }))
    ];

    const csvRows: string[][] = [headerRow, dayNamesRow];

    // Add actual employee rows for template
    const employeesToUse = employees.length > 0 ? employees : [
      { id: 1, fullName: 'John Doe' } as Employee,
      { id: 2, fullName: 'Jane Smith' } as Employee,
      { id: 3, fullName: 'Mike Johnson' } as Employee
    ];

    employeesToUse.forEach(employee => {
      const inTimeRow: string[] = [employee.id.toString(), employee.fullName, "In-time"];
      const outTimeRow: string[] = ["", "", "Out-time"];

      for (let i = 0; i < dates.length; i++) {
        inTimeRow.push('');
        outTimeRow.push('');
      }
      csvRows.push(inTimeRow);
      csvRows.push(outTimeRow);
    });

    const csvContent = csvRows.map(row => row.map(cell => {
      const escapedCell = (cell as string).includes(',') || (cell as string).includes('"') || (cell as string).includes('\n') ? `"${(cell as string).replace(/"/g, '""')}"` : cell;
      return escapedCell;
    }).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Attendance_Template_${year}-${String(month).padStart(2, '0')}_${String(dateFrom.getDate()).padStart(2, '0')}-${String(dateTo.getDate()).padStart(2, '0')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-15xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Attendance Management</h1>
            <p className="text-gray-600">Track employee attendance and working hours</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowTemplateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Generate Template</span>
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Attendance</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Manual Entry</span>
            </button>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Present</p>
                <p className="text-2xl font-bold text-gray-900">{presentCount}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Absent</p>
                <p className="text-2xl font-bold text-gray-900">{absentCount}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Late Arrivals</p>
                <p className="text-2xl font-bold text-gray-900">{lateCount}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900">{formatDuration(totalHours)}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Overtime</p>
                <p className="text-2xl font-bold text-gray-900">{formatDuration(totalOvertime)}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        <Card className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full sm:w-64"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterstatus}
                  onChange={(e) => setFilterstatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                >
                  <option value="all">All status</option>
                  {attendancestatuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-2">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {new Date(selectedYear, m - 1, 1).toLocaleString('en-US', { month: 'long' })}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Showing {(attendanceData || []).length} of {pagination.total} records
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Attendance Records ({pagination.total})
              </h2>
              <p className="text-sm text-gray-500">
                {new Date(selectedYear, selectedMonth - 1, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                {searchTerm && ` • Filtered by "${searchTerm}"`}
                {filterstatus !== 'all' && ` • status: ${filterstatus}`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading attendance data...</span>
            </div>
          ) : (
            <Table columns={attendanceColumns} data={attendanceData || []} />
          )}
        </Card>
      </div>

      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onGenerate={generateAttendanceTemplate}
      />

      <UploadAttendanceModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleBulkUpload}
      />

      <AddAttendanceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => fetchAttendanceData()}
        employees={employees}
        loadingEmployees={loading}
      />


      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={companySettings}
        onSave={setCompanySettings}
      />
    </div>
  );
};