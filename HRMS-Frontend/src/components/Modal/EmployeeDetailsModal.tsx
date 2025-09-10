import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { X, User, Building, Home, CreditCard, Mail, Phone, Calendar, Briefcase, Info as InfoIcon, Edit, Camera, CheckCircle, XCircle } from 'lucide-react';
import { employeeService } from '../../services/employee.service';
import { departmentApiService } from '../../services/departmentApi';
import { mapFormDataToEmployeeUpdateAPI, mapFormDataToStatutoryUpdateAPI, mapEmployeeToFormData } from '../../Utils/employeeMapper';
import { EmployeeFormData, EmployeeWithStatutoryDetails, UpdateEmployeeRequest, UpdateStatutoryDetailsRequest, Department } from '../../types/employee.types';

interface EmployeeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeWithStatutoryDetails;
  onUpdate?: (employee: EmployeeWithStatutoryDetails) => void;
}

interface InputProps {
  label: string;
  error?: string;
  className?: string;
  [key: string]: any;
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  error?: string;
  className?: string;
  [key: string]: any;
}

interface FormErrors {
  [key: string]: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastProps extends Toast {
  onClose: (id: string) => void;
}

// Input Component (reused from AddEmployeeModal)
const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
        error ? 'border-red-300 bg-red-50' : 'border-gray-300'
      }`}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-red-600 font-medium">{error}</p>}
  </div>
);

// Select Component (reused from AddEmployeeModal)
const Select: React.FC<SelectProps> = ({ label, options, error, className = '', ...props }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <select
      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 appearance-none bg-white ${
        error ? 'border-red-300 bg-red-50' : 'border-gray-300'
      }`}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-600 font-medium">{error}</p>}
  </div>
);

// Modal Component (reused from AddEmployeeModal for consistency)
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; }> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-out"
        onClick={onClose}
      />
      {/* Modal */}
      <div
        className="flex h-screen items-center justify-center p-4" // Changed min-h-full to h-screen for better centering
      >
        <div
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl transform transition-all duration-300 ease-out scale-100 opacity-100"
          style={{
            animation: isOpen ? 'modalSlideIn 0.3s ease-out' : 'modalSlideOut 0.3s ease-in'
          }}
        >
          {children}
        </div>
      </div>
      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes modalSlideOut {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
        }
      `}</style>
    </div>
  );
};

// Toast Component (reused from AddEmployeeModal)
const ToastComponent: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300);
    }, 4000); // Toast disappears after 4 seconds

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const config = {
    success: {
      bgColor: 'bg-green-500',
      icon: CheckCircle,
      borderColor: 'border-green-400'
    },
    error: {
      bgColor: 'bg-red-500',
      icon: XCircle,
      borderColor: 'border-red-400'
    },
    info: {
      bgColor: 'bg-blue-500',
      icon: InfoIcon,
      borderColor: 'border-blue-400'
    }
  }[type];

  const Icon = config.icon;

  return (
    <div
      className={`fixed top-4 right-4 z-[60] p-4 rounded-lg shadow-xl text-white flex items-center space-x-3 transition-all duration-300 ease-in-out transform min-w-[300px] max-w-[400px] border-l-4 ${config.bgColor} ${config.borderColor}
        ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}`}
    >
      <Icon className="w-6 h-6 flex-shrink-0" />
      <span className="font-medium text-sm leading-relaxed flex-1">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose(id), 300);
        }}
        className="ml-auto hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors duration-200 flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Toast Container Component (reused from AddEmployeeModal)
const ToastContainer: React.FC<{ toasts: Toast[]; onClose: (id: string) => void }> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-[60] space-y-2">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            transform: `translateY(${index * 10}px)`,
            zIndex: 60 - index
          }}
        >
          <ToastComponent {...toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
};

// Helper component for detail rows (view mode)
const DetailRow: React.FC<{ icon: React.ElementType; label: string; value: string | number | undefined; }> = ({ icon: Icon, label, value }) => {
  if (value === undefined || value === null || value === '') return null; // Don't render if value is empty or undefined

  return (
    <div className="flex items-start space-x-3 py-2 border-b border-gray-100 last:border-b-0">
      <Icon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-600">{label}:</span>
        <span className="text-base text-gray-800 font-semibold">{value}</span>
      </div>
    </div>
  );
};

export const EmployeeDetailsModal: React.FC<EmployeeDetailsModalProps> = ({ isOpen, onClose, employee, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<EmployeeFormData>({
    fullName: '', email: '', contactNumber: '', dateOfBirth: '', joiningDate: '', trainingstatus: '',
    emergencyContact: '', address: '', city: '', state: '', // Changed from stateName to state
    pinCode: '', aadhaarNumber: '', panNumber: '', bankName: '', bankAccount: '',
    ifscCode: '', uanNumber: '', esicNumber: '', designation: '', departmentName: '',
    employeeType: '', status: 'ACTIVE', avatar: ''
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  // State to manage open sections (using Set for unique IDs and easy checking)
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  // Department state
  const [departments, setDepartments] = useState<SelectOption[]>([
    { value: '', label: 'Select Department' }
  ]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState<boolean>(false);

  // Initialize form data and avatar preview when modal opens or employee changes
  useEffect(() => {
    if (isOpen && employee) {
      const mappedFormData = mapEmployeeToFormData(employee);
      setFormData(mappedFormData);
      setAvatarPreview(employee.photo || '');
      setIsEditing(false); // Reset edit mode on open
      setErrors({}); // Clear errors
      clearAllToasts(); // Clear any existing toasts
      loadDepartments(); // Load departments when modal opens
    }
  }, [isOpen, employee]); 

  const loadDepartments = async () => {
    try {
      setIsLoadingDepartments(true);
      const response = await departmentApiService.getAllDepartments();
      
      if (response.success && response.data) {
        const departmentOptions: SelectOption[] = [
          { value: '', label: 'Select Department' },
          ...response.data.map((dept: Department) => ({
            value: dept.name,
            label: dept.name
          }))
        ];
        setDepartments(departmentOptions);
      }
    } catch (error) {
      console.error('Failed to load departments:', error);
      // Keep default departments as fallback
      const defaultDepartments: SelectOption[] = [
        { value: '', label: 'Select Department' },
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Human Resources', label: 'Human Resources' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Sales', label: 'Sales' },
        { value: 'Design', label: 'Design' },
        { value: 'Product', label: 'Product' },
        { value: 'Analytics', label: 'Analytics' }
      ];
      setDepartments(defaultDepartments);
    } finally {
      setIsLoadingDepartments(false);
    }
  };

  const statusOptions: SelectOption[] = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'ON_LEAVE', label: 'On Leave' }
  ];

  const employeeTypeOptions: SelectOption[] = [
  { value: '', label: 'Select Type' },
  { value: 'FULL_TIME', label: 'Full-time' },
  { value: 'PART_TIME', label: 'Part-time' },
  { value: 'CONTRACT', label: 'Contract' }, // ✅ not "Remote"
];

  const trainingstatusOptions: SelectOption[] = [
  { value: '', label: 'Select Training status' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'NOT_STARTED', label: 'Not Started' },
];
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const newToast: Toast = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      message,
      type
    };
    setToasts(prevToasts => [...prevToasts, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };


  const handleInputChange = (field: keyof EmployeeFormData, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size must be less than 5MB. Please choose a smaller image.', 'error');
        return;
      }
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (PNG, JPG, JPEG).', 'error');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        showToast('Profile picture uploaded successfully!', 'success');
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarFile(null);
      setAvatarPreview('');
    }
  };

  const triggerFileInput = (): void => {
    fileInputRef.current?.click();
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Phone Number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber.replace(/\D/g, ''))) {
      newErrors.contactNumber = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.joiningDate) newErrors.joiningDate = 'Date of Joining is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const missingFields = Object.keys(newErrors).length;
      showToast(
        `Please fill in all mandatory fields correctly. ${missingFields} field${missingFields > 1 ? 's' : ''} need${missingFields === 1 ? 's' : ''} attention.`,
        'error'
      );
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    clearAllToasts();
    showToast('Validating form data...', 'info');
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      showToast('Saving employee information...', 'info');
      
      // Map form data to employee API format
      const employeeUpdateData = mapFormDataToEmployeeUpdateAPI(formData, Number(employee.id));
      
      // Map form data to statutory API format
      const statutoryUpdateData = mapFormDataToStatutoryUpdateAPI(formData, Number(employee.id));
      
      // Call the combined update API method
      const { employee: employeeResponse, statutory: statutoryResponse } = await employeeService.updateEmployeeWithStatutoryDetails(
        employeeUpdateData,
        statutoryUpdateData
      );
      
      if (employeeResponse.success && employeeResponse.data) {
        const updatedEmployee = Array.isArray(employeeResponse.data) ? employeeResponse.data[0] : employeeResponse.data;
        
        // Get statutory details if available
        const statutory = statutoryResponse?.success && statutoryResponse.data 
          ? (Array.isArray(statutoryResponse.data) ? statutoryResponse.data[0] : statutoryResponse.data)
          : undefined;
        
        // Create updated display employee
        const updatedEmployeeWithStatutory: EmployeeWithStatutoryDetails = {
          ...updatedEmployee,
          avatar: avatarPreview || updatedEmployee.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
          statutoryDetails: statutory
        };
        
        // Call the onUpdate callback if provided
        if (onUpdate) {
          onUpdate(updatedEmployeeWithStatutory);
        }
        
        clearAllToasts();
        showToast(`Employee "${formData.fullName}" details updated successfully!`, 'success');
        setIsEditing(false); // Exit edit mode
      } else {
        throw new Error(employeeResponse.message || 'Failed to update employee');
      }
      
    } catch (error) {
      console.error("Failed to save employee details:", error);
      clearAllToasts();
      const errorMessage = error instanceof Error ? error.message : 'Failed to save employee details. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Revert formData to original employee data
    if (employee) {
      const mappedFormData = mapEmployeeToFormData(employee);
      setFormData(mappedFormData);
      setAvatarPreview(employee.avatar || '');
    }
    setErrors({});
    clearAllToasts();
    showToast('Edit cancelled. Changes not saved.', 'info');
  };

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => {
      const newOpenSections = new Set(prev);
      if (newOpenSections.has(sectionId)) {
        newOpenSections.delete(sectionId);
      } else {
        newOpenSections.add(sectionId);
      }
      return newOpenSections;
    });
  };

  if (!employee) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              {isEditing ? <Edit className="w-5 h-5 text-indigo-600" /> : <InfoIcon className="w-5 h-5 text-indigo-600" />}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditing ? `Edit Employee: ${employee.fullName}` : `Employee Details: ${employee.fullName}`}
              </h2>
              <p className="text-sm text-gray-500">
                {isEditing ? 'Modify employee information' : 'Comprehensive information about the employee'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-200"
            disabled={isSubmitting} // Disable close button during submission
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column: Avatar and Basic Info */}
            <div className="flex flex-col items-center md:items-start md:w-1/4 p-4 bg-gray-50 rounded-lg shadow-inner">
              {isEditing ? (
                // Avatar upload in edit mode
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 shadow-sm relative group">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-12 h-12 text-gray-400" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full"
                    title="Change Profile Picture"
                  >
                    <Camera className="w-8 h-8" />
                  </button>
                </div>
              ) : (
                // Avatar in view mode
                <img
                  src={employee.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'}
                  alt={employee.fullName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md mb-4"
                />
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-1 text-center md:text-left">{employee.fullName}</h3>
              <p className="text-lg text-gray-700 mb-4 text-center md:text-left">{employee.designation} - {employee.departmentName}</p>

              <div className="w-full space-y-2">
                <div className="flex items-center space-x-2 text-gray-700">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span>{employee.contactNumber}</span>
                </div>
                {employee.emergencyContact && (
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span>{employee.emergencyContact} (Alt)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Detailed Information / Editable Fields */}
            <div className="md:w-2/3">
              {/* Personal Information Section */}
              <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <button
                  className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
                  onClick={() => toggleSection('personal')}
                >
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Personal Information
                  </h3>
                  <InfoIcon className={`w-5 h-5 text-gray-500 transform transition-transform duration-220 ${openSections.has('personal') ? 'rotate-90' : ''}`} />
                </button>
                {openSections.has('personal') && (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white">
                    {isEditing ? (
                      <>
                        <Input
                          label="Full Name *"
                          type="text"
                          value={formData.fullName}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('fullName', e.target.value)}
                          error={errors.fullName}
                          placeholder="Enter full name"
                        />
                        <Input
                          label="Date of Joining *"
                          type="date"
                          value={formData.joiningDate}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('joiningDate', e.target.value)}
                          error={errors.joiningDate}
                        />
                        <Input
                          label="Email Address *"
                          type="email"
                          value={formData.email}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                          error={errors.email}
                          placeholder="Enter email address"
                        />
                        <Input
                          label="Phone Number *"
                          type="tel"
                          value={formData.contactNumber}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('contactNumber', e.target.value)}
                          error={errors.contactNumber}
                          placeholder="Enter 10-digit phone number"
                        />
                        <Input
                          label="Date of Birth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('dateOfBirth', e.target.value)}
                        />
                        <Input
                          label="Alternative Phone Number"
                          type="tel"
                          value={formData.emergencyContact}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('emergencyContact', e.target.value)}
                          placeholder="Enter alternative phone number"
                        />
                        <Select
                          label="Training status"
                          options={trainingstatusOptions}
                          value={formData.trainingstatus}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange('trainingstatus', e.target.value)}
                        />
                      </>
                    ) : (
                      <>
                        <DetailRow icon={User} label="Full Name" value={employee.fullName} />
                        <DetailRow icon={Calendar} label="Date of Joining" value={new Date(employee.joiningDate || '').toLocaleDateString()} />
                        <DetailRow icon={Mail} label="Email Address" value={employee.email} />
                        <DetailRow icon={Phone} label="Phone Number" value={employee.contactNumber} />
                        <DetailRow icon={Calendar} label="Date of Birth" value={employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : 'N/A'} />
                        <DetailRow icon={Phone} label="Alternative Phone" value={employee.emergencyContact || 'N/A'} />
                        <DetailRow icon={InfoIcon} label="Training status" value={employee.trainingstatus || 'N/A'} />
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Address Information Section */}
              <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <button
                  className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
                  onClick={() => toggleSection('address')}
                >
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Home className="w-5 h-5 mr-2 text-purple-600" />
                    Address Information
                  </h3>
                  <InfoIcon className={`w-5 h-5 text-gray-500 transform transition-transform duration-220 ${openSections.has('address') ? 'rotate-90' : ''}`} />
                </button>
                {openSections.has('address') && (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white">
                    {isEditing ? (
                      <>
                        <Input
                          label="Street Address"
                          type="text"
                          value={formData.address}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('address', e.target.value)}
                          className="md:col-span-2"
                          placeholder="Enter street address"
                        />
                        <Input
                          label="City"
                          type="text"
                          value={formData.city}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('city', e.target.value)}
                          placeholder="Enter city"
                        />
                        <Input
                          label="State / Province"
                          type="text"
                          value={formData.state}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('state', e.target.value)}
                          placeholder="Enter state/province"
                        />
                        <Input
                          label="Zip / Postal Code"
                          type="text"
                          value={formData.pinCode}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('pinCode', e.target.value)}
                          placeholder="Enter zip code"
                        />
                      </>
                    ) : (
                      <>
                        <DetailRow icon={Home} label="Street" value={employee.address || 'N/A'} />
                        <DetailRow icon={Home} label="City" value={employee.city || 'N/A'} />
                        <DetailRow icon={Home} label="State" value={employee.state || 'N/A'} />
                        <DetailRow icon={Home} label="Zip Code" value={employee.pinCode || 'N/A'} />
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Identification & Financial Information Section */}
              <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <button
                  className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
                  onClick={() => toggleSection('financial')}
                >
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-orange-600" />
                    Identification & Financial
                  </h3>
                  <InfoIcon className={`w-5 h-5 text-gray-500 transform transition-transform duration-220 ${openSections.has('financial') ? 'rotate-90' : ''}`} />
                </button>
                {openSections.has('financial') && (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white">
                    {isEditing ? (
                      <>
                        <Input
                          label="Aadhar Card Number"
                          type="text"
                          value={formData.aadhaarNumber}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('aadhaarNumber', e.target.value)}
                          placeholder="Enter Aadhar number"
                        />
                        <Input
                          label="PAN Number"
                          type="text"
                          value={formData.panNumber}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('panNumber', e.target.value)}
                          placeholder="Enter PAN number"
                        />
                        <Input
                          label="Bank Name"
                          type="text"
                          value={formData.bankName}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('bankName', e.target.value)}
                          placeholder="Enter bank name"
                        />
                        <Input
                          label="Bank Account Number"
                          type="text"
                          value={formData.bankAccount}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('bankAccount', e.target.value)}
                          placeholder="Enter account number"
                        />
                        <Input
                          label="IFSC Code"
                          type="text"
                          value={formData.ifscCode}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('ifscCode', e.target.value)}
                          placeholder="Enter IFSC code"
                        />
                        <Input
                          label="UAN Number"
                          type="text"
                          value={formData.uanNumber}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('uanNumber', e.target.value)}
                          placeholder="Enter UAN number"
                        />
                        <Input
                          label="ESIC Number"
                          type="text"
                          value={formData.esicNumber}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('esicNumber', e.target.value)}
                          placeholder="Enter ESIC number"
                        />
                      </>
                    ) : (
                      <>
                        <DetailRow icon={CreditCard} label="Aadhar Card" value={employee.statutoryDetails?.aadhaarNumber || 'N/A'} />
                        <DetailRow icon={CreditCard} label="PAN Number" value={employee.statutoryDetails?.panNumber || 'N/A'} />
                        <DetailRow icon={CreditCard} label="Bank Name" value={employee.statutoryDetails?.bankName || 'N/A'} />
                        <DetailRow icon={CreditCard} label="Bank Account" value={employee.statutoryDetails?.bankAccount || 'N/A'} />
                        <DetailRow icon={CreditCard} label="IFSC Code" value={employee.statutoryDetails?.ifscCode || 'N/A'} />
                        <DetailRow icon={CreditCard} label="UAN Number" value={employee.statutoryDetails?.uanNumber || 'N/A'} />
                        <DetailRow icon={CreditCard} label="ESIC Number" value={employee.statutoryDetails?.esicNumber || 'N/A'} />
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Job Information Section */}
              <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <button
                  className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
                  onClick={() => toggleSection('job')}
                >
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Building className="w-5 h-5 mr-2 text-green-600" />
                    Job Information
                  </h3>
                  <InfoIcon className={`w-5 h-5 text-gray-500 transform transition-transform duration-220 ${openSections.has('job') ? 'rotate-90' : ''}`} />
                </button>
                {openSections.has('job') && (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white">
                    {isEditing ? (
                      <>
                        <Input
                          label="Position/Job Title"
                          type="text"
                          value={formData.designation}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('designation', e.target.value)}
                          placeholder="Enter job title"
                        />
                        <Select
                          label={`Department ${isLoadingDepartments ? '(Loading...)' : ''}`}
                          options={departments}
                          value={formData.departmentName}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange('departmentName', e.target.value)}
                          disabled={isLoadingDepartments}
                        />
                        <Select
                          label="Employee Type"
                          options={employeeTypeOptions}
                          value={formData.employeeType}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange('employeeType', e.target.value)}
                        />
                        <Select
                          label="Employment status"
                          options={statusOptions}
                          value={formData.status}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange('status', e.target.value)}
                        />
                      </>
                    ) : (
                      <>
                        <DetailRow icon={Briefcase} label="Position" value={employee.designation} />
                        <DetailRow icon={Building} label="Department" value={employee.departmentName} />
                        <DetailRow icon={InfoIcon} label="Employment status" value={employee.status} />
                        <DetailRow icon={Briefcase} label="Employee Type" value={employee.employeeType || 'N/A'} />
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 p-6">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSubmitting}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Close
              </button>
            </>
          )}
        </div>

        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `}</style>
      </Modal>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
};