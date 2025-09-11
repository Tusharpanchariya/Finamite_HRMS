import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Building2,
  BarChart3,
  PieChart,
  Activity,
  Award,
  IndianRupee ,
  UserPlus,
  Filter,
  Download,
  Bell,
  Settings,
  Search,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RePieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Mock data for charts
const monthlyData = [
  { month: 'Jan', employees: 245, newHires: 12, departures: 5 },
  { month: 'Feb', employees: 252, newHires: 15, departures: 8 },
  { month: 'Mar', employees: 267, newHires: 18, departures: 3 },
  { month: 'Apr', employees: 275, newHires: 14, departures: 6 },
  { month: 'May', employees: 281, newHires: 16, departures: 10 },
  { month: 'Jun', employees: 287, newHires: 13, departures: 7 },
];

const departmentData = [
  { name: 'Engineering', value: 89, color: '#3B82F6' },
  { name: 'Sales', value: 67, color: '#10B981' },
  { name: 'Marketing', value: 45, color: '#F59E0B' },
  { name: 'HR', value: 23, color: '#EF4444' },
  { name: 'Finance', value: 34, color: '#8B5CF6' },
  { name: 'Operations', value: 29, color: '#06B6D4' },
];

const leaveTypeData = [
  { type: 'Vacation', count: 34, percentage: 45 },
  { type: 'Sick', count: 18, percentage: 24 },
  { type: 'Personal', count: 12, percentage: 16 },
  { type: 'Maternity', count: 8, percentage: 11 },
  { type: 'Other', count: 3, percentage: 4 },
];

const performanceData = [
  { month: 'Jan', rating: 4.2 },
  { month: 'Feb', rating: 4.3 },
  { month: 'Mar', rating: 4.1 },
  { month: 'Apr', rating: 4.4 },
  { month: 'May', rating: 4.5 },
  { month: 'Jun', rating: 4.3 },
];

const StatCard = ({ title, value, change, changeType, icon: Icon, trend, gradient }) => (
  <div className={`relative overflow-hidden rounded-2xl ${gradient} p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${changeType === 'positive' ? 'text-green-200' : 'text-red-200'}`}>
            {changeType === 'positive' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span className="text-sm font-medium">{trend}</span>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-white/80">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm text-white/70">{change}</p>
      </div>
    </div>
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
  </div>
);

const ChartCard = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 ${className}`}>
    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
      {title}
    </h3>
    {children}
  </div>
);

const EmployeeCard = ({ employee }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
    <div className="flex items-center space-x-3">
      <img
        src={employee.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`}
        alt={employee.name}
        className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100"
      />
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{employee.name}</h4>
        <p className="text-sm text-gray-600">{employee.position}</p>
        <div className="flex items-center space-x-2 mt-1">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            employee.status === 'active' ? 'bg-green-100 text-green-800' :
            employee.status === 'on-leave' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {employee.status.replace('-', ' ').toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const QuickAction = ({ icon: Icon, label, color }) => (
  <button className={`flex items-center space-x-3 w-full p-4 rounded-xl ${color} text-white hover:opacity-90 transition-opacity duration-200`}>
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
);

export default function EnhancedHRDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('6M');

  const mockEmployees = [
    { id: 1, name: 'Sarah Johnson', position: 'Senior Developer', status: 'active', avatar: null },
    { id: 2, name: 'Mike Chen', position: 'Product Manager', status: 'on-leave', avatar: null },
    { id: 3, name: 'Emily Davis', position: 'UX Designer', status: 'active', avatar: null },
    { id: 4, name: 'James Wilson', position: 'Data Analyst', status: 'active', avatar: null },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">HR Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's what's happening with your team.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <StatCard
            title="Total Employees"
            value="287"
            change="↑12% from last month"
            changeType="positive"
            icon={Users}
            trend="+12%"
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            title="Active Today"
            value="267"
            change="93% attendance rate"
            changeType="positive"
            icon={UserCheck}
            trend="+2%"
            gradient="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard
            title="On Leave"
            value="20"
            change="5 less than yesterday"
            changeType="positive"
            icon={Calendar}
            trend="-5"
            gradient="bg-gradient-to-br from-amber-500 to-orange-500"
          />
          <StatCard
            title="Pending Requests"
            value="12"
            change="3 new today"
            changeType="neutral"
            icon={Clock}
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <StatCard
            title="Avg Performance"
            value="4.3"
            change="↑0.2 from last month"
            changeType="positive"
            icon={Award}
            trend="+0.2"
            gradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
          />
          <StatCard
            title="Payroll Cost"
            value="$1.2M"
            change="Monthly budget"
            changeType="neutral"
            icon={IndianRupee }
            gradient="bg-gradient-to-br from-teal-500 to-teal-600"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
          {/* Employee Growth Chart */}
          <ChartCard title="📈 Employee Growth Trend" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="employees" 
                  stroke="#3B82F6" 
                  fill="url(#colorEmployees)" 
                  strokeWidth={3}
                />
                <defs>
                  <linearGradient id="colorEmployees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Department Distribution */}
          <ChartCard title="🏢 Department Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Hiring vs Departures */}
          <ChartCard title="📊 Hiring vs Departures">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px' 
                  }} 
                />
                <Bar dataKey="newHires" fill="#10B981" radius={4} />
                <Bar dataKey="departures" fill="#EF4444" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Performance Trend */}
          <ChartCard title="⭐ Average Performance Rating">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis domain={[3.5, 5]} stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px' 
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="rating" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Leave Types */}
          <ChartCard title="🏖️ Leave Types Breakdown">
            <div className="space-y-4">
              {leaveTypeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: departmentData[index]?.color || '#6B7280' }}></div>
                    <span className="text-sm font-medium text-gray-700">{item.type}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                    <span className="text-xs text-gray-500 ml-2">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Employees */}
          <div className="lg:col-span-2">
            <ChartCard title="👥 Recent Team Members">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockEmployees.map((employee) => (
                  <EmployeeCard key={employee.id} employee={employee} />
                ))}
              </div>
              <div className="mt-6 flex justify-center">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>View All Employees</span>
                </button>
              </div>
            </ChartCard>
          </div>

          {/* Quick Actions */}
          <ChartCard title="⚡ Quick Actions">
            <div className="space-y-3">
              <QuickAction icon={UserPlus} label="Add New Employee" color="bg-gradient-to-r from-blue-500 to-blue-600" />
              <QuickAction icon={Calendar} label="Schedule Interview" color="bg-gradient-to-r from-green-500 to-green-600" />
              <QuickAction icon={BarChart3} label="Generate Report" color="bg-gradient-to-r from-purple-500 to-purple-600" />
              <QuickAction icon={Award} label="Performance Review" color="bg-gradient-to-r from-indigo-500 to-indigo-600" />
              <QuickAction icon={Download} label="Export Data" color="bg-gradient-to-r from-gray-500 to-gray-600" />
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}