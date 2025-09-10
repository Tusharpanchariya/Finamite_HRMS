import React, { useState } from 'react';
import { Building2, Users, User, Target, ArrowLeft, ArrowRight, Check, Calendar, FileText, Clock, AlertCircle } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

interface CompanyInfo {
  name: string;
  industry: string;
  size: string;
  location: string;
}

interface WorkspaceInfo {
  workspaceName: string;
  workspaceType: string;
  description: string;
}

interface UserRole {
  role: string;
  department: string;
  permissions: string[];
}

interface UsagePreferences {
  primaryUse: string[];
  features: string[];
  notifications: boolean;
}

const OnboardingFlow: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    industry: '',
    size: '',
    location: ''
  });
  const [workspaceInfo, setWorkspaceInfo] = useState<WorkspaceInfo>({
    workspaceName: '',
    workspaceType: '',
    description: ''
  });
  const [userRole, setUserRole] = useState<UserRole>({
    role: '',
    department: '',
    permissions: []
  });
  const [usagePreferences, setUsagePreferences] = useState<UsagePreferences>({
    primaryUse: [],
    features: [],
    notifications: true
  });

  const totalSteps = 4;

  const steps = [
    {
      number: 1,
      title: "Company Information",
      description: "Tell us about your company",
      icon: Building2,
      color: "blue"
    },
    {
      number: 2,
      title: "Workspace Setup",
      description: "Create workspace for your team",
      icon: Users,
      color: "green"
    },
    {
      number: 3,
      title: "User Role",
      description: "Define your role and permissions",
      icon: User,
      color: "purple"
    },
    {
      number: 4,
      title: "Usage Preferences",
      description: "Choose your main features",
      icon: Target,
      color: "orange"
    }
  ];

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 
    'Retail', 'Consulting', 'Real Estate', 'Media', 'Other'
  ];

  const companySizes = [
    '1-10 employees', '11-50 employees', '51-200 employees', 
    '201-500 employees', '501-1000 employees', '1000+ employees'
  ];

  const workspaceTypes = [
    'Small Team', 'Department', 'Company-wide', 'Multi-location', 'Remote Team'
  ];

  const roles = [
    'HR Manager', 'HR Director', 'HR Assistant', 'Admin', 'Manager', 'Employee'
  ];

  const departments = [
    'Human Resources', 'Finance', 'Engineering', 'Marketing', 'Sales', 
    'Operations', 'Customer Support', 'Legal', 'IT', 'Other'
  ];

  const permissions = [
    'View all employees', 'Edit employee data', 'Manage attendance', 
    'Process payroll', 'Handle leave requests', 'Generate reports'
  ];

  const primaryUseOptions = [
    { id: 'attendance', label: 'Attendance Tracking', icon: Clock },
    { id: 'employee', label: 'Employee Management', icon: Users },
    { id: 'leave', label: 'Leave Management', icon: Calendar },
    { id: 'documents', label: 'Document Management', icon: FileText },
    { id: 'departments', label: 'Department Organization', icon: Building2 },
    { id: 'reports', label: 'HR Reports & Analytics', icon: AlertCircle }
  ];

  const features = [
    'Automated reminders', 'Mobile notifications', 'Bulk operations', 
    'Advanced reporting', 'Integration with email', 'Custom workflows'
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return companyInfo.name && companyInfo.industry && companyInfo.size && companyInfo.location;
      case 2:
        return workspaceInfo.workspaceName && workspaceInfo.workspaceType;
      case 3:
        return userRole.role && userRole.department;
      case 4:
        return usagePreferences.primaryUse.length > 0;
      default:
        return false;
    }
  };

  const togglePrimaryUse = (useId: string) => {
    setUsagePreferences(prev => ({
      ...prev,
      primaryUse: prev.primaryUse.includes(useId)
        ? prev.primaryUse.filter(id => id !== useId)
        : [...prev.primaryUse, useId]
    }));
  };

  const toggleFeature = (feature: string) => {
    setUsagePreferences(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const togglePermission = (permission: string) => {
    setUserRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const getStepIcon = (step: any) => {
    const IconComponent = step.icon;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <div className="fixed inset-0 bg-white flex h-screen overflow-hidden">
      {/* Left Sidebar - Progress */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">HRDashboard</h1>
            </div>
          </div>
          <p className="text-sm text-gray-600">Setup your workspace in {totalSteps} simple steps</p>
        </div>

        {/* Progress Steps */}
        <div className="flex-1 p-6">
          <div className="space-y-6">
            {steps.map((step, index) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              const IconComponent = step.icon;
              
              return (
                <div key={step.number} className="flex items-start space-x-4">
                  {/* Step Indicator */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isCompleted 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : isActive 
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <IconComponent className="w-5 h-5" />
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-0.5 h-12 mt-2 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 pb-6">
                    <h3 className={`font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm mt-1 ${
                      isActive ? 'text-gray-700' : 'text-gray-500'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Help Text */}
        <div className="p-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Need help? Contact our support team at support@hrdashboard.com
          </p>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {steps[currentStep - 1].title}
              </h2>
              <p className="text-gray-600 mt-1">
                {steps[currentStep - 1].description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</div>
              <div className="w-32 h-2 bg-gray-200 rounded-full mt-2">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-8">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                
                {/* Step 1: Company Information */}
                {currentStep === 1 && (
                  <div>
                    <div className="text-center mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        We need some of your Company Information
                      </h3>
                      <p className="text-gray-600">
                        This helps us customize your experience and set up your workspace properly
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={companyInfo.name}
                          onChange={(e) => setCompanyInfo(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter your company name"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Industry <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={companyInfo.industry}
                            onChange={(e) => setCompanyInfo(prev => ({ ...prev, industry: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select industry</option>
                            {industries.map(industry => (
                              <option key={industry} value={industry}>{industry}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Size <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={companyInfo.size}
                            onChange={(e) => setCompanyInfo(prev => ({ ...prev, size: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select company size</option>
                            {companySizes.map(size => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={companyInfo.location}
                          onChange={(e) => setCompanyInfo(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="Enter your location"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Workspace Setup */}
                {currentStep === 2 && (
                  <div>
                    <div className="text-center mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        We can now create a workspace for your team
                      </h3>
                      <p className="text-gray-600">
                        Set up your workspace to organize your team and manage HR processes
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Workspace Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={workspaceInfo.workspaceName}
                          onChange={(e) => setWorkspaceInfo(prev => ({ ...prev, workspaceName: e.target.value }))}
                          placeholder="e.g., HR Department, Main Office"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Workspace Type <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                          {workspaceTypes.map(type => (
                            <button
                              key={type}
                              onClick={() => setWorkspaceInfo(prev => ({ ...prev, workspaceType: type }))}
                              className={`p-4 border-2 rounded-lg text-left transition-all ${
                                workspaceInfo.workspaceType === type
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                              }`}
                            >
                              <div className="font-medium">{type}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description (Optional)
                        </label>
                        <textarea
                          value={workspaceInfo.description}
                          onChange={(e) => setWorkspaceInfo(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Briefly describe your workspace purpose"
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: User Role */}
                {currentStep === 3 && (
                  <div>
                    <div className="text-center mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        What is your role in your company?
                      </h3>
                      <p className="text-gray-600">
                        This helps us set up appropriate permissions and customize your dashboard
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Role <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={userRole.role}
                            onChange={(e) => setUserRole(prev => ({ ...prev, role: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select your role</option>
                            {roles.map(role => (
                              <option key={role} value={role}>{role}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Department <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={userRole.department}
                            onChange={(e) => setUserRole(prev => ({ ...prev, department: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select department</option>
                            {departments.map(dept => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Permissions (Optional)
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                          {permissions.map(permission => (
                            <label key={permission} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={userRole.permissions.includes(permission)}
                                onChange={() => togglePermission(permission)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-700">{permission}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Usage Preferences */}
                {currentStep === 4 && (
                  <div>
                    <div className="text-center mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        What will you mainly use HRDashboard for?
                      </h3>
                      <p className="text-gray-600">
                        Select the features you'll use most to personalize your dashboard
                      </p>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          Primary Use Cases <span className="text-red-500">*</span> (Select all that apply)
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {primaryUseOptions.map(option => {
                            const IconComponent = option.icon;
                            return (
                              <button
                                key={option.id}
                                onClick={() => togglePrimaryUse(option.id)}
                                className={`p-4 border-2 rounded-lg text-left transition-all ${
                                  usagePreferences.primaryUse.includes(option.id)
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    usagePreferences.primaryUse.includes(option.id)
                                      ? 'bg-blue-500 text-white'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    <IconComponent className="w-4 h-4" />
                                  </div>
                                  <span className={`font-medium ${
                                    usagePreferences.primaryUse.includes(option.id)
                                      ? 'text-blue-700'
                                      : 'text-gray-700'
                                  }`}>
                                    {option.label}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          Additional Features (Optional)
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {features.map(feature => (
                            <label key={feature} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={usagePreferences.features.includes(feature)}
                                onChange={() => toggleFeature(feature)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={usagePreferences.notifications}
                            onChange={(e) => setUsagePreferences(prev => ({ ...prev, notifications: e.target.checked }))}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Enable email notifications</span>
                            <p className="text-xs text-gray-500">Get notified about important updates and reminders</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-gray-200 px-8 py-6">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                isStepValid()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>{currentStep === totalSteps ? 'Complete Setup' : 'Continue'}</span>
              {currentStep === totalSteps ? (
                <Check className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component that includes the onboarding flow
export const ongoingpage: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Assume user is logged in

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    console.log('Onboarding completed! Redirecting to dashboard...');
  };

  if (!isLoggedIn) {
    return <div>Login Page would be here</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showOnboarding && (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}
      
      {!showOnboarding && (
        <div className="p-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Your HR Dashboard!
            </h1>
            <p className="text-gray-600 mb-8">
              Your workspace has been set up successfully. You can now start managing your HR processes.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Employee Management</h3>
                <p className="text-sm text-gray-600">Manage your team members and their information</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <Clock className="w-8 h-8 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Attendance Tracking</h3>
                <p className="text-sm text-gray-600">Track employee attendance and working hours</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Leave Management</h3>
                <p className="text-sm text-gray-600">Handle leave requests and manage balances</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowOnboarding(true)}
              className="mt-8 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Restart Onboarding (Demo)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
