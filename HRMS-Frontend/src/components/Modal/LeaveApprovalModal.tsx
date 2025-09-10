import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle, XCircle, Search, Filter, User } from 'lucide-react';
import { Table } from '../ui/Table';
import { extendedMockLeaveRequests } from '../../data/mockData';
import ApproveRejectModal from './ApproveRejectModal';
import LeaveDetailsModal from './LeaveDetailsModal';

interface LeaveApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeaveApprovalModal: React.FC<LeaveApprovalModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [allLeaveRequests, setAllLeaveRequests] = useState(extendedMockLeaveRequests);

  // State for approve/reject modal
  const [showApproveRejectModal, setShowApproveRejectModal] = useState(false);
  const [isRejectAction, setIsRejectAction] = useState(false);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<any>(null);

  // State for leave details modal
  const [showLeaveDetailsModal, setShowLeaveDetailsModal] = useState(false);

  if (!isOpen) return null;

  // Filter to show only pending requests
  const pendingRequests = allLeaveRequests.filter(request => request.status === 'pending');
  
  // Apply additional filters
  const filteredRequests = pendingRequests.filter(request => {
    const matchesSearch = request.employeefullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || request.leaveType === filterType;
    return matchesSearch && matchesType;
  });

  const getstatusBadge = (status: string) => {
    return (
      <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
        <Clock className="w-3 h-3 mr-1" />
        PENDING
      </span>
    );
  };

  const getLeaveTypeIcon = (type: string) => {
    const icons = {
      'Annual Leave': '🏖️',
      'SICK': '🏥',
      'MATERNITY': '👶',
      'PATERNITY': '👤',
      'EARNED': '🚨',
      'Half Day': '☀️', 
      'CASUAL': '🚶',
    };
    return icons[type as keyof typeof icons] || '📅';
  };

  const getLeaveTypeBadge = (type: string) => {
    const styles = {
      'Annual Leave': 'bg-blue-100 text-blue-800',
      'SICK': 'bg-red-100 text-red-800',
      'MATERNITY': 'bg-pink-100 text-pink-800',
      'PATERNITY': 'bg-purple-100 text-purple-800',
      'Emergency Leave': 'bg-orange-100 text-orange-800',
      'Half Day': 'bg-teal-100 text-teal-800',
      'EARNED': 'bg-indigo-100 text-indigo-800',
      'CASUAL': 'bg-lime-100 text-lime-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[type as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {type.toUpperCase()}
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
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Handler for approving/rejecting leave
  const handleApproveReject = (requestId: string, status: 'approved' | 'rejected', leaveReason: string) => {
    setAllLeaveRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === requestId
          ? { ...req, status: status, approvalleaveReason: leaveReason }
          : req
      )
    );
  };

  // Handler for editing leave dates
  const handleEditLeaveRequest = (requestId: string, newStartDate: string, newEndDate: string) => {
    setAllLeaveRequests(prevRequests =>
      prevRequests.map(req => {
        if (req.id === requestId) {
          const updatedDays = calculateDaysBetweenDates(newStartDate, newEndDate);
          return {
            ...req,
            startDate: newStartDate,
            endDate: newEndDate,
            days: updatedDays,
          };
        }
        return req;
      })
    );
    setShowLeaveDetailsModal(false);
  };

  // Handler for cancelling leave
  const handleCancelLeaveRequest = (requestId: string, leaveReason?: string) => {
    setAllLeaveRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === requestId
          ? { ...req, status: 'cancelled', approvalleaveReason: leaveReason || 'Cancelled by employee.' }
          : req
      )
    );
    setShowLeaveDetailsModal(false);
  };

  // Handlers to open modals
  const openApproveModal = (request: any) => {
    setSelectedLeaveRequest(request);
    setIsRejectAction(false);
    setShowApproveRejectModal(true);
  };

  const openRejectModal = (request: any) => {
    setSelectedLeaveRequest(request);
    setIsRejectAction(true);
    setShowApproveRejectModal(true);
  };

  const openLeaveDetailsModal = (request: any) => {
    setSelectedLeaveRequest(request);
    setShowLeaveDetailsModal(true);
  };

  // Get unique leave types for filters
const leaveTypes = [...new Set(Array.isArray(allLeaveRequests) ? allLeaveRequests.map(r => r.leaveType) : [])];

  // Leave requests table columns
  const requestColumns = [
    {
      key: 'employeeId',
      label: 'Employee',
      render: (_: any, row: any) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">
              {row.employeefullName.split(' ').map((n: string) => n[0]).join('')}
            </span>
          </div>
          <span className="font-medium text-gray-900">{row.employeefullName}</span>
        </div>
      )
    },
    {
      key: 'leaveType',
      label: 'Leave Type',
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getLeaveTypeIcon(value)}</span>
          <div>
            <p className="font-medium text-gray-900 text-sm">{value}</p>
            {getLeaveTypeBadge(value)}
          </div>
        </div>
      )
    },
    {
      key: 'dateRange',
      label: 'Date Range',
      render: (_: any, row: any) => (
        <div>
          <p className="font-medium text-gray-900 text-sm">
            {formatDateRange(row.startDate, row.endDate)}
          </p>
          <p className="text-xs text-gray-500">{row.days} day{row.days !== 1 ? 's' : ''}</p>
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
      key: 'status',
      label: 'status',
      render: (value: string) => getstatusBadge(value)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex items-center space-x-2">
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

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Leave Approvals</h2>
              <p className="text-sm text-gray-600 mt-1">Review and approve pending leave requests</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 rounded-full p-1 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600 mb-1">Pending Requests</p>
                    <p className="text-2xl font-bold text-yellow-900">{pendingRequests.length}</p>
                  </div>
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-1">Total Days Requested</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {pendingRequests.reduce((sum, r) => sum + r.days, 0)}
                    </p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 mb-1">Unique Employees</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {new Set(pendingRequests.map(r => r.employeeId)).size}
                    </p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search employees or leave type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full"
                  />
                </div>

                {/* Type Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white min-w-[180px]"
                  >
                    <option value="all">All Leave Types</option>
                    {leaveTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results Info */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredRequests.length} of {pendingRequests.length} pending requests
                {searchTerm && ` matching "${searchTerm}"`}
                {filterType !== 'all' && ` for ${filterType}`}
              </p>
            </div>

            {/* Table */}
            {filteredRequests.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <Table columns={requestColumns} data={filteredRequests} />
              </div>
            ) : (
              <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Requests</h3>
                <p className="text-gray-500">
                  {searchTerm || filterType !== 'all' 
                    ? 'No requests match your current filters.' 
                    : 'All leave requests have been processed.'}
                </p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Approve/Reject Modal */}
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
    </>
  );
};

export default LeaveApprovalModal;