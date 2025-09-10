import React, { useState } from 'react';
import { Edit2, Trash2, Clock, DollarSign } from 'lucide-react';

interface TimeEntry {
  id: string;
  task: string;
  project: string;
  startTime: string;
  endTime: string;
  duration: number;
  description: string;
  billable: boolean;
  date: string;
}

interface TimeEntriesListProps {
  entries: TimeEntry[];
  onEdit: (entry: TimeEntry) => void;
  onDelete: (id: string) => void;
  selectedDate: string;
}

export const TimeEntriesList: React.FC<TimeEntriesListProps> = ({
  entries,
  onEdit,
  onDelete,
  selectedDate
}) => {
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  
  const today = new Date().toISOString().split('T')[0];
  const canEdit = selectedDate >= today;

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const filteredEntries = entries.filter(entry => entry.date === selectedDate);

  if (filteredEntries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No time entries</h3>
        <p className="text-gray-500">
          {canEdit ? 'Click "Add Time Entry" to get started' : 'No entries recorded for this date'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">
          Time Entries - {new Date(selectedDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {filteredEntries.length} entries • {formatDuration(filteredEntries.reduce((sum, entry) => sum + entry.duration, 0))} total
        </p>
      </div>

      <div className="divide-y">
        {filteredEntries.map((entry) => (
          <div key={entry.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium text-gray-900">{entry.task}</h4>
                  {entry.project && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {entry.project}
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    entry.billable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {entry.billable ? (
                      <><DollarSign className="w-3 h-3 inline mr-1" />BILLABLE</>
                    ) : (
                      'NON-BILLABLE'
                    )}
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {entry.startTime} - {entry.endTime}
                  </span>
                  <span className="font-medium text-blue-600">
                    {formatDuration(entry.duration)}
                  </span>
                </div>

                {entry.description && (
                  <div className="mt-2">
                    <button
                      onClick={() => setExpandedEntry(
                        expandedEntry === entry.id ? null : entry.id
                      )}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      {expandedEntry === entry.id ? 'Hide' : 'Show'} description
                    </button>
                    {expandedEntry === entry.id && (
                      <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {entry.description}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {canEdit && (
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => onEdit(entry)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(entry.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};