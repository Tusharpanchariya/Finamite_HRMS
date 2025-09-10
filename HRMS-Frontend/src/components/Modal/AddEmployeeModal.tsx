import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { X, User, Building, Camera, Home, CreditCard, Plus, CheckCircle, XCircle, Info } from 'lucide-react';
import { employeeService } from '../../services/employee.service';
import { departmentApiService } from '../../services/departmentApi';
import { mapFormDataToEmployeeAPI, mapFormDataToStatutoryAPI } from '../../Utils/employeeMapper';
import { EmployeeFormData, EmployeeWithStatutoryDetails, Department } from '../../types/employee.types';

// Type definitions
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

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface FormData {
  fullName: string;
  email: string;
  contactNumber: string;
  dateOfBirth: string;
  joiningDate: string;
  trainingstatus: string;
  emergencyContact: string;
  address: string;
  city: string;
  state: string; // Changed from stateName to state
  pinCode: string;
  aadhaarNumber: string;
  panNumber: string;
  bankName: string;
  bankAccount: string;
  ifscCode: string;
  uanNumber: string;
  esicNumber: string;
  designation: string;
  departmentName: string;
  employeeType: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  avatar: string;
}

interface FormErrors {
  [key: string]: string;
}

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employee: EmployeeWithStatutoryDetails) => void;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastProps extends Toast {
  onClose: (id: string) => void;
}

// Input Component
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

// Select Component
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

// Modal Component
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-out"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl transform transition-all duration-300 ease-out scale-100 opacity-100"
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

// Toast Component
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
      icon: Info,
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

// Toast Container Component
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

// Add Employee Modal Component
export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    contactNumber: '',
    dateOfBirth: '',
    joiningDate: '',
    trainingstatus: '',
    emergencyContact: '', 
    address: '', 
    city: '', 
    state: '', // Changed from stateName to state
    pinCode: '', 
    aadhaarNumber: '', 
    panNumber: '',
    bankName: '', 
    bankAccount: '', 
    ifscCode: '', 
    uanNumber: '',
    esicNumber: '',
    designation: '',
    departmentName: '',
    employeeType: '', 
    status: 'ACTIVE',
    avatar: '' 
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null); 
  const [avatarPreview, setAvatarPreview] = useState<string>(''); 
  const fileInputRef = useRef<HTMLInputElement>(null); 
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Enhanced Toast State
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Department state
  const [departments, setDepartments] = useState<SelectOption[]>([
    { value: '', label: 'Select Department' }
  ]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState<boolean>(false);

  // Load departments when modal opens
  useEffect(() => {
    if (isOpen) {
      loadDepartments();
    }
  }, [isOpen]);

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
      showToast('Failed to load departments. Using default options.', 'error');
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

  // Enhanced Toast Functions
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Only essential fields are mandatory
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }
    
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
    
    if (!formData.joiningDate) {
      newErrors.joiningDate = 'Date of Joining is required';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      const missingFields = Object.keys(newErrors).length;
      showToast(
        `Please fill in the required fields: ${Object.keys(newErrors).map(key => {
          switch(key) {
            case 'fullName': return 'Full Name';
            case 'email': return 'Email Address';
            case 'contactNumber': return 'Phone Number';
            case 'joiningDate': return 'Date of Joining';
            default: return key;
          }
        }).join(', ')}`, 
        'error'
      );
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (): Promise<void> => {
    // Clear previous toasts before validation
    clearAllToasts();
    
    // Show info toast for validation start
    showToast('Validating form data...', 'info');
    
    // Small delay to show the validation message
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Show processing toast
      showToast('Processing employee information...', 'info');
      
      // Map form data to employee API format
      const normalizeDate = (date: string) => date ? new Date(date).toISOString() : null;

// Map form data to employee API format
const employeeApiData = {
  ...mapFormDataToEmployeeAPI(formData),
  joiningDate: normalizeDate(formData.joiningDate),
  dateOfBirth: normalizeDate(formData.dateOfBirth),
  employeeType: formData.employeeType || undefined,
  trainingstatus: formData.trainingstatus
    ? formData.trainingstatus.toUpperCase().replace(" ", "_")
    : undefined,
};
      
      // Map form data to statutory API format (will be used after employee creation)
      const statutoryApiData = {
        panNumber: formData.panNumber || undefined,
        aadhaarNumber: formData.aadhaarNumber || undefined,
        bankAccount: formData.bankAccount || undefined,
        ifscCode: formData.ifscCode || undefined,
        uanNumber: formData.uanNumber || undefined,
        esicNumber: formData.esicNumber || undefined,
      };
      
      // Call the combined API method
      const { employee: employeeResponse, statutory: statutoryResponse } = await employeeService.createEmployeeWithStatutoryDetails(
        employeeApiData,
        statutoryApiData
      );
      
      if (employeeResponse.success && employeeResponse.data) {
        // Map API response to display format
        const employee = Array.isArray(employeeResponse.data) ? employeeResponse.data[0] : employeeResponse.data;
        
        // Get statutory details if available
        const statutory = statutoryResponse?.success && statutoryResponse.data 
          ? (Array.isArray(statutoryResponse.data) ? statutoryResponse.data[0] : statutoryResponse.data)
          : undefined;
        
        const employeeWithStatutory: EmployeeWithStatutoryDetails = {
          ...employee,
          avatar: avatarPreview || employee.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
          statutoryDetails: statutory
        };
        
        // Submit the employee
        onSubmit(employeeWithStatutory);
        
        // Clear all toasts and show success
        clearAllToasts();
        showToast(`Employee "${formData.fullName}" has been successfully added to the system!`, 'success');
        
        // Close modal after showing success
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        throw new Error(employeeResponse.message || 'Failed to create employee');
      }
      
    } catch (error) {
      console.error("Failed to add employee:", error);
      clearAllToasts();
      const errorMessage = error instanceof Error ? error.message : 'Failed to add employee. Please check your connection and try again.';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = (): void => {
    setFormData({
      fullName: '',
      email: '',
      contactNumber: '',
      dateOfBirth: '',
      joiningDate: '',
      trainingstatus: '',
      emergencyContact: '',
      address: '',
      city: '',
      state: '', // Changed from stateName to state
      pinCode: '',
      aadhaarNumber: '',
      panNumber: '',
      bankName: '',
      bankAccount: '',
      ifscCode: '',
      uanNumber: '',
      esicNumber: '',
      designation: '',
      departmentName: '',
      employeeType: '',
      status: 'ACTIVE',
      avatar: ''
    });
    setErrors({});
    setAvatarFile(null);
    setAvatarPreview('');
    setIsSubmitting(false);
    clearAllToasts();
    onClose();
  };

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size must be less than 5MB. Please choose a smaller image.', 'error');
        return;
      }
      
      // Validate file type
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

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Add New Employee</h2>
              <p className="text-sm text-gray-500">Fill in the information to add a new team member</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-200"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="md:col-span-2 mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center pb-2 border-b border-gray-200">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Personal Information
              </h3>
            </div>

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

            {/* Avatar Upload */}
            <div className="col-span-1 md:col-span-2 mb-4"> 
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 shadow-sm">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
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
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
                  >
                    {avatarFile ? 'Change Image' : 'Upload Image'}
                  </button>
                  {avatarFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarFile(null);
                        setAvatarPreview('');
                        if (fileInputRef.current) fileInputRef.current.value = ''; 
                      }}
                      className="ml-2 px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200 shadow-sm"
                    >
                      Remove
                    </button>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Optional: PNG, JPG, up to 5MB</p>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="md:col-span-2 mt-6 mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center pb-2 border-b border-gray-200">
                <Home className="w-5 h-5 mr-2 text-purple-600" />
                Address Information
              </h3>
            </div>

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

            {/* Identification & Financial Information */}
            <div className="md:col-span-2 mt-6 mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center pb-2 border-b border-gray-200">
                <CreditCard className="w-5 h-5 mr-2 text-orange-600" /> 
                Identification & Financial
              </h3>
            </div>

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

            {/* Job Information */}
            <div className="md:col-span-2 mt-6 mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center pb-2 border-b border-gray-200">
                <Building className="w-5 h-5 mr-2 text-green-600" />
                Job Information
              </h3>
            </div>

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

            <Select
              label="Training status"
              options={trainingstatusOptions}
              value={formData.trainingstatus}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange('trainingstatus', e.target.value)}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 p-6"> 
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Adding Employee...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add Employee</span>
              </>
            )}
          </button>
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

      {/* Enhanced Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
};

export default AddEmployeeModal;