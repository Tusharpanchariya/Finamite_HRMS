import React from 'react';
import { Card } from '../ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { extendedMockLeaveRequests } from '../../data/mockData';

export const LeaveTrendsChart: React.FC = () => {
  // Aggregate leave requests by month
  const aggregateLeaveData = () => {
    const monthlyData: { [key: string]: { total: number; approved: number; pending: number; rejected: number } } = {};
    
    extendedMockLeaveRequests.forEach(request => {
      const month = new Date(request.startDate).toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!monthlyData[month]) {
        monthlyData[month] = { total: 0, approved: 0, pending: 0, rejected: 0 };
      }
      monthlyData[month].total += request.days;
      if (request.status === 'approved') monthlyData[month].approved += request.days;
      if (request.status === 'pending') monthlyData[month].pending += request.days;
      if (request.status === 'rejected') monthlyData[month].rejected += request.days;
    });
    
    return Object.keys(monthlyData).map(month => ({
      name: month,
      ...monthlyData[month]
    })).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  };

  const chartData = aggregateLeaveData();

  // Custom tooltip component with mobile optimization
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/98 backdrop-blur-md border border-gray-200/60 rounded-2xl shadow-2xl p-3 sm:p-4 min-w-[180px] sm:min-w-[220px] max-w-[280px]">
          <p className="font-bold text-gray-900 mb-2 text-sm sm:text-base border-b border-gray-100 pb-2">{`${label}`}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mr-2 shadow-sm" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-xs sm:text-sm text-gray-700 font-medium">{entry.name}</span>
                </div>
                <span className="font-bold text-gray-900 ml-3 text-xs sm:text-sm">{entry.value} days</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom legend component with mobile optimization
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-4 px-2">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center group cursor-pointer">
            <div 
              className="w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2 shadow-md transition-transform group-hover:scale-110" 
              style={{ 
                backgroundColor: entry.color,
                boxShadow: `0 2px 8px ${entry.color}40`
              }}
            />
            <span className="text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 border border-gray-200/40 shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg mr-3">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                Leave Trends
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Monthly analytics & patterns</p>
          </div>
          
          {/* Stats Cards - Mobile Optimized */}
          <div className="flex justify-center sm:justify-end">
            <div className="grid grid-cols-2 gap-2 sm:flex sm:space-x-2 sm:gap-0">
              <div className="bg-white/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200/50 shadow-sm">
                <div className="text-xs text-gray-500 font-medium">Total</div>
                <div className="text-sm sm:text-base font-bold text-indigo-600">
                  {chartData.reduce((sum, month) => sum + month.total, 0)}
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200/50 shadow-sm">
                <div className="text-xs text-gray-500 font-medium">Approved</div>
                <div className="text-sm sm:text-base font-bold text-emerald-600">
                  {chartData.reduce((sum, month) => sum + month.approved, 0)}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chart Container */}
        <div className="relative">
          <div 
            className="h-[280px] sm:h-[408px] p-3 sm:p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-inner"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)'
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ 
                  top: 20, 
                  right: window.innerWidth < 640 ? 10 : 30, 
                  left: window.innerWidth < 640 ? 10 : 20, 
                  bottom: 20 
                }}
              >
                <defs>
                  {/* Enhanced gradients */}
                  <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="50%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="approvedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="50%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="pendingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="rejectedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="50%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                
                <CartesianGrid 
                  strokeDasharray="2 4" 
                  stroke="#e2e8f0" 
                  strokeOpacity={0.6}
                  vertical={false}
                />
                
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ 
                    fontSize: window.innerWidth < 640 ? 10 : 12, 
                    fill: '#64748b', 
                    fontWeight: 600 
                  }}
                  dy={10}
                  interval={window.innerWidth < 640 ? 1 : 0}
                  angle={window.innerWidth < 640 ? -45 : 0}
                  textAnchor={window.innerWidth < 640 ? 'end' : 'middle'}
                />
                
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ 
                    fontSize: window.innerWidth < 640 ? 10 : 12, 
                    fill: '#64748b', 
                    fontWeight: 600 
                  }}
                  dx={-10}
                  width={window.innerWidth < 640 ? 30 : 40}
                />
                
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
                
                {/* Enhanced line styles */}
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#6366f1" 
                  strokeWidth={window.innerWidth < 640 ? 2.5 : 3}
                  name="Total"
                  dot={{ fill: '#6366f1', strokeWidth: 0, r: window.innerWidth < 640 ? 4 : 5, filter: 'drop-shadow(0 2px 4px rgba(99, 102, 241, 0.3))' }}
                  activeDot={{ r: window.innerWidth < 640 ? 6 : 8, stroke: '#6366f1', strokeWidth: 3, fill: 'white', filter: 'drop-shadow(0 4px 8px rgba(99, 102, 241, 0.4))' }}
                />
                
                <Line 
                  type="monotone" 
                  dataKey="approved" 
                  stroke="#10b981" 
                  strokeWidth={window.innerWidth < 640 ? 2.5 : 3}
                  name="Approved"
                  dot={{ fill: '#10b981', strokeWidth: 0, r: window.innerWidth < 640 ? 4 : 5, filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))' }}
                  activeDot={{ r: window.innerWidth < 640 ? 6 : 8, stroke: '#10b981', strokeWidth: 3, fill: 'white', filter: 'drop-shadow(0 4px 8px rgba(16, 185, 129, 0.4))' }}
                />
                
                <Line 
                  type="monotone" 
                  dataKey="pending" 
                  stroke="#f59e0b" 
                  strokeWidth={window.innerWidth < 640 ? 2.5 : 3}
                  name="Pending"
                  dot={{ fill: '#f59e0b', strokeWidth: 0, r: window.innerWidth < 640 ? 4 : 5, filter: 'drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3))' }}
                  activeDot={{ r: window.innerWidth < 640 ? 6 : 8, stroke: '#f59e0b', strokeWidth: 3, fill: 'white', filter: 'drop-shadow(0 4px 8px rgba(245, 158, 11, 0.4))' }}
                />
                
                <Line 
                  type="monotone" 
                  dataKey="rejected" 
                  stroke="#ef4444" 
                  strokeWidth={window.innerWidth < 640 ? 2.5 : 3}
                  name="Rejected"
                  dot={{ fill: '#ef4444', strokeWidth: 0, r: window.innerWidth < 640 ? 4 : 5, filter: 'drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3))' }}
                  activeDot={{ r: window.innerWidth < 640 ? 6 : 8, stroke: '#ef4444', strokeWidth: 3, fill: 'white', filter: 'drop-shadow(0 4px 8px rgba(239, 68, 68, 0.4))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Mobile-specific chart overlay for better interaction */}
          {window.innerWidth < 640 && (
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-gray-600 border border-gray-200/60">
              Tap data points for details
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};