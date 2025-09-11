import React from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
  BarChart3,
  UserCheck,
  Clock,
  Building2,
  IndianRupee ,
  Award
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setActivePage: (page: string) => void; // Add prop to set active page
  activePage: string; // Add prop to know the currently active page
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard' }, // Remove active: true, will be managed by state
  { icon: Users, label: 'Employees' },
  { icon: UserCheck, label: 'Attendance' },
  { icon: Calendar, label: 'Leave Management' },
  { icon: Clock, label: 'Time Tracking' },
  { icon: IndianRupee , label: 'Payroll' },
  { icon: BarChart3, label: 'Reports' },
  { icon: Award, label: 'Performance' },
  { icon: Building2, label: 'Departments' },
  { icon: FileText, label: 'Documents' },
  { icon: Settings, label: 'Settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setActivePage, activePage }) => {
  return (
    <div className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      lg:translate-x-0 lg:static lg:inset-0
    `}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">HR Dashboard</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href="#"
              onClick={(e) => { // Use onClick to prevent default and update state
                e.preventDefault();
                setActivePage(item.label);
              }}
              className={`
                flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                ${item.label === activePage // Check if this item's label matches the activePage state
                  ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <item.icon className={`w-5 h-5 mr-3 ${item.label === activePage ? 'text-blue-600' : 'text-gray-500'}`} />
              {item.label}
            </a>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
              <p className="text-xs text-gray-500 truncate">HR Manager</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};