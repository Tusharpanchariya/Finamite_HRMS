import React, { useState } from 'react';
import { X, Calendar, User, BookOpen, Monitor, MapPin, Award, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { TrainingRecord } from '../../types';

interface TrainingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  training: TrainingRecord | null;
  onUpdatestatus?: (id: string, status: TrainingRecord['status'], completionDate?: string, certificateIssued?: boolean) => void;
}

export const TrainingDetailsModal: React.FC<TrainingDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  training,
  onUpdatestatus 
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !training) return null;

  const getstatusBadge = (status: TrainingRecord['status']) => {
    const styles = {
      'Scheduled': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-yellow-100 text-yellow-800', 
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };

    const icons = {
      'Scheduled': <Calendar className="w-3 h-3 mr-1" />,
      'In Progress': <Clock className="w-3 h-3 mr-1" />,
      'Completed': <CheckCircle className="w-3 h-3 mr-1" />,
      'Cancelled': <AlertCircle className="w-3 h-3 mr-1" />
    };

    return (
      <span className={`flex items-center px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {icons[status]}
        {status}
      </span>
    );
  };

  const handlestatusUpdate = async (newstatus: TrainingRecord['status']) => {
    if (!onUpdatestatus) return;
    
    setIsUpdating(true);
    
    let completionDate: string | undefined;
    let certificateIssued: boolean | undefined;
    
    if (newstatus === 'Completed') {
      completionDate = new Date().toISOString().split('T')[0];
      certificateIssued = training.certificate === 'Required';
    }
    
    onUpdatestatus(training.id, newstatus, completionDate, certificateIssued);
    setIsUpdating(false);
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  const calculateDuration = () => {
    const start = new Date(training.startDate);
    const end = new Date(training.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return `${days} day${days > 1 ? 's' : ''} (${training.duration || days * 8} hours)`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 py-6">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Training Details</h2>
                <p className="text-sm text-gray-500">{training.trainingTopic}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {/* status and Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-600">status:</span>
                {getstatusBadge(training.status)}
              </div>
              
              {onUpdatestatus && training.status !== 'Completed' && training.status !== 'Cancelled' && (
                <div className="flex space-x-2">
                  {training.status === 'Scheduled' && (
                    <button
                      onClick={() => handlestatusUpdate('In Progress')}
                      disabled={isUpdating}
                      className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors disabled:opacity-50"
                    >
                      Start Training
                    </button>
                  )}
                  {(training.status === 'In Progress' || training.status === 'Scheduled') && (
                    <button
                      onClick={() => handlestatusUpdate('Completed')}
                      disabled={isUpdating}
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      Mark Complete
                    </button>
                  )}
                  <button
                    onClick={() => handlestatusUpdate('Cancelled')}
                    disabled={isUpdating}
                    className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Training Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employee Information */}
              <div className="space-y-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <User className="w-4 h-4 mr-2" />
                    Employee
                  </label>
                  <p className="text-gray-900 font-medium">{training.employeeName}</p>
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <User className="w-4 h-4 mr-2" />
                    Trainer
                  </label>
                  <p className="text-gray-900">{training.trainerName}</p>
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Monitor className="w-4 h-4 mr-2" />
                    Training Mode
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      training.mode === 'Online' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {training.mode}
                    </span>
                    {training.location && (
                      <span className="text-sm text-gray-600">@ {training.location}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Award className="w-4 h-4 mr-2" />
                    Certificate
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      training.certificate === 'Required' 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {training.certificate}
                    </span>
                    {training.certificate === 'Required' && training.certificateIssued !== undefined && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        training.certificateIssued 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {training.certificateIssued ? 'Issued' : 'Pending'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Training Schedule */}
              <div className="space-y-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </label>
                  <p className="text-gray-900">{formatDateRange(training.startDate, training.endDate)}</p>
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Clock className="w-4 h-4 mr-2" />
                    Duration
                  </label>
                  <p className="text-gray-900">{calculateDuration()}</p>
                </div>

                {training.completionDate && (
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Completed On
                    </label>
                    <p className="text-gray-900">{new Date(training.completionDate).toLocaleDateString()}</p>
                  </div>
                )}

                {training.location && (
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <MapPin className="w-4 h-4 mr-2" />
                      Location
                    </label>
                    <p className="text-gray-900">{training.location}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Training Topic and Notes */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="mb-4">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Training Topic
                </label>
                <p className="text-gray-900 font-medium">{training.trainingTopic}</p>
              </div>

              {training.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-900 text-sm">{training.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};