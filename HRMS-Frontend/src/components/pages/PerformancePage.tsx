import React from 'react';
import { Star, TrendingUp, Target, Award, Calendar, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Table } from '../ui/Table';
import { mockPerformanceReviews } from '../../data/mockData';

export const PerformancePage: React.FC = () => {
  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-900">{rating}/5</span>
      </div>
    );
  };

  const getstatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      draft: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const columns = [
    {
      key: 'employee',
      label: 'Employee',
      render: (_: any, row: any) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">
              {row.employeeName.split(' ').map((n: string) => n[0]).join('')}
            </span>
          </div>
          <span className="font-medium text-gray-900">{row.employeeName}</span>
        </div>
      )
    },
    {
      key: 'reviewPeriod',
      label: 'Review Period'
    },
    {
      key: 'reviewer',
      label: 'Reviewer'
    },
    {
      key: 'overallRating',
      label: 'Rating',
      render: (value: number) => value > 0 ? getRatingStars(value) : '-'
    },
    {
      key: 'nextReviewDate',
      label: 'Next Review',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'status',
      label: 'status',
      render: (value: string) => getstatusBadge(value)
    }
  ];

  const completedReviews = mockPerformanceReviews.filter(r => r.status === 'completed').length;
  const pendingReviews = mockPerformanceReviews.filter(r => r.status === 'pending').length;
  const averageRating = mockPerformanceReviews
    .filter(r => r.overallRating > 0)
    .reduce((sum, r) => sum + r.overallRating, 0) / 
    mockPerformanceReviews.filter(r => r.overallRating > 0).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-15xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Performance Management</h1>
            <p className="text-gray-600">Track employee performance and conduct reviews</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
            <Plus className="w-4 h-4" />
            <span>New Review</span>
          </button>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completed Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{completedReviews}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{pendingReviews}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}/5</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">High Performers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockPerformanceReviews.filter(r => r.overallRating >= 4.5).length}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Performance Reviews Table */}
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Performance Reviews</h2>
              <p className="text-sm text-gray-500">Employee performance evaluation records</p>
            </div>
          </div>
          
          <Table columns={columns} data={mockPerformanceReviews} />
        </Card>

        {/* Performance Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {mockPerformanceReviews.filter(review => review.status === 'completed').map((review) => (
            <Card key={review.id}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{review.employeeName}</h3>
                  <p className="text-sm text-gray-500">{review.reviewPeriod} Review</p>
                </div>
                {getRatingStars(review.overallRating)}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Key Achievements</h4>
                  <ul className="space-y-1">
                    {review.achievements.map((achievement, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Areas for Improvement</h4>
                  <ul className="space-y-1">
                    {review.areasForImprovement.map((area, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Reviewer: {review.reviewer}</span>
                    <span className="text-gray-500">Next Review: {new Date(review.nextReviewDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};