import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TimeEntry {
  id: string;
  date: string;
  duration: number;
  task: string;
  project: string;
  billable: boolean;
}

interface WeeklyCalendarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  timeEntries: TimeEntry[];
  onDateSelect: (date: string) => void;
  selectedDate?: string;
}

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  currentDate,
  onDateChange,
  timeEntries,
  onDateSelect,
  selectedDate
}) => {
  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(currentDate);
  const today = new Date().toISOString().split('T')[0];

  const getDateEntries = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return timeEntries.filter(entry => entry.date === dateStr);
  };

  const getTotalHours = (date: Date) => {
    const entries = getDateEntries(date);
    return entries.reduce((total, entry) => total + entry.duration, 0);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    onDateChange(newDate);
  };

  const isToday = (date: Date) => {
    return date.toISOString().split('T')[0] === today;
  };

  const isSelected = (date: Date) => {
    return date.toISOString().split('T')[0] === selectedDate;
  };

  const canEdit = (date: Date) => {
    return date.toISOString().split('T')[0] >= today;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="flex items-center justify-between p-4 border-b">
        <button
          onClick={() => navigateWeek('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <h3 className="text-lg font-semibold text-gray-900">
          {weekDates[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        
        <button
          onClick={() => navigateWeek('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 border-b">
            {day}
          </div>
        ))}

        {weekDates.map((date, index) => {
          const entries = getDateEntries(date);
          const totalHours = getTotalHours(date);
          const dateStr = date.toISOString().split('T')[0];

          return (
            <div
              key={index}
              onClick={() => canEdit(date) && onDateSelect(dateStr)}
              className={`p-3 border-r border-b min-h-[120px] ${
                canEdit(date) ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed bg-gray-50'
              } ${isSelected(date) ? 'bg-blue-50 border-blue-200' : ''} ${
                isToday(date) ? 'bg-yellow-50' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${
                  isToday(date) ? 'text-blue-600' : canEdit(date) ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {date.getDate()}
                </span>
                {totalHours > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {totalHours}h
                  </span>
                )}
              </div>

              <div className="space-y-1">
                {entries.slice(0, 3).map((entry) => (
                  <div
                    key={entry.id}
                    className={`text-xs p-1 rounded ${
                      entry.billable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <div className="font-medium truncate">{entry.task}</div>
                    <div className="text-xs opacity-75">{entry.duration}h</div>
                  </div>
                ))}
                {entries.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{entries.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};