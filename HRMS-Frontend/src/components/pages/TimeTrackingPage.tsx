import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Download,
  Upload,
  User,
  Timer,
  Play,
  Pause,
  Square,
  Users,
  TrendingUp,
  CalendarDays,
  List,
  FileText,
  Table
} from 'lucide-react';

import { TimeEntryModal } from '../Modal/TimeEntryModal';
import { fetchTimeEntries, createTimeEntry, updateTimeEntry, deleteTimeEntry, fetchProjects, fetchEmployees } from '../../services/timeEntries.service';

interface TimeEntry {
  id: number;
  employeeId: number;
  projectId: number;
  task: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  description: string;
  billable: boolean;
  employee: {
    id: number;
    fullName: string;
    role: string;
  };
  project: {
    id: number;
    name: string;
  };
}

export interface TimeEntryForm {
  employeeId: number;
  projectId: number;
  task: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  description: string;
  billable: boolean;
}

type ViewMode = 'week' | 'month';
type ActiveSection = 'timesheet' | 'hours';

export const TimeTrackingPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('timesheet');
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerStart, setTimerStart] = useState<Date | null>(null);
  const [currentTimer, setCurrentTimer] = useState(0);

  // Date range filtering
  const [dateRangeFilter, setDateRangeFilter] = useState({
    from: '',
    to: ''
  });
  
  // Fetch data from API
  useEffect(() => {
    const loadData = async () => {
      try {
      const [entriesResponse, fetchedProjects, fetchedEmployees] = await Promise.all([
  fetchTimeEntries(),
  fetchProjects(),
  fetchEmployees()
]);

// Ensure entries is always an array
const entries = Array.isArray(entriesResponse)
  ? entriesResponse
  : entriesResponse?.data || [];

setTimeEntries(entries);
        setProjects(fetchedProjects);
        setEmployees(fetchedEmployees);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    loadData();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerStart) {
      interval = setInterval(() => {
        setCurrentTimer(Math.floor((Date.now() - timerStart.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerStart]);

  const getProjectColor = (project: string) => {
    const projectColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500'];
    const hash = project.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return projectColors[Math.abs(hash) % projectColors.length];
  };

  // Get current week dates
  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start of week
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };
  
  // Get current month dates
  const getMonthDates = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    const endDate = new Date(lastDay);
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
    
    const dates = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  const getFilteredDateRange = () => {
    if (dateRangeFilter.from && dateRangeFilter.to) {
      const fromDate = new Date(dateRangeFilter.from);
      const toDate = new Date(dateRangeFilter.to);
      const dates = [];
      const currentDate = fromDate;
      while (currentDate <= toDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    }
    return viewMode === 'week' ? getWeekDates(currentDate) : getMonthDates(currentDate);
  };

  const displayDates = getFilteredDateRange();
  const today = new Date().toDateString();
  
  const saveTimeEntry = async (entryData: any) => {
    try {
      if (editingEntry) {
        await updateTimeEntry(editingEntry.id, entryData);
      } else {
        await createTimeEntry(entryData);
      }
      const updatedEntries = await fetchTimeEntries();
      setTimeEntries(updatedEntries);
      setEditingEntry(null);
      setShowAddForm(false);
    } catch (error) {
      console.error("Failed to save time entry:", error);
      alert('Failed to save time entry. Please try again.');
    }
  };

  const editEntry = (entry: TimeEntry) => {
    const entryDate = new Date(entry.date);
    const today = new Date();
    
    // Only allow editing today's entries
    if (entryDate.toDateString() !== today.toDateString()) {
      alert('You can only edit today\'s time entries');
      return;
    }

    setEditingEntry(entry);
    setShowAddForm(true);
  };

  const deleteEntry = async (id: number) => {
    if (confirm('Are you sure you want to delete this time entry?')) {
      try {
        await deleteTimeEntry(id);
        const updatedEntries = await fetchTimeEntries();
        setTimeEntries(updatedEntries);
      } catch (error) {
        console.error("Failed to delete time entry:", error);
        alert('Failed to delete time entry. Please try again.');
      }
    }
  };

const startTimer = () => {
  const now = new Date();
  setAutoStartTime(now); // store start time
  setIsTimerRunning(true);
  setTimerStart(true);
};


  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const stopTimer = async () => {
  const end = new Date();
  setIsTimerRunning(false);

  if (autoStartTime) {
    const durationMs = end.getTime() - autoStartTime.getTime();
    const durationHours = parseFloat((durationMs / (1000 * 60 * 60)).toFixed(2));

    const newEntry = {
      employeeId: selectedEmployeeId, // fetch this dynamically based on your auth/session
      projectId: selectedProjectId,   // from dropdown or current project context
      task: "Auto Timer Entry",
      date: new Date().toISOString(),
      startTime: autoStartTime.toISOString(),
      endTime: end.toISOString(),
      duration: durationHours,
      description: "Automatically logged via timer",
      billable: true
    };

    try {
      await createTimeEntry(newEntry);
      console.log("Auto time entry created!");
      // optionally refresh your list: fetchTimeEntries();
    } catch (error) {
      console.error("Failed to create time entry:", error);
    }
  }

  setAutoStartTime(null);
  setTimerStart(false);
  setCurrentTimer(0);
};

  const formatTimer = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

const filteredEntries = Array.isArray(timeEntries)
  ? timeEntries.filter(entry => {
      if (selectedEmployee !== 'all' && entry.employeeId !== Number(selectedEmployee)) {
        return false;
      }
      if (dateRangeFilter.from && new Date(entry.date) < new Date(dateRangeFilter.from)) {
        return false;
      }
      if (dateRangeFilter.to && new Date(entry.date) > new Date(dateRangeFilter.to)) {
        return false;
      }
      return true;
    })
  : [];

  const getEntriesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredEntries.filter(entry => new Date(entry.date).toISOString().split('T')[0] === dateStr);
  };
  
  const getPeriodTotalHours = () => {
    const dates = displayDates;
    return dates.reduce((total, date) => {
      const dateStr = date.toISOString().split('T')[0];
      const entries = filteredEntries.filter(entry => new Date(entry.date).toISOString().split('T')[0] === dateStr);
      const dayTotal = entries.reduce((sum, entry) => sum + entry.duration, 0);
      return total + dayTotal;
    }, 0);
  };

  const navigatePrevious = () => {
    if (viewMode === 'week') {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
    } else {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() - 1);
      setCurrentDate(newDate);
    }
  };

  const navigateNext = () => {
    if (viewMode === 'week') {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
    } else {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + 1);
      setCurrentDate(newDate);
    }
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
    clearDateFilter();
  };

  const clearDateFilter = () => {
    setDateRangeFilter({ from: '', to: '' });
  };
  
  const getDisplayPeriodText = () => {
    if (dateRangeFilter.from && dateRangeFilter.to) {
      const fromDate = new Date(dateRangeFilter.from);
      const toDate = new Date(dateRangeFilter.to);
      return `${fromDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${toDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    if (viewMode === 'week') {
      const weekDates = getWeekDates(currentDate);
      return `${weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  };

  const getTeamTimesheetData = () => {
    const dates = displayDates;
    const teamData = employees.map(employee => {
      const employeeEntries = filteredEntries.filter(entry => entry.employeeId === employee.id);
      
      const dailyHours = dates.map(date => {
        const dateStr = date.toISOString().split('T')[0];
        const dayEntries = employeeEntries.filter(entry => new Date(entry.date).toISOString().split('T')[0] === dateStr);
        return dayEntries.reduce((total, entry) => total + entry.duration, 0);
      });

      const totalHours = dailyHours.reduce((sum, hours) => sum + hours, 0);
      const billableHours = employeeEntries
        .filter(entry => entry.billable && dates.some(date => new Date(date).toISOString().split('T')[0] === new Date(entry.date).toISOString().split('T')[0]))
        .reduce((sum, entry) => sum + entry.duration, 0);

      return {
        employee,
        dailyHours,
        totalHours,
        billableHours,
        nonBillableHours: totalHours - billableHours
      };
    });
    return teamData;
  };
  const teamTimesheetData = getTeamTimesheetData();

  return (
    <div className="p-6 max-w-15xl mx-auto bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Time Tracking
          </h1>
          <p className="text-gray-600">Track and manage employee working hours</p>
        </div>

        <div className="flex items-center space-x-4 mb-0 w-fit">
          <div className="bg-white rounded-xl p-1 shadow-md border border-gray-200">
            <button
              onClick={() => setActiveSection('timesheet')}
              className={`px-2 py-2 rounded-lg transition-all duration-200 font-medium ${
                activeSection === 'timesheet' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-8 h-5 mr-0" />
            </button>
            <button
              onClick={() => setActiveSection('hours')}
              className={`px-2 py-2 rounded-lg transition-all duration-200 font-medium ${
                activeSection === 'hours' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Table className="w-8 h-5 mr-0" />
            </button>
          </div>

          <div className="mt-0 lg:mt-0 bg-white rounded-xl shadow-lg border border-gray-200 p-2 px-6">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatTimer(currentTimer)}
                </div>
                <div className="text-sm text-gray-500 font-medium">Current Session</div>
              </div>
              <div className="flex space-x-2">
                {!isTimerRunning && !timerStart && (
                  <button
                    onClick={startTimer}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </button>
                )}
                {isTimerRunning && (
                  <button
                    onClick={pauseTimer}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </button>
                )}
                {(isTimerRunning || (!isTimerRunning && timerStart)) && (
                  <button
                    onClick={stopTimer}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Stop
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <div className="bg-white rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">
                {viewMode === 'week' ? 'Week' : 'Month'} Total
              </p>
              <p className="text-blue-600 text-3xl font-bold">{getPeriodTotalHours().toFixed(1)}h</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Today's Hours</p>
              <p className="text-green-600 text-3xl font-bold">{getEntriesForDate(new Date()).reduce((sum, entry) => sum + entry.duration, 0).toFixed(1)}h</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Active Employees</p>
              <p className="text-purple-600 text-3xl font-bold">{employees.length}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col space-y-4 mb-6">
        {/* Top Row - View Toggle & Navigation */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* View Toggle */}
          <div className="flex items-center space-x-2 bg-white rounded-xl p-1 shadow-md border border-gray-200">
            <button
              onClick={() => setActiveSection('timesheet')}
              className={`px-2 py-2 rounded-lg transition-all duration-200 font-medium ${
                activeSection === 'timesheet' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-8 h-5 mr-0" />
            </button>
            <button
              onClick={() => setActiveSection('hours')}
              className={`px-2 py-2 rounded-lg transition-all duration-200 font-medium ${
                activeSection === 'hours' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Table className="w-8 h-5 mr-0" />
            </button>
          </div>

          {/* Period Navigation */}
          <div className="flex items-center space-x-4">
            <button
              onClick={navigatePrevious}
              disabled={!!(dateRangeFilter.from && dateRangeFilter.to)}
              className={`p-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg ${
                dateRangeFilter.from && dateRangeFilter.to
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="text-center bg-white rounded-xl px-6 py-2 shadow-md border border-gray-200">
              <div className="font-bold text-gray-900 text-sm">
                {getDisplayPeriodText()}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                {dateRangeFilter.from && dateRangeFilter.to ? 'Custom Range' : `${viewMode === 'week' ? 'Week' : 'Month'} View`}
              </div>
            </div>
            
            <button
              onClick={navigateNext}
              disabled={!!(dateRangeFilter.from && dateRangeFilter.to)}
              className={`p-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg ${
                dateRangeFilter.from && dateRangeFilter.to
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={navigateToday}
              className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            >
              Today
            </button>
          </div>
        </div>

        {/* Bottom Row - Filters & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Date Range Filter */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-white rounded-xl p-2 shadow-md border border-gray-200">
              <Calendar className="w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={dateRangeFilter.from}
                onChange={(e) => setDateRangeFilter(prev => ({ ...prev, from: e.target.value }))}
                className="border-0 outline-none text-sm font-medium"
                placeholder="From"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                value={dateRangeFilter.to}
                onChange={(e) => setDateRangeFilter(prev => ({ ...prev, to: e.target.value }))}
                className="border-0 outline-none text-sm font-medium"
                placeholder="To"
              />
              {(dateRangeFilter.from || dateRangeFilter.to) && (
                <button
                  onClick={clearDateFilter}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Employee Filter */}
            <div className="relative">
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-md font-medium"
              >
                <option value="all">All Employees</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fullName}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Actions */}
          {activeSection === 'timesheet' && (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => { setShowAddForm(true); setEditingEntry(null); }}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Time
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content based on active section */}
      {activeSection === 'timesheet' ? (
        // Original Calendar Grid
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {viewMode === 'week' ? (
            // Weekly View
            <>
              {/* Calendar Header */}
              <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))] bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <div className="p-4 text-center text-lg font-bold text-gray-700 border-r border-gray-200">
                  Time
                </div>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                  const date = displayDates[index];
                  const isToday = date.toDateString() === today;
                  const totalHours = getEntriesForDate(date).reduce((sum, entry) => sum + entry.duration, 0);
                  
                  return (
                    <div key={day} className={`p-4 text-center border-r last:border-r-0 border-gray-200 ${
                      isToday ? 'bg-gradient-to-b from-blue-100 to-blue-50' : ''
                    }`}>
                      <div className={`font-bold text-lg ${
                        isToday ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        {day}
                      </div>
                      <div className={`text-sm ${
                        isToday ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {date.getDate()}
                      </div>
                      {totalHours > 0 && (
                        <div className={`text-xs font-medium mt-1 px-2 py-1 rounded-full ${
                          isToday ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {totalHours.toFixed(1)}h
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Calendar Body with Time Slots */}
              <div className="max-h-[600px] overflow-y-auto">
                {[...Array(10)].map((_, slotIndex) => {
                  const timeSlot = `${String(9 + slotIndex).padStart(2, '0')}:00`;
                  return (
                    <div key={timeSlot} className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))] border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      {/* Time Column */}
                      <div className="p-2 border-r border-gray-200 bg-gray-50 flex items-center justify-center">
                        <div className="text-center">
                          <div className="font-semibold text-gray-700 text-xs">
                            {timeSlot}
                          </div>
                        </div>
                      </div>
                      
                      {/* Day Columns */}
                      {displayDates.map((date, dayIndex) => {
                        const entries = getEntriesForDate(date).filter(entry => {
                          const startHour = new Date(entry.startTime).getHours();
                          return startHour === (9 + slotIndex);
                        });
                        const isToday = date.toDateString() === today;
                        
                        return (
                          <div
                            key={dayIndex}
                            className={`border-r last:border-r-0 border-gray-200 p-2 min-h-[80px] ${
                              isToday ? 'bg-blue-50/30' : ''
                            }`}
                          >
                            <div className="space-y-1">
                              {entries.map((entry) => {
                                const colorClass = getProjectColor(entry.project.name);
                                const textColorClass = colorClass.replace('bg-', 'text-').replace('-500', '-800');
                                const bgColorClass = colorClass.replace('-500', '-100');
                                
                                return (
                                  <div
                                    key={entry.id}
                                    className={`group relative ${bgColorClass} ${textColorClass} text-xs p-2 rounded-lg cursor-pointer hover:shadow-md transition-all duration-200 border-l-4 ${colorClass.replace('bg-', 'border-')}`}
                                  >
                                    <div className="truncate text-xs opacity-90 font-bold">
                                      {entry.employee.fullName}
                                    </div>                              
                                    <div className="font-semibold truncate text-xs">
                                      {entry.project.name}
                                    </div>
                                    <div className="truncate text-xs opacity-70">
                                      {entry.task}
                                    </div>
                                    <div className="text-xs opacity-75 font-medium">
                                      {new Date(entry.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(entry.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="text-xs opacity-75">
                                      {entry.duration.toFixed(1)}h
                                    </div>
                                    
                                    {isToday && (
                                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex space-x-1 transition-opacity">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            editEntry(entry);
                                          }}
                                          className="p-1 bg-white rounded shadow-sm hover:bg-gray-100 transition-colors"
                                        >
                                          <Edit3 className="w-3 h-3 text-gray-600" />
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            deleteEntry(entry.id);
                                          }}
                                          className="p-1 bg-white rounded shadow-sm hover:bg-gray-100 transition-colors"
                                        >
                                          <Trash2 className="w-3 h-3 text-red-600" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            // Monthly View
            <>
              {/* Month Header */}
              <div className="grid grid-cols-7 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="p-4 text-center font-bold text-gray-700 border-r last:border-r-0 border-gray-200">
                    {day}
                  </div>
                ))}
              </div>

              {/* Month Grid */}
              <div className="grid grid-cols-7">
                {displayDates.map((date, index) => {
                  const isCurrentMonth = !dateRangeFilter.from && !dateRangeFilter.to ? 
                    date.getMonth() === currentDate.getMonth() : true;
                  const isToday = date.toDateString() === today;
                  const entries = getEntriesForDate(date);
                  const totalHours = entries.reduce((total, entry) => total + entry.duration, 0);
                  
                  return (
                    <div
                      key={index}
                      className={`border-r last:border-r-0 border-b last:border-b-0 p-2 min-h-[120px] ${
                        !isCurrentMonth ? 'bg-gray-50 opacity-50' : ''
                      } ${
                        isToday ? 'bg-gradient-to-b from-blue-100 to-blue-50' : ''
                      }`}
                    >
                      <div className={`text-sm font-semibold mb-2 flex items-center justify-between ${
                        isToday ? 'text-blue-700' : isCurrentMonth ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        <span>{date.getDate()}</span>
                        {totalHours > 0 && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            isToday ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {totalHours.toFixed(1)}h
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        {entries.slice(0, 3).map((entry) => {
                          const colorClass = getProjectColor(entry.project.name);
                          const bgColorClass = colorClass.replace('-500', '-100');
                          const textColorClass = colorClass.replace('bg-', 'text-').replace('-500', '-700');
                          
                          return (
                            <div
                              key={entry.id}
                              className={`${bgColorClass} ${textColorClass} text-xs p-1 rounded cursor-pointer hover:shadow-sm transition-all duration-200 border-l-2 ${colorClass.replace('bg-', 'border-')}`}
                            >
                              <div className="font-bold opacity-90 text-xs">{entry.employee.fullName}</div>
                              <div className="font-medium truncate">{entry.project.name}</div>
                              <div className="truncate opacity-75">{entry.task}</div>
                              <div className="text-xs opacity-60">{entry.duration.toFixed(1)}h</div>
                            </div>
                          );
                        })}
                        {entries.length > 3 && (
                          <button
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium pl-1 hover:underline transition-colors"
                          >
                            +{entries.length - 3} more
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      ) : (
        // New Timesheet Hours Table
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Team Timesheet Hours</h2>
                <p className="text-gray-600">Overview of team working hours for the selected period</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {teamTimesheetData.reduce((sum, data) => sum + data.totalHours, 0).toFixed(1)}h
                </div>
                <div className="text-sm text-gray-500 font-medium">Total Team Hours</div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 sticky left-0 bg-gray-50 z-10">
                    Employee
                  </th>
                  {displayDates.map((date, index) => {
                    const isToday = date.toDateString() === today;
                    return (
                      <th key={index} className={`px-3 py-4 text-center text-sm font-semibold min-w-[80px] ${
                        isToday ? 'text-blue-700 bg-blue-50' : 'text-gray-900'
                      }`}>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 mb-1">
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                          <span className={isToday ? 'text-blue-700 font-bold' : ''}>
                            {date.getDate()}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 bg-blue-50 sticky right-0 z-10">
                    Total
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 bg-green-50">
                    Billable
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 bg-gray-50">
                    Non-Billable
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teamTimesheetData.map((data, _employeeIndex) => (
                  <tr key={data.employee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 sticky left-0 bg-white z-10 border-r border-gray-200">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                          {data.employee.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{data.employee.fullName}</div>
                          <div className="text-sm text-gray-500">{data.employee.role}</div>
                        </div>
                      </div>
                    </td>
                    {data.dailyHours.map((hours, dayIndex) => {
                      const date = displayDates[dayIndex];
                      const isToday = date.toDateString() === today;
                      return (
                        <td key={dayIndex} className={`px-3 py-4 text-center ${
                          isToday ? 'bg-blue-50' : ''
                        }`}>
                          {hours > 0 ? (
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                              hours >= 8 ? 'bg-green-100 text-green-800' :
                              hours >= 4 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {hours.toFixed(1)}h
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 text-center bg-blue-50 sticky right-0 z-10 border-l border-gray-200">
                      <div className="font-bold text-blue-700 text-lg">
                        {data.totalHours.toFixed(1)}h
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center bg-green-50">
                      <div className="font-semibold text-green-700">
                        {data.billableHours.toFixed(1)}h
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center bg-gray-50">
                      <div className="font-semibold text-gray-700">
                        {data.nonBillableHours.toFixed(1)}h
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gradient-to-r from-gray-100 to-gray-50 border-t-2 border-gray-300">
                <tr>
                  <td className="px-6 py-4 font-bold text-gray-900 sticky left-0 bg-gray-100 z-10">
                    Team Total
                  </td>
                  {displayDates.map((date, dayIndex) => {
                    const dayTotal = teamTimesheetData.reduce((sum, data) => sum + data.dailyHours[dayIndex], 0);
                    const isToday = date.toDateString() === today;
                    return (
                      <td key={dayIndex} className={`px-3 py-4 text-center font-bold ${
                        isToday ? 'text-blue-700 bg-blue-100' : 'text-gray-900'
                      }`}>
                        {dayTotal > 0 ? `${dayTotal.toFixed(1)}h` : '-'}
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 text-center font-bold text-blue-700 text-xl bg-blue-100 sticky right-0 z-10 border-l border-gray-300">
                    {teamTimesheetData.reduce((sum, data) => sum + data.totalHours, 0).toFixed(1)}h
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-green-700 text-lg bg-green-100">
                    {teamTimesheetData.reduce((sum, data) => sum + data.billableHours, 0).toFixed(1)}h
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-gray-700 text-lg bg-gray-100">
                    {teamTimesheetData.reduce((sum, data) => sum + data.nonBillableHours, 0).toFixed(1)}h
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {showAddForm && (
        <TimeEntryModal
          isOpen={showAddForm}
          onClose={() => {
            setShowAddForm(false);
            setEditingEntry(null);
          }}
          onSave={saveTimeEntry}
          selectedDate={new Date().toISOString().split('T')[0]}
          entryToEdit={editingEntry}
        />
      )}
    </div>
  );
};
function setAutoStartTime(now: Date) {
  throw new Error('Function not implemented.');
}

