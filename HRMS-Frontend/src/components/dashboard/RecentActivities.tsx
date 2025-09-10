import React from 'react';
import { Card } from '../ui/Card';

export const RecentActivities: React.FC = () => {
  const activities = [
    { id: 1, text: 'Sarah Johnson submitted a leave request.', time: '2 hours ago' },
    { id: 2, text: 'New employee Michael Davis onboarded.', time: 'yesterday' },
    { id: 3, text: 'Performance review for Emily White is due.', time: '3 days ago' },
    { id: 4, text: 'Team meeting scheduled for Marketing Department.', time: 'last week' },
  ];

  return (
    <Card>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
      <ul className="space-y-3">
        {activities.map(activity => (
          <li key={activity.id} className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {/* You could use a dynamic icon based on activity type */}
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.text}</p>
              <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};