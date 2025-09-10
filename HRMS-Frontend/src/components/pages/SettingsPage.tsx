import React, { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Save,
  Eye,
  EyeOff,
  Check,
  AlertCircle
} from 'lucide-react';

// Card Component
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
    {children}
  </div>
);

// Toggle Switch Component
const ToggleSwitch: React.FC<{ 
  enabled: boolean; 
  onChange: (enabled: boolean) => void; 
  label: string;
  description?: string;
}> = ({ enabled, onChange, label, description }) => (
  <div className="flex items-center justify-between py-4">
    <div className="flex-1">
      <h4 className="text-sm font-medium text-gray-900">{label}</h4>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

// Settings Page Component
export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'appearance' | 'integrations' | 'backup'>('general');
  const [showPassword, setShowPassword] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'TechCorp Inc.',
    companyEmail: 'hr@techcorp.com',
    companyPhone: '+1 (555) 123-4567',
    companyAddress: '123 Business Ave, Tech City, TC 12345',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    fiscalYearStart: 'January'
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorAuth: true,
    sessionTimeout: '60',
    passwordPolicy: {
      minLength: true,
      requireNumbers: true,
      requireSymbols: true,
      requireUppercase: true
    }
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    leaveRequests: true,
    attendanceAlerts: true,
    performanceReviews: true,
    systemUpdates: false,
    weeklyReports: true,
    emergencyAlerts: true
  });

  // Appearance Settings State
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    sidebarCollapsed: false,
    compactMode: false,
    showAvatars: true,
    primaryColor: '#3B82F6'
  });

  // Integration Settings State
  const [integrationSettings, setIntegrationSettings] = useState({
    slackIntegration: true,
    googleCalendar: false,
    microsoftTeams: true,
    payrollSystem: true,
    timeTracking: false
  });

  // Backup Settings State
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    retentionPeriod: '30',
    includeDocuments: true,
    includeReports: true
  });

  const showSaveMessage = (message: string) => {
    setSavedMessage(message);
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleSaveGeneral = () => {
    // In a real app, you would save to backend
    showSaveMessage('General settings saved successfully!');
  };

  const handleSaveSecurity = () => {
    // In a real app, you would save to backend
    showSaveMessage('Security settings updated successfully!');
  };

  const handleSaveNotifications = () => {
    showSaveMessage('Notification preferences saved!');
  };

  const handleSaveAppearance = () => {
    showSaveMessage('Appearance settings applied!');
  };

  const handleSaveIntegrations = () => {
    showSaveMessage('Integration settings updated!');
  };

  const handleSaveBackup = () => {
    showSaveMessage('Backup settings configured!');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Database },
    { id: 'backup', label: 'Backup', icon: Database }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-15xl mx-auto">
        {/* Success Message */}
        {savedMessage && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
            <Check className="w-5 h-5" />
            <span>{savedMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your HR system preferences and configurations</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <Card>
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* General Settings */}
            {activeTab === 'general' && (
              <Card>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">General Settings</h2>
                  <p className="text-sm text-gray-500">Configure basic company information and preferences</p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                      <input
                        type="text"
                        value={generalSettings.companyName}
                        onChange={(e) => setGeneralSettings({...generalSettings, companyName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Email</label>
                      <input
                        type="email"
                        value={generalSettings.companyEmail}
                        onChange={(e) => setGeneralSettings({...generalSettings, companyEmail: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Phone</label>
                      <input
                        type="tel"
                        value={generalSettings.companyPhone}
                        onChange={(e) => setGeneralSettings({...generalSettings, companyPhone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                      <select
                        value={generalSettings.timezone}
                        onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Address</label>
                    <textarea
                      value={generalSettings.companyAddress}
                      onChange={(e) => setGeneralSettings({...generalSettings, companyAddress: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                      <select
                        value={generalSettings.dateFormat}
                        onChange={(e) => setGeneralSettings({...generalSettings, dateFormat: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                      <select
                        value={generalSettings.currency}
                        onChange={(e) => setGeneralSettings({...generalSettings, currency: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="CAD">CAD (C$)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fiscal Year Start</label>
                      <select
                        value={generalSettings.fiscalYearStart}
                        onChange={(e) => setGeneralSettings({...generalSettings, fiscalYearStart: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="January">January</option>
                        <option value="April">April</option>
                        <option value="July">July</option>
                        <option value="October">October</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSaveGeneral}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              </Card>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <Card>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Security Settings</h2>
                  <p className="text-sm text-gray-500">Manage password policies and security preferences</p>
                </div>

                <div className="space-y-6">
                  {/* Password Change */}
                  <div>
                    <h3 className="text-md font-semibold text-gray-900 mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={securitySettings.currentPassword}
                            onChange={(e) => setSecuritySettings({...securitySettings, currentPassword: e.target.value})}
                            className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={securitySettings.newPassword}
                            onChange={(e) => setSecuritySettings({...securitySettings, newPassword: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={securitySettings.confirmPassword}
                            onChange={(e) => setSecuritySettings({...securitySettings, confirmPassword: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-md font-semibold text-gray-900 mb-4">Security Preferences</h3>
                    <div className="space-y-4">
                      <ToggleSwitch
                        enabled={securitySettings.twoFactorAuth}
                        onChange={(enabled) => setSecuritySettings({...securitySettings, twoFactorAuth: enabled})}
                        label="Two-Factor Authentication"
                        description="Add an extra layer of security to your account"
                      />
                      
                      <div className="flex items-center justify-between py-4">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">Session Timeout</h4>
                          <p className="text-sm text-gray-500 mt-1">Automatically log out after period of inactivity (minutes)</p>
                        </div>
                        <select
                          value={securitySettings.sessionTimeout}
                          onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="15">15 minutes</option>
                          <option value="30">30 minutes</option>
                          <option value="60">1 hour</option>
                          <option value="120">2 hours</option>
                          <option value="480">8 hours</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-md font-semibold text-gray-900 mb-4">Password Policy</h3>
                    <div className="space-y-3">
                      {Object.entries({
                        minLength: 'Minimum 8 characters',
                        requireNumbers: 'Require numbers',
                        requireSymbols: 'Require special characters',
                        requireUppercase: 'Require uppercase letters'
                      }).map(([key, label]) => (
                        <ToggleSwitch
                          key={key}
                          enabled={securitySettings.passwordPolicy[key as keyof typeof securitySettings.passwordPolicy]}
                          onChange={(enabled) => setSecuritySettings({
                            ...securitySettings,
                            passwordPolicy: { ...securitySettings.passwordPolicy, [key]: enabled }
                          })}
                          label={label}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSaveSecurity}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Security Settings</span>
                    </button>
                  </div>
                </div>
              </Card>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <Card>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Notification Settings</h2>
                  <p className="text-sm text-gray-500">Choose how you want to receive notifications</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-semibold text-gray-900 mb-4">Notification Methods</h3>
                    <div className="space-y-3">
                      <ToggleSwitch
                        enabled={notificationSettings.emailNotifications}
                        onChange={(enabled) => setNotificationSettings({...notificationSettings, emailNotifications: enabled})}
                        label="Email Notifications"
                        description="Receive notifications via email"
                      />
                      <ToggleSwitch
                        enabled={notificationSettings.pushNotifications}
                        onChange={(enabled) => setNotificationSettings({...notificationSettings, pushNotifications: enabled})}
                        label="Push Notifications"
                        description="Receive browser push notifications"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-md font-semibold text-gray-900 mb-4">HR Notifications</h3>
                    <div className="space-y-3">
                      <ToggleSwitch
                        enabled={notificationSettings.leaveRequests}
                        onChange={(enabled) => setNotificationSettings({...notificationSettings, leaveRequests: enabled})}
                        label="Leave Requests"
                        description="Notifications for new leave requests and status changes"
                      />
                      <ToggleSwitch
                        enabled={notificationSettings.attendanceAlerts}
                        onChange={(enabled) => setNotificationSettings({...notificationSettings, attendanceAlerts: enabled})}
                        label="Attendance Alerts"
                        description="Late arrivals, missed check-ins, and overtime alerts"
                      />
                      <ToggleSwitch
                        enabled={notificationSettings.performanceReviews}
                        onChange={(enabled) => setNotificationSettings({...notificationSettings, performanceReviews: enabled})}
                        label="Performance Reviews"
                        description="Reminders for upcoming reviews and completions"
                      />
                      <ToggleSwitch
                        enabled={notificationSettings.emergencyAlerts}
                        onChange={(enabled) => setNotificationSettings({...notificationSettings, emergencyAlerts: enabled})}
                        label="Emergency Alerts"
                        description="Critical system alerts and security notifications"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-md font-semibold text-gray-900 mb-4">System Notifications</h3>
                    <div className="space-y-3">
                      <ToggleSwitch
                        enabled={notificationSettings.systemUpdates}
                        onChange={(enabled) => setNotificationSettings({...notificationSettings, systemUpdates: enabled})}
                        label="System Updates"
                        description="Notifications about system maintenance and updates"
                      />
                      <ToggleSwitch
                        enabled={notificationSettings.weeklyReports}
                        onChange={(enabled) => setNotificationSettings({...notificationSettings, weeklyReports: enabled})}
                        label="Weekly Reports"
                        description="Automated weekly summary reports"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSaveNotifications}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Notification Settings</span>
                    </button>
                  </div>
                </div>
              </Card>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <Card>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Appearance Settings</h2>
                  <p className="text-sm text-gray-500">Customize the look and feel of your dashboard</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-semibold text-gray-900 mb-4">Theme</h3>
                    <div className="flex space-x-4">
                      {['light', 'dark', 'auto'].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => setAppearanceSettings({...appearanceSettings, theme})}
                          className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors duration-200 ${
                            appearanceSettings.theme === theme
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="capitalize">{theme}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-md font-semibold text-gray-900 mb-4">Layout Options</h3>
                    <div className="space-y-3">
                      <ToggleSwitch
                        enabled={appearanceSettings.sidebarCollapsed}
                        onChange={(enabled) => setAppearanceSettings({...appearanceSettings, sidebarCollapsed: enabled})}
                        label="Collapsed Sidebar"
                        description="Start with sidebar collapsed by default"
                      />
                      <ToggleSwitch
                        enabled={appearanceSettings.compactMode}
                        onChange={(enabled) => setAppearanceSettings({...appearanceSettings, compactMode: enabled})}
                        label="Compact Mode"
                        description="Reduce spacing and padding for more content"
                      />
                      <ToggleSwitch
                        enabled={appearanceSettings.showAvatars}
                        onChange={(enabled) => setAppearanceSettings({...appearanceSettings, showAvatars: enabled})}
                        label="Show Avatars"
                        description="Display employee profile pictures in lists"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-md font-semibold text-gray-900 mb-4">Primary Color</h3>
                    <div className="flex space-x-3">
                      {[
                        { color: '#3B82F6', name: 'Blue' },
                        { color: '#10B981', name: 'Green' },
                        { color: '#8B5CF6', name: 'Purple' },
                        { color: '#F59E0B', name: 'Orange' },
                        { color: '#EF4444', name: 'Red' }
                      ].map(({ color, name }) => (
                        <button
                          key={color}
                          onClick={() => setAppearanceSettings({...appearanceSettings, primaryColor: color})}
                          className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 ${
                            appearanceSettings.primaryColor === color
                              ? 'border-gray-900 scale-110'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                          title={name}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSaveAppearance}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Appearance Settings</span>
                    </button>
                  </div>
                </div>
              </Card>
            )}

            {/* Integrations Settings */}
            {activeTab === 'integrations' && (
              <Card>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Integrations</h2>
                  <p className="text-sm text-gray-500">Connect with external services and tools</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    {[
                      {
                        key: 'slackIntegration',
                        name: 'Slack',
                        description: 'Send notifications and updates to Slack channels',
                        icon: '💬',
                        status: integrationSettings.slackIntegration
                      },
                      {
                        key: 'googleCalendar',
                        name: 'Google Calendar',
                        description: 'Sync leave requests and meetings with Google Calendar',
                        icon: '📅',
                        status: integrationSettings.googleCalendar
                      },
                      {
                        key: 'microsoftTeams',
                        name: 'Microsoft Teams',
                        description: 'Integration with Microsoft Teams for notifications',
                        icon: '👥',
                        status: integrationSettings.microsoftTeams
                      },
                      {
                        key: 'payrollSystem',
                        name: 'Payroll System',
                        description: 'Connect with external payroll processing system',
                        icon: '💰',
                        status: integrationSettings.payrollSystem
                      },
                      {
                        key: 'timeTracking',
                        name: 'Time Tracking',
                        description: 'Integration with time tracking applications',
                        icon: '⏰',
                        status: integrationSettings.timeTracking
                      }
                    ].map((integration) => (
                      <div key={integration.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">{integration.icon}</div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{integration.name}</h4>
                            <p className="text-sm text-gray-500">{integration.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            integration.status 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {integration.status ? 'Connected' : 'Disconnected'}
                          </span>
                          <button
                            onClick={() => setIntegrationSettings({
                              ...integrationSettings,
                              [integration.key]: !integration.status
                            })}
                            className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors duration-200 ${
                              integration.status
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            }`}
                          >
                            {integration.status ? 'Disconnect' : 'Connect'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSaveIntegrations}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Integration Settings</span>
                    </button>
                  </div>
                </div>
              </Card>
            )}

            {/* Backup Settings */}
            {activeTab === 'backup' && (
              <Card>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Backup & Data</h2>
                  <p className="text-sm text-gray-500">Configure data backup and retention policies</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-semibold text-gray-900 mb-4">Backup Settings</h3>
                    <div className="space-y-4">
                      <ToggleSwitch
                        enabled={backupSettings.autoBackup}
                        onChange={(enabled) => setBackupSettings({...backupSettings, autoBackup: enabled})}
                        label="Automatic Backups"
                        description="Enable automatic data backups"
                      />
                      
                      <div className="flex items-center justify-between py-4">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">Backup Frequency</h4>
                          <p className="text-sm text-gray-500 mt-1">How often to create backups</p>
                        </div>
                        <select
                          value={backupSettings.backupFrequency}
                          onChange={(e) => setBackupSettings({...backupSettings, backupFrequency: e.target.value})}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={!backupSettings.autoBackup}
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between py-4">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">Retention Period</h4>
                          <p className="text-sm text-gray-500 mt-1">How long to keep backup files (days)</p>
                        </div>
                        <select
                          value={backupSettings.retentionPeriod}
                          onChange={(e) => setBackupSettings({...backupSettings, retentionPeriod: e.target.value})}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="7">7 days</option>
                          <option value="30">30 days</option>
                          <option value="90">90 days</option>
                          <option value="365">1 year</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-md font-semibold text-gray-900 mb-4">Backup Content</h3>
                    <div className="space-y-3">
                      <ToggleSwitch
                        enabled={backupSettings.includeDocuments}
                        onChange={(enabled) => setBackupSettings({...backupSettings, includeDocuments: enabled})}
                        label="Include Documents"
                        description="Backup uploaded documents and files"
                      />
                      <ToggleSwitch
                        enabled={backupSettings.includeReports}
                        onChange={(enabled) => setBackupSettings({...backupSettings, includeReports: enabled})}
                        label="Include Reports"
                        description="Backup generated reports and analytics"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-md font-semibold text-gray-900 mb-4">Data Management</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Create Manual Backup</h4>
                          <p className="text-sm text-gray-500">Generate a backup of all current data</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                          Create Backup
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Export Data</h4>
                          <p className="text-sm text-gray-500">Download all data in CSV format</p>
                        </div>
                        <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200">
                          Export Data
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                        <div>
                          <h4 className="text-sm font-medium text-red-900 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Danger Zone
                          </h4>
                          <p className="text-sm text-red-700">Permanently delete all data (cannot be undone)</p>
                        </div>
                        <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200">
                          Delete All Data
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSaveBackup}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Backup Settings</span>
                    </button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};