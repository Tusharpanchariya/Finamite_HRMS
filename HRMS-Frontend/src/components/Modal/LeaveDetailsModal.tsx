import React, { useState, useEffect } from 'react';
import { X, User, CalendarDays, Clock, Info, ChevronLeft, ChevronRight, CheckCircle, Edit3, Trash2 } from 'lucide-react';

interface LeaveDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRequest: any; // The leave request object
  onEdit: (requestId: string, newStartDate: string, newEndDate: string) => Promise<void>;
  onCancelLeave: (requestId: string, leaveReason?: string) => Promise<void>; // Modified to accept an optional leaveReason
}

// Custom Confirmation Modal Component
const ConfirmationModal: React.FC<{
  isOpen: boolean;
  message: string;
  onConfirm: (leaveReason?: string) => void; // Modified to pass an optional leaveReason
  onCancel: () => void;
  showleaveReasonInput?: boolean; // New prop to control leaveReason input visibility
  leaveReasonPlaceholder?: string; // New prop for leaveReason input placeholder
}> = ({ isOpen, message, onConfirm, onCancel, showleaveReasonInput, leaveReasonPlaceholder }) => {
  const [leaveReason, setleaveReason] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setleaveReason(''); // Clear leaveReason when modal closes
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 relative">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmation</h3>
        <p className="text-gray-700 mb-4">{message}</p>
        {showleaveReasonInput && (
          <div className="mb-4">
            <label htmlFor="cancellationleaveReason" className="block text-sm font-medium text-gray-700 mb-2">
              leaveReason (Optional)
            </label>
            <textarea
              id="cancellationleaveReason"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder={leaveReasonPlaceholder || "Enter leaveReason here..."}
              value={leaveReason}
              onChange={(e) => setleaveReason(e.target.value)}
            ></textarea>
          </div>
        )}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(leaveReason)} // Pass the leaveReason to onConfirm
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};


const LeaveDetailsModal: React.FC<LeaveDetailsModalProps> = ({
  isOpen,
  onClose,
  currentRequest,
  onEdit,
  onCancelLeave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStartDate, setEditedStartDate] = useState('');
  const [editedEndDate, setEditedEndDate] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationAction, setConfirmationAction] = useState<((leaveReason?: string) => void) | null>(null); // Modified to accept leaveReason
  const [showleaveReasonInputInConfirmation, setShowleaveReasonInputInConfirmation] = useState(false);


  // Effect to reset edit mode and dates when modal opens or currentRequest changes
  useEffect(() => {
    if (isOpen && currentRequest) {
      setIsEditing(false); // Always start in view mode
      setEditedStartDate(currentRequest.startDate);
      setEditedEndDate(currentRequest.endDate);
    }
  }, [isOpen, currentRequest]);

  if (!isOpen || !currentRequest) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getstatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800', // New style for cancelled
    };

    const icons = {
      approved: <CheckCircle className="w-4 h-4 mr-1" />,
      pending: <Clock className="w-4 h-4 mr-1" />,
      rejected: <X className="w-4 h-4 mr-1" />,
      cancelled: <Trash2 className="w-4 h-4 mr-1" />, // Icon for cancelled
    };

    return (
      <span className={`flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status.toUpperCase()}
      </span>
    );
  };

  // Mini-Calendar logic for the modal
  const renderMiniCalendar = (startDateStr: string, endDateStr: string) => {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    // Normalize dates to compare only date part
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const calendarsToRender = [];
    let currentMonthDate = new Date(start.getFullYear(), start.getMonth(), 1);

    // Render calendar for start month
    calendarsToRender.push(currentMonthDate);

    // If leave spans across months, add the next month(s) until the end date month
    while (currentMonthDate.getFullYear() < end.getFullYear() ||
           (currentMonthDate.getFullYear() === end.getFullYear() && currentMonthDate.getMonth() < end.getMonth())) {
      currentMonthDate = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1);
      calendarsToRender.push(currentMonthDate);
    }

    return (
      <div className="flex flex-wrap justify-center gap-4">
        {calendarsToRender.map((date, monthIndex) => {
          const year = date.getFullYear();
          const month = date.getMonth();
          const daysInMonth = getDaysInMonth(year, month);
          const firstDayWeekday = getFirstDayOfMonth(year, month);

          const days = [];
          // Fill leading empty days
          for (let i = 0; i < firstDayWeekday; i++) {
            days.push(null);
          }
          // Fill days of the month
          for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i, 0, 0, 0, 0));
          }

          return (
            <div key={monthIndex} className="w-full sm:w-64 border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="text-center font-semibold text-gray-800 mb-3">
                {monthNames[month]} {year}
              </div>
              <div className="grid grid-cols-7 text-xs font-medium text-gray-600 mb-2">
                {dayNames.map(d => <div key={d} className="text-center">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((dayDate, idx) => {
                  const isLeaveDay = dayDate && dayDate >= start && dayDate <= end;
                  const isToday = dayDate && dayDate.toDateString() === new Date().toDateString(); // Highlight today

                  return (
                    <div
                      key={idx}
                      className={`text-center text-xs p-1 rounded-full flex items-center justify-center
                        ${dayDate ? 'text-gray-800' : 'text-gray-400'}
                        ${isLeaveDay ? 'bg-blue-500 text-white font-bold' : ''}
                        ${isToday && !isLeaveDay ? 'bg-blue-100 text-blue-800 font-medium' : ''}
                      `}
                    >
                      {dayDate ? dayDate.getDate() : ''}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const handleSaveChanges = async () => {
    if (new Date(editedStartDate) > new Date(editedEndDate)) {
      setConfirmationMessage('End date cannot be before start date.');
      setConfirmationAction(null); // No action on confirm, just close message
      setShowleaveReasonInputInConfirmation(false);
      setShowConfirmationModal(true);
      return;
    }
    // Defensive check to ensure onEdit is a function
    if (typeof onEdit === 'function') {
      try {
        await onEdit(currentRequest.id, editedStartDate, editedEndDate);
        setIsEditing(false); // Exit edit mode after saving
      } catch (error) {
        setConfirmationMessage('Failed to update leave request. Please try again.');
        setConfirmationAction(null);
        setShowleaveReasonInputInConfirmation(false);
        setShowConfirmationModal(true);
      }
    } else {
      console.error("onEdit prop is not a function!");
      // Optionally, show an error message to the user
      setConfirmationMessage('An internal error occurred: Edit function not available.');
      setConfirmationAction(null);
      setShowleaveReasonInputInConfirmation(false);
      setShowConfirmationModal(true);
    }
  };

  const handleCancelLeaveClick = () => {
    setConfirmationMessage('Are you sure you want to cancel this leave request?');
    setShowleaveReasonInputInConfirmation(true); // Show leaveReason input for cancellation
    setConfirmationAction(() => (leaveReason?: string) => { // Wrap in another arrow function to delay execution and accept leaveReason
      // Defensive check to ensure onCancelLeave is a function
      if (typeof onCancelLeave === 'function') {
        onCancelLeave(currentRequest.id, leaveReason) // Pass the leaveReason
          .then(() => {
            onClose(); // Close modal after cancellation
            setShowConfirmationModal(false); // Close confirmation modal
          })
          .catch((error) => {
            setConfirmationMessage('Failed to cancel leave request. Please try again.');
            setConfirmationAction(null);
            setShowleaveReasonInputInConfirmation(false);
          });
      } else {
        console.error("onCancelLeave prop is not a function!");
        // Optionally, show an error message to the user
        setConfirmationMessage('An internal error occurred: Cancel function not available.');
        setConfirmationAction(null);
        setShowleaveReasonInputInConfirmation(false);
        setShowConfirmationModal(true);
      }
    });
    setShowConfirmationModal(true);
  };

  const handleConfirmation = (leaveReason?: string) => { // Confirmation modal passes the leaveReason
    if (confirmationAction) {
      confirmationAction(leaveReason);
    } else {
      setShowConfirmationModal(false); // Just close the message if no specific action
    }
  };

  const handleConfirmationCancel = () => {
    setShowConfirmationModal(false);
    setConfirmationAction(null);
    setShowleaveReasonInputInConfirmation(false); // Reset leaveReason input visibility
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 rounded-full p-1 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-6">Leave Request Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-gray-700 mb-6">
          <div className="flex items-center">
            <User className="w-5 h-5 text-blue-500 mr-3" />
            <span className="font-medium">Employee:</span>
            <span className="ml-2">{currentRequest.employeeName}</span>
          </div>

          <div className="flex items-center">
            <Info className="w-5 h-5 text-purple-500 mr-3" />
            <span className="font-medium">Leave Type:</span>
            <span className="ml-2">{currentRequest.leaveType}</span>
          </div>

          <div className="flex items-center">
            <CalendarDays className="w-5 h-5 text-green-500 mr-3" />
            <span className="font-medium">Start Date:</span>
            {isEditing ? (
              <input
                type="date"
                value={editedStartDate.split('T')[0]} // Format for input type="date"
                onChange={(e) => setEditedStartDate(e.target.value)}
                className="ml-2 px-2 py-1 border border-gray-300 rounded-md text-sm"
              />
            ) : (
              <span className="ml-2">{formatDate(currentRequest.startDate)}</span>
            )}
          </div>

          <div className="flex items-center">
            <CalendarDays className="w-5 h-5 text-red-500 mr-3" />
            <span className="font-medium">End Date:</span>
            {isEditing ? (
              <input
                type="date"
                value={editedEndDate.split('T')[0]} // Format for input type="date"
                onChange={(e) => setEditedEndDate(e.target.value)}
                className="ml-2 px-2 py-1 border border-gray-300 rounded-md text-sm"
              />
            ) : (
              <span className="ml-2">{formatDate(currentRequest.endDate)}</span>
            )}
          </div>

          <div className="flex items-center">
            <Clock className="w-5 h-5 text-yellow-500 mr-3" />
            <span className="font-medium">Total Days:</span>
            {/* Recalculate days in edit mode if needed, or update on save */}
            <span className="ml-2">{currentRequest.days} day{currentRequest.days !== 1 ? 's' : ''}</span>
          </div>

          <div className="flex items-center">
            <Clock className="w-5 h-5 text-gray-500 mr-3" />
            <span className="font-medium">status:</span>
            <span className="ml-2">{getstatusBadge(currentRequest.status)}</span>
          </div>
        </div>

        <div className="mb-6">
            <div className="flex items-start mb-2">
              <Info className="w-5 h-5 text-gray-500 mr-3 mt-1" />
              <span className="font-medium">leaveReason:</span>
              <p className="ml-2 flex-1">{currentRequest.leaveReason || 'No leaveReason provided.'}</p>
            </div>
            {currentRequest.approvalleaveReason && (
              <div className="flex items-start mt-2">
                <Info className="w-5 h-5 text-gray-500 mr-3 mt-1" />
                <span className="font-medium">Approval/Rejection leaveReason:</span>
                <p className="ml-2 flex-1">{currentRequest.approvalleaveReason}</p>
              </div>
            )}
        </div>

        {/* Mini Calendar Display */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Period on Calendar</h3>
          {renderMiniCalendar(isEditing ? editedStartDate : currentRequest.startDate, isEditing ? editedEndDate : currentRequest.endDate)}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              {currentRequest.status !== 'cancelled' && currentRequest.status !== 'rejected' && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
              {currentRequest.status !== 'cancelled' && currentRequest.status !== 'rejected' && (
                <button
                  onClick={handleCancelLeaveClick}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Cancel Leave</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
      <ConfirmationModal
        isOpen={showConfirmationModal}
        message={confirmationMessage}
        onConfirm={handleConfirmation}
        onCancel={handleConfirmationCancel}
        showleaveReasonInput={showleaveReasonInputInConfirmation}
        leaveReasonPlaceholder="e.g., Change of plans, medical appointment cancelled"
      />
    </div>
  );
};

export default LeaveDetailsModal;
