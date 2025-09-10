import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ApproveRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (requestId: string, status: 'approved' | 'rejected', leaveReason: string) => Promise<void>;
  isReject: boolean; // true if it's a rejection, false if it's an approval
  currentRequest: any; // The leave request object
}

const ApproveRejectModal: React.FC<ApproveRejectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isReject,
  currentRequest,
}) => {
  const [leaveReason, setleaveReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setleaveReason('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (isReject && !leaveReason.trim()) {
      setError('leaveReason is mandatory for rejection.');
      return;
    }
    setError('');
    try {
      await onSubmit(currentRequest.id, isReject ? 'rejected' : 'approved', leaveReason);
      onClose();
    } catch (error) {
      setError('Failed to update leave request. Please try again.');
    }
  };

  const title = isReject ? 'Reject Leave Request' : 'Approve Leave Request';
  const buttonText = isReject ? 'Reject' : 'Approve';
  const leaveReasonLabel = isReject ? 'leaveReason for Rejection (Mandatory)' : 'leaveReason for Approval (Optional)';
  const leaveReasonPlaceholder = isReject ? 'Enter leaveReason for rejecting this leave request...' : 'Enter leaveReason for approving this leave request (optional)...';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 rounded-full p-1 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-sm text-gray-600 mb-4">
          Employee: <span className="font-medium text-gray-800">{currentRequest?.employeeName}</span>
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Leave Type: <span className="font-medium text-gray-800">{currentRequest?.leaveType}</span>
        </p>
        <p className="text-sm text-gray-600 mb-6">
          Dates: <span className="font-medium text-gray-800">{new Date(currentRequest?.startDate).toLocaleDateString()} - {new Date(currentRequest?.endDate).toLocaleDateString()}</span>
        </p>

        <div className="mb-4">
          <label htmlFor="leaveReason" className="block text-sm font-medium text-gray-700 mb-2">
            {leaveReasonLabel}
          </label>
          <textarea
            id="leaveReason"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder={leaveReasonPlaceholder}
            value={leaveReason}
            onChange={(e) => setleaveReason(e.target.value)}
          ></textarea>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 ${isReject ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white text-sm font-medium rounded-lg transition-colors`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveRejectModal;
