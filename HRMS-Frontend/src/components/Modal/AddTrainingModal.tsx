import React, { useState } from 'react';
import { X, Calendar, User, BookOpen, Monitor, MapPin, Clock } from 'lucide-react';
import { TrainingRecord } from '../../types';
import { mockEmployees } from '../../data/mockData';

interface AddTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (training: Omit<TrainingRecord, 'id'>) => void;
}

export const AddTrainingModal: React.FC<AddTrainingModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    trainerName: '',
    mode: 'Online' as 'Online' | 'Offline',
    trainingTopic: '',
    startDate: '',
    endDate: '',
    certificate: 'Required' as 'Required' | 'Not Required',
    location: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeeId) newErrors.employeeId = 'Employee is required';
    if (!formData.trainerName.trim()) newErrors.trainerName = 'Trainer name is required';
    if (!formData.trainingTopic.trim()) newErrors.trainingTopic = 'Training topic is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (startDate > endDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (formData.mode === 'Offline' && !formData.location.trim()) {
      newErrors.location = 'Location is required for offline training';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const selectedEmployee = mockEmployees.find(emp => emp.id === formData.employeeId);
    if (!selectedEmployee) return;

    // Calculate duration in hours (rough estimate based on days)
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const estimatedDuration = days * 8; // 8 hours per day

    const newTraining: Omit<TrainingRecord, 'id'> = {
      employeeId: formData.employeeId,
      employeeName: selectedEmployee.name,
      trainerName: formData.trainerName.trim(),
      mode: formData.mode,
      trainingTopic: formData.trainingTopic.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      certificate: formData.certificate,
      status: 'Scheduled',
      location: formData.mode === 'Offline' ? formData.location.trim() : undefined,
      notes: formData.notes.trim() || undefined,
      duration: estimatedDuration
    };

    onSubmit(newTraining);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      employeeId: '',
      trainerName: '',
      mode: 'Online',
      trainingTopic: '',
      startDate: '',
      endDate: '',
      certificate: 'Required',
      location: '',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 py-6">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleClose} />
        
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Add New Training</h2>
                <p className="text-sm text-gray-500">Schedule a new training session</p>
              </div>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employee Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Employee *
                </label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange('employeeId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.employeeId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select an employee</option>
                  {mockEmployees
                    .filter(emp => emp.status === 'active')
                    .map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} - {employee.position}
                      </option>
                    ))}
                </select>
                {errors.employeeId && <p className="mt-1 text-sm text-red-600">{errors.employeeId}</p>}
              </div>

              {/* Trainer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Trainer Name *
                </label>
                <input
                  type="text"
                  value={formData.trainerName}
                  onChange={(e) => handleInputChange('trainerName', e.target.value)}
                  placeholder="Enter trainer name"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.trainerName ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.trainerName && <p className="mt-1 text-sm text-red-600">{errors.trainerName}</p>}
              </div>

              {/* Training Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Monitor className="w-4 h-4 inline mr-1" />
                  Training Mode *
                </label>
                <select
                  value={formData.mode}
                  onChange={(e) => handleInputChange('mode', e.target.value as 'Online' | 'Offline')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>

              {/* Training Topic */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <BookOpen className="w-4 h-4 inline mr-1" />
                  Training Topic *
                </label>
                <input
                  type="text"
                  value={formData.trainingTopic}
                  onChange={(e) => handleInputChange('trainingTopic', e.target.value)}
                  placeholder="Enter training topic"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.trainingTopic ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.trainingTopic && <p className="mt-1 text-sm text-red-600">{errors.trainingTopic}</p>}
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.startDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.endDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
              </div>

              {/* Certificate Requirement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate Requirement
                </label>
                <select
                  value={formData.certificate}
                  onChange={(e) => handleInputChange('certificate', e.target.value as 'Required' | 'Not Required')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="Required">Required</option>
                  <option value="Not Required">Not Required</option>
                </select>
              </div>

              {/* Location (only show for offline training) */}
              {formData.mode === 'Offline' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter training location"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.location ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                </div>
              )}

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Enter any additional notes or requirements"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Add Training</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};