import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { EmployeesPage } from './components/pages/EmployeesPage';
import { TimeTrackingPage } from './components/pages/TimeTrackingPage';
import { ReportsPage } from './components/pages/ReportsPage';
import { PerformancePage } from './components/pages/PerformancePage';
import { DepartmentsPage } from './components/pages/DepartmentsPage';
import { DocumentsPage } from './components/pages/DocumentsPage';
import { AttendancePage } from './components/pages/AttendancePages';
import {LeaveManagementPage} from './components/pages/LeavemanagementPage'; 
import { PayrollPage } from './components/pages/PayrollPage';
import { SettingsPage } from './components/pages/SettingsPage';
import LoginPage from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';

const MainApp: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('Dashboard');
  const [showSignup, setShowSignup] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <DashboardPage />;
      case 'Employees':
        return <EmployeesPage />;
      case 'Attendance':
        return <AttendancePage />;
      case 'Leave Management':
        return <LeaveManagementPage />;
      case 'Payroll':
        return <PayrollPage />;
      case 'Time Tracking':
        return <TimeTrackingPage />;
      case 'Reports':
        return <ReportsPage />;
      case 'Performance':
        return <PerformancePage />;
      case 'Departments':
        return <DepartmentsPage />;
      case 'Documents':
        return <DocumentsPage />;
      case 'Settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (showSignup) {
      return (
        <SignupPage 
          onBackToLogin={() => setShowSignup(false)}
        />
      );
    }
    
    return (
      <LoginPage 
        onLoginSuccess={() => {
          // Login success is handled by the AuthContext
          setActivePage('Dashboard');
        }}
        onShowSignup={() => setShowSignup(true)}
      />
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setActivePage={setActivePage} activePage={activePage} />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Topbar onMenuToggle={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;