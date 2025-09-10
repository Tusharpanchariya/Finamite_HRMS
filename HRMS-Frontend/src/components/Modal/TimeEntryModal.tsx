import React, { useState, useEffect } from 'react';
import { X, Clock, User, FileText } from 'lucide-react';
import { fetchProjects, fetchEmployees } from '../../services/timeEntries.service';

interface TimeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: any) => void;
  selectedDate?: string;
  entryToEdit?: any;
}

interface Project {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  fullName: string;
}

export const TimeEntryModal: React.FC<TimeEntryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  entryToEdit
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState({
    employeeId: entryToEdit?.employeeId || '',
    projectId: entryToEdit?.projectId || '',
    task: entryToEdit?.task || '',
    date: entryToEdit?.date ? new Date(entryToEdit.date).toISOString().split('T')[0] : selectedDate || new Date().toISOString().split('T')[0],
    startTime: entryToEdit?.startTime ? new Date(entryToEdit.startTime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '',
    endTime: entryToEdit?.endTime ? new Date(entryToEdit.endTime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '',
    description: entryToEdit?.description || '',
    billable: entryToEdit?.billable !== undefined ? entryToEdit.billable : true,
  });

  const [duration, setDuration] = useState('0h 0m');

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedProjects = await fetchProjects();
        setProjects(fetchedProjects);
        const fetchedEmployees = await fetchEmployees();
        setEmployees(fetchedEmployees);
      } catch (error) {
        console.error("Failed to load projects or employees:", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (entryToEdit) {
      setFormData({
        employeeId: entryToEdit.employeeId,
        projectId: entryToEdit.projectId,
        task: entryToEdit.task,
        date: new Date(entryToEdit.date).toISOString().split('T')[0],
        startTime: new Date(entryToEdit.startTime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        endTime: new Date(entryToEdit.endTime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        description: entryToEdit.description,
        billable: entryToEdit.billable,
      });
      setDuration(calculateDuration(new Date(entryToEdit.startTime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }), new Date(entryToEdit.endTime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })));
    }
  }, [entryToEdit]);

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return '0h 0m';
    
    const startTime = new Date(`2024-01-01T${start}:00`);
    const endTime = new Date(`2024-01-01T${end}:00`);
    
    if (endTime <= startTime) return '0h 0m';
    
    const diffMs = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    if (newFormData.startTime && newFormData.endTime) {
      setDuration(calculateDuration(newFormData.startTime, newFormData.endTime));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employeeId || !formData.projectId || !formData.task || !formData.date || !formData.startTime || !formData.endTime) {
      alert('Please fill in all required fields');
      return;
    }

    const startDateTime = new Date(`${formData.date}T${formData.startTime}:00`);
    const endDateTime = new Date(`${formData.date}T${formData.endTime}:00`);
    const durationHours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
    
    const entryData = {
      ...formData,
      employeeId: Number(formData.employeeId),
      projectId: Number(formData.projectId),
      duration: durationHours,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
    };

    onSave(entryData);
    
    // Reset form on successful save
    setFormData({
      employeeId: '',
      projectId: '',
      task: '',
      date: selectedDate || new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      description: '',
      billable: true
    });
    setDuration('0h 0m');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {entryToEdit ? 'Edit Time Entry' : 'Add Time Entry'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Employee *
            </label>
            <select
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Employee</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>{employee.fullName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project *
            </label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Task *
            </label>
            <input
              type="text"
              value={formData.task}
              onChange={(e) => setFormData({ ...formData, task: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter task name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Start Time *
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => handleTimeChange('startTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                End Time *
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => handleTimeChange('endTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Duration:</span>
              <span className="text-lg font-bold text-blue-600">{duration}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Enter task description"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="billable"
              checked={formData.billable}
              onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="billable" className="ml-2 text-sm text-gray-700">
              Billable hours
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {entryToEdit ? 'Update Entry' : 'Save Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
