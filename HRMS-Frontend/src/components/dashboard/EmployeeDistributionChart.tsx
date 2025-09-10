import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Mock data for demonstration - Updated with more realistic data
const mockDepartments = [
  { name: 'Engineering', employeeCount: 45 },
  { name: 'Marketing', employeeCount: 23 },
  { name: 'Human Resources', employeeCount: 15 },
  { name: 'Finance', employeeCount: 18 },
  { name: 'Sales', employeeCount: 34 },
  { name: 'Design', employeeCount: 19 }
];

// Vibrant modern color palette
const COLORS = [
  '#FF6B6B', // Coral Red
  '#4ECDC4', // Turquoise
  '#45B7D1', // Sky Blue
  '#96CEB4', // Mint Green
  '#FFEAA7', // Warm Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Seafoam
  '#F7DC6F', // Light Gold
];

// Minimalist custom tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium shadow-xl z-50">
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: data.color }}
          />
          {data.name}: {data.value}
        </div>
      </div>
    );
  }
  return null;
};

// Clean legend design with employee counts
const CustomLegend = ({ payload }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center justify-between gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div 
              className="w-4 h-4 rounded-sm shadow-sm flex-shrink-0" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-700 font-medium truncate">{entry.value}</span>
          </div>
          <span className="text-gray-900 font-semibold flex-shrink-0">{entry.count}</span>
        </div>
      ))}
    </div>
  );
};

export const EmployeeDistributionChart: React.FC = () => {
  const totalEmployees = mockDepartments.reduce((sum, dept) => sum + dept.employeeCount, 0);
  
  const chartData = mockDepartments.map((dept, index) => ({
    name: dept.name,
    value: dept.employeeCount,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="h-[490px] bg-white rounded-2xl shadow-2xl overflow-hidden max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-indigo-700">Team Distribution</h2>
          <div className="text-xl sm:text-2xl font-bold text-indigo-700">
            {totalEmployees}
            <span className="text-base sm:text-lg font-normal opacity-80 ml-2">people</span>
          </div>
        </div>
      </div>
    
      <div className="p-4 sm:p-6">
        {/* Mobile Layout - Stack vertically */}
        <div className="block lg:hidden">
          {/* Chart for mobile */}
          <div className="mb-6">
            <div className="w-full relative bg-gray-50 rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`mobile-cell-${index}`} 
                        fill={entry.color}
                        style={{ 
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center content for mobile */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-1 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-gray-100">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="text-xs text-gray-500 font-medium">Staff</div>
                </div>
              </div>
            </div>
          </div>

          {/* Debug info - remove in production */}
          <div className="text-xs text-gray-500 mb-2">
            Chart Data: {chartData.length} departments, Total: {totalEmployees}
          </div>

          {/* Legend for mobile */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Departments</h3>
            <CustomLegend payload={chartData.map(item => ({ 
              value: item.name, 
              color: item.color,
              count: item.value
            }))} />
            
            {/* Stats summary for mobile */}
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-3">Quick Stats</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Largest Dept:</span>
                  <span className="font-medium text-gray-900">
                    {chartData.reduce((max, dept) => dept.value > max.value ? dept : max).name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Departments:</span>
                  <span className="font-medium text-gray-900">{chartData.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg per Dept:</span>
                  <span className="font-medium text-gray-900">{Math.round(totalEmployees / chartData.length)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Side by side */}
        <div className="hidden lg:flex lg:items-start lg:gap-8">
          {/* Chart for desktop */}
          <div className="flex-1">
            <div className="h-96 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={140}
                    innerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        className="hover:brightness-110 transition-all duration-300 cursor-pointer"
                        style={{ 
                          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.1))',
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center content for desktop */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center shadow-inner">
                    <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-500 font-medium">Total Staff</div>
                </div>
              </div>
            </div>
          </div>

          {/* Legend for desktop */}
          <div className="flex-shrink-0 w-80">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Departments</h3>
            <CustomLegend payload={chartData.map(item => ({ 
              value: item.name, 
              color: item.color,
              count: item.value
            }))} />
            
            {/* Stats summary for desktop */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-3">Quick Stats</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Largest Dept:</span>
                  <span className="font-medium text-gray-900">
                    {chartData.reduce((max, dept) => dept.value > max.value ? dept : max).name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Departments:</span>
                  <span className="font-medium text-gray-900">{chartData.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg per Dept:</span>
                  <span className="font-medium text-gray-900">{Math.round(totalEmployees / chartData.length)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}