// src/components/Modal/AddReportModal.tsx
import React, { useState, useEffect } from 'react';

interface AddReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newReport: any) => void;
}

export const AddReportModal: React.FC<AddReportModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState('attendance');
  const [reportPeriod, setReportPeriod] = useState('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let periodDisplay = reportPeriod;
    if (reportPeriod === 'custom') {
      periodDisplay = `${startDate} to ${endDate}`;
    }

    const newReport = {
      id: Date.now(),
      title: reportTitle,
      type: reportType,
      period: periodDisplay,
      generatedDate: new Date().toISOString(),
      generatedBy: 'Current User',
      status: 'generating',
      ...(reportPeriod === 'custom' && { customStartDate: startDate, customEndDate: endDate })
    };

    onSubmit(newReport);
    
    // Reset form with animation
    setReportTitle('');
    setReportType('attendance');
    setReportPeriod('monthly');
    setStartDate('');
    setEndDate('');
    handleClose();
  };

  const reportTypes = [
    { value: 'attendance', label: 'Attendance Report', icon: '👥' },
    { value: 'performance', label: 'Performance Summary', icon: '📊' },
    { value: 'payroll', label: 'Payroll Report', icon: '💰' },
    { value: 'leave', label: 'Leave Analysis', icon: '🏖️' },
    { value: 'recruitment', label: 'Recruitment Metrics', icon: '🎯' },
  ];

  const reportPeriods = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'annually', label: 'Annually' },
    { value: 'custom', label: 'Custom Range' },
  ];

  return (
    <>
      <style jsx>{`
        @keyframes modalEnter {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes modalExit {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
        }

        @keyframes backdropEnter {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes backdropExit {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
          }
        }

        .modal-backdrop {
          animation: ${isClosing ? 'backdropExit' : 'backdropEnter'} 0.2s ease-out forwards;
          backdrop-filter: blur(8px);
        }

        .modal-content {
          animation: ${isClosing ? 'modalExit' : 'modalEnter'} 0.2s ease-out forwards;
        }

        .slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }

        .input-focused {
          animation: pulseGlow 2s infinite;
        }

        .glass-morphism {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .floating-label {
          transform: translateY(-20px) scale(0.75);
          color: #3b82f6;
        }

        .custom-select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 12px center;
          background-repeat: no-repeat;
          background-size: 16px;
        }

        .form-group {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .floating-input {
          padding-top: 1.5rem;
          padding-bottom: 0.5rem;
        }

        .floating-input:focus + .floating-label,
        .floating-input:not(:placeholder-shown) + .floating-label {
          transform: translateY(-20px) scale(0.75);
          color: #3b82f6;
        }
      `}</style>

      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="modal-backdrop fixed inset-0 bg-gradient-to-br from-slate-900/80 to-slate-800/80"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="modal-content glass-morphism relative z-10 w-full max-w-lg rounded-2xl p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Generate New Report
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Create comprehensive reports with real-time data
                </p>
              </div>
              <button
                onClick={handleClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-all duration-200 hover:bg-slate-200 hover:text-slate-600 hover:rotate-90"
                aria-label="Close modal"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Report Title */}
              <div className="form-group slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="relative">
                  <input
                    type="text"
                    id="reportTitle"
                    className={`floating-input peer w-full rounded-xl border-2 border-slate-200 bg-white/50 px-4 py-3 text-slate-900 placeholder-transparent transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                      focusedField === 'title' ? 'input-focused' : ''
                    }`}
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    onFocus={() => setFocusedField('title')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Report Title"
                    required
                  />
                  <label 
                    htmlFor="reportTitle" 
                    className="floating-label absolute left-4 top-3 origin-left text-slate-500 transition-all duration-200 peer-focus:floating-label peer-[:not(:placeholder-shown)]:floating-label"
                  >
                    Report Title <span className="text-red-400">*</span>
                  </label>
                </div>
              </div>

              {/* Report Type */}
              <div className="form-group slide-up" style={{ animationDelay: '0.2s' }}>
                <label className="mb-3 block text-sm font-medium text-slate-700">
                  Report Type <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {reportTypes.map((type, index) => (
                    <label
                      key={type.value}
                      className={`relative flex cursor-pointer items-center rounded-xl border-2 p-3 transition-all duration-200 hover:bg-blue-50 ${
                        reportType === type.value
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-slate-200 bg-white/50'
                      }`}
                      style={{ animationDelay: `${0.05 * index}s` }}
                    >
                      <input
                        type="radio"
                        name="reportType"
                        value={type.value}
                        checked={reportType === type.value}
                        onChange={(e) => setReportType(e.target.value)}
                        className="sr-only"
                      />
                      <span className="mr-3 text-lg">{type.icon}</span>
                      <span className="text-sm font-medium text-slate-700">{type.label}</span>
                      {reportType === type.value && (
                        <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Report Period */}
              <div className="form-group slide-up" style={{ animationDelay: '0.3s' }}>
                <label htmlFor="reportPeriod" className="mb-3 block text-sm font-medium text-slate-700">
                  Report Period <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    id="reportPeriod"
                    className="custom-select w-full appearance-none rounded-xl border-2 border-slate-200 bg-white/50 px-4 py-3 pr-10 text-slate-900 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                    value={reportPeriod}
                    onChange={(e) => {
                      setReportPeriod(e.target.value);
                      if (e.target.value !== 'custom') {
                        setStartDate('');
                        setEndDate('');
                      }
                    }}
                    required
                  >
                    {reportPeriods.map((period) => (
                      <option key={period.value} value={period.value}>
                        {period.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom Date Range */}
              {reportPeriod === 'custom' && (
                <div className="slide-up grid grid-cols-2 gap-4" style={{ animationDelay: '0.4s' }}>
                  <div className="form-group">
                    <div className="relative">
                      <input
                        type="date"
                        id="startDate"
                        className="floating-input peer w-full rounded-xl border-2 border-slate-200 bg-white/50 px-4 py-3 text-slate-900 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required={reportPeriod === 'custom'}
                      />
                      <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-slate-500">
                        From Date <span className="text-red-400">*</span>
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="relative">
                      <input
                        type="date"
                        id="endDate"
                        className="floating-input peer w-full rounded-xl border-2 border-slate-200 bg-white/50 px-4 py-3 text-slate-900 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required={reportPeriod === 'custom'}
                      />
                      <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-medium text-slate-500">
                        To Date <span className="text-red-400">*</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="slide-up flex justify-end space-x-3 pt-6" style={{ animationDelay: '0.5s' }}>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl border-2 border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-500/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                >
                  <span className="relative z-10 flex items-center">
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Generate Report
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};