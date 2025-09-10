import React from 'react';
import { Search, Bell, Menu, Settings, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface TopbarProps {
  onMenuToggle: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6">
      {/* Left side */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden transition-colors duration-200"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, {user?.name || 'User'}!</p>
        </div>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search employees, departments..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Settings */}
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
          <Settings className="w-5 h-5" />
        </button>

        {/* User Menu */}
        <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
          <img
            src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=40"
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
                {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="p-2 text-gray-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors duration-200"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};