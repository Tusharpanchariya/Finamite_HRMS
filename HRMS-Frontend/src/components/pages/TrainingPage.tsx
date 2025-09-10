import React, { useState } from 'react';
import { BookOpen, Calendar, Users, Award, TrendingUp, Plus, Search, Filter, Eye, Play, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Table } from '../ui/Table';
import { TrainingRecord } from '../../types';
import { mockTrainingRecords } from '../../data/trainingMockData';
import { AddTrainingModal } from '../Modal/AddTrainingModal';
import { TrainingDetailsModal } from '../Modal/TrainingDetailsModal';

export const TrainingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterstatus, setFilterstatus] = useState('all');
  const [filterMode, setFilterMode] = useState('all');
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>(mockTrainingRecords);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<TrainingRecord | null>(null);

  // Filter training records
  const filteredRecords = trainingRecords.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.trainingTopic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.trainerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesstatus = filterstatus === 'all' || record.status === filterstatus;
    const matchesMode = filterMode === 'all' || record.mode === filterMode;
    return matchesSearch && matchesstatus && matchesMode;
  });

  // Calculate statistics
  const stats = {
    totalTrainings: trainingRecords.length,
    scheduledTrainings: trainingRecords.filter(r => r.status === 'Scheduled').length,
    inProgressTrainings: trainingRecords.filter(r => r.status === 'In Progress').length,
    completedTrainings: trainingRecords.filter(r => r.status === 'Completed').length,
    certificatesRequired: trainingRecords.filter(r => r.certificate === 'Required').length,
    certificatesIssued: trainingRecords.filter(r => r.certificateIssued === true).length
  };

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
      'Cancelled': <XCircle className="w-3 h-3 mr-1" />
    };

    return (
      <span className={`flex items-center px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {icons[status]}
        {status}
      </span>
    );
  };

  const getModeBadge = (mode: 'Online' | 'Offline') => {
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        mode === 'Online' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-blue-100 text-blue-800'
      }`}>
        {mode}
      </span>
    );
  };

  const getCertificateBadge = (certificate: 'Required' | 'Not Required', isIssued?: boolean) => {
    if (certificate === 'Not Required') {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
          Not Required
        </span>
      );
    }

    if (isIssued === true) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          Issued
        </span>
      );
    }

    if (isIssued === false) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
          Pending
        </span>
      );
    }

    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
        Required
      </span>
    );
  };

  const handleAddTraining = (newTraining: Omit<TrainingRecord, 'id'>) => {
    const training: TrainingRecord = {
      ...newTraining,
      id: (Math.max(...trainingRecords.map(r => parseInt(r.id))) + 1).toString()
    };
    setTrainingRecords(prev => [training, ...prev]);
  };

  const handleViewDetails = (training: TrainingRecord) => {
    setSelectedTraining(training);
    setShowDetailsModal(true);
  };

  const handleUpdatestatus = (id: string, status: TrainingRecord['status'], completionDate?: string, certificateIssued?: boolean) => {
    setTrainingRecords(prev => 
      prev.map(record => 
        record.id === id 
          ? { 
              ...record, 
              status, 
              completionDate,
              certificateIssued: certificateIssued !== undefined ? certificateIssued : record.certificateIssued
            }
          : record
      )
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

  // Table columns configuration
  const columns = [
    {
      key: 'employee',
      label: 'Employee',
      render: (_: any, row: TrainingRecord) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">
              {row.employeeName.split(' ').map((n: string) => n[0]).join('')}
            </span>
          </div>
          <span className="font-medium text-gray-900">{row.employeeName}</span>
        </div>
      )
    },
    {
      key: 'trainingTopic',
      label: 'Training Topic',
      render: (value: string, row: TrainingRecord) => (
        <div>
          <p className="font-medium text-gray-900 text-sm">{value}</p>
          <p className="text-xs text-gray-500">Trainer: {row.trainerName}</p>
        </div>
      )
    },
    {
      key: 'schedule',
      label: 'Schedule',
      render: (_: any, row: TrainingRecord) => (
        <div>
          <p className="text-sm text-gray-900">{formatDateRange(row.startDate, row.endDate)}</p>
          <p className="text-xs text-gray-500">{row.duration} hours</p>
        </div>
      )
    },
    {
      key: 'mode',
      label: 'Mode',
      render: (value: 'Online' | 'Offline', row: TrainingRecord) => (
        <div>
          {getModeBadge(value)}
          {row.location && <p className="text-xs text-gray-500 mt-1">{row.location}</p>}
        </div>
      )
    },
    {
      key: 'certificate',
      label: 'Certificate',
      render: (value: 'Required' | 'Not Required', row: TrainingRecord) => 
        getCertificateBadge(value, row.certificateIssued)
    },
    {
      key: 'status',
      label: 'status',
      render: (value: TrainingRecord['status']) => getstatusBadge(value)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: TrainingRecord) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewDetails(row)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.status === 'Scheduled' && (
            <button
              onClick={() => handleUpdatestatus(row.id, 'In Progress')}
              className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors duration-200"
              title="Start Training"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
          {(row.status === 'In Progress' || row.status === 'Scheduled') && (
            <button
              onClick={() => handleUpdatestatus(row.id, 'Completed', new Date().toISOString().split('T')[0], row.certificate === 'Required')}
              className="p-1 text-purple-600 hover:bg-purple-50 rounded transition-colors duration-200"
              title="Mark Complete"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  const statuses = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];
  const modes = ['Online', 'Offline'];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-15xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Training Management</h1>
            <p className="text-gray-600">Manage employee training programs and track progress</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Training</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Trainings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTrainings}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">{stats.scheduledTrainings}</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgressTrainings}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedTrainings}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Certificates Required</p>
                <p className="text-2xl font-bold text-gray-900">{stats.certificatesRequired}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Certificates Issued</p>
                <p className="text-2xl font-bold text-gray-900">{stats.certificatesIssued}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search trainings, employees, or trainers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full sm:w-72"
                />
              </div>

              {/* status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterstatus}
                  onChange={(e) => setFilterstatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                >
                  <option value="all">All status</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Mode Filter */}
              <div className="relative">
                <select
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value)}
                  className="pl-4 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                >
                  <option value="all">All Modes</option>
                  {modes.map(mode => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Showing {filteredRecords.length} of {trainingRecords.length} trainings
            </div>
          </div>
        </Card>

        {/* Training Table */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Training Records ({filteredRecords.length})
              </h2>
              <p className="text-sm text-gray-500">
                {searchTerm && `Showing results for "${searchTerm}"`}
                {filterstatus !== 'all' && ` filtered by ${filterstatus}`}
                {filterMode !== 'all' && ` mode: ${filterMode}`}
              </p>
            </div>
          </div>

          <Table columns={columns} data={filteredRecords} />
        </Card>

        {/* Add Training Modal */}
        <AddTrainingModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddTraining}
        />

        {/* Training Details Modal */}
        <TrainingDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          training={selectedTraining}
          onUpdatestatus={handleUpdatestatus}
        />
      </div>
    </div>
  );
};