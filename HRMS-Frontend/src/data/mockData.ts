import { 
  Employee, 
  LeaveRequest, 
  DashboardStats, 
  Department, 
  AttendanceRecord, 
  TimeEntry, 
  PerformanceReview, 
  Document, 
  ReportData 
} from '../types';

export const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    position: 'Senior Developer',
    department: 'Engineering',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 123-4567',
    joinDate: '2022-03-15',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    salary: 95000
  },
  {
    id: '2',
    name: 'Michael Chen',
    position: 'Marketing Manager',
    department: 'Marketing',
    email: 'michael.chen@company.com',
    phone: '+1 (555) 234-5678',
    joinDate: '2021-08-22',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    salary: 78000
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    position: 'HR Specialist',
    department: 'Human Resources',
    email: 'emily.rodriguez@company.com',
    phone: '+1 (555) 345-6789',
    joinDate: '2023-01-10',
    status: 'on-leave',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    salary: 65000
  },
  {
    id: '4',
    name: 'David Wilson',
    position: 'UX Designer',
    department: 'Design',
    email: 'david.wilson@company.com',
    phone: '+1 (555) 456-7890',
    joinDate: '2022-11-05',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100',
    salary: 72000
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    position: 'Finance Director',
    department: 'Finance',
    email: 'lisa.thompson@company.com',
    phone: '+1 (555) 567-8901',
    joinDate: '2020-06-18',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=100',
    salary: 110000
  },
  {
    id: '6',
    name: 'James Anderson',
    position: 'Sales Representative',
    department: 'Sales',
    email: 'james.anderson@company.com',
    phone: '+1 (555) 678-9012',
    joinDate: '2023-04-12',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=100',
    salary: 58000
  }
];

// Extended employee list for better demonstration
export const extendedMockEmployees: Employee[] = [
  ...mockEmployees,
  {
    id: '7',
    name: 'Rachel Green',
    position: 'Product Manager',
    department: 'Product',
    email: 'rachel.green@company.com',
    phone: '+1 (555) 789-0123',
    joinDate: '2021-12-08',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100',
    salary: 85000
  },
  {
    id: '8',
    name: 'Kevin Martinez',
    position: 'DevOps Engineer',
    department: 'Engineering',
    email: 'kevin.martinez@company.com',
    phone: '+1 (555) 890-1234',
    joinDate: '2022-07-15',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
    salary: 92000
  },
  {
    id: '9',
    name: 'Amanda Foster',
    position: 'Content Writer',
    department: 'Marketing',
    email: 'amanda.foster@company.com',
    phone: '+1 (555) 901-2345',
    joinDate: '2023-02-20',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100',
    salary: 55000
  },
  {
    id: '10',
    name: 'Robert Kim',
    position: 'Data Analyst',
    department: 'Analytics',
    email: 'robert.kim@company.com',
    phone: '+1 (555) 012-3456',
    joinDate: '2022-09-12',
    status: 'inactive',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100',
    salary: 68000
  }
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeName: 'Sarah Johnson',
    employeeId: '1',
    leaveType: 'Annual Leave',
    startDate: '2024-01-15',
    endDate: '2024-01-19',
    days: 5,
    status: 'pending',
    leaveReason: 'Vacation with family'
  },
  {
    id: '2',
    employeeName: 'Michael Chen',
    employeeId: '2',
    leaveType: 'SICk',
    startDate: '2024-01-10',
    endDate: '2024-01-12',
    days: 3,
    status: 'approved',
    leaveReason: 'Medical appointment'
  },
  {
    id: '3',
    employeeName: 'Emily Rodriguez',
    employeeId: '3',
    leaveType: 'MATERNITY',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    days: 90,
    status: 'approved',
    leaveReason: 'MATERNITY'
  },
  {
    id: '4',
    employeeName: 'David Wilson',
    employeeId: '4',
    leaveType: 'Annual Leave',
    startDate: '2024-01-20',
    endDate: '2024-01-22',
    days: 3,
    status: 'rejected',
    leaveReason: 'Personal matters'
  }
];

// Extended leave requests
export const extendedMockLeaveRequests: LeaveRequest[] = [
  ...mockLeaveRequests,
  {
    id: '5',
    employeeName: 'Rachel Green',
    employeeId: '7',
    leaveType: 'Annual Leave',
    startDate: '2024-02-05',
    endDate: '2024-02-09',
    days: 5,
    status: 'pending',
    leaveReason: 'Family vacation'
  },
  {
    id: '6',
    employeeName: 'Kevin Martinez',
    employeeId: '8',
    leaveType: 'PATERNITY',
    startDate: '2024-01-25',
    endDate: '2024-01-26',
    days: 2,
    status: 'approved',
    leaveReason: 'Moving to new apartment'
  },
  {
    id: '7',
    employeeName: 'Amanda Foster',
    employeeId: '9',
    leaveType: 'SICk',
    startDate: '2024-01-18',
    endDate: '2024-01-19',
    days: 2,
    status: 'approved',
    leaveReason: 'Flu symptoms'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalEmployees: 248,
  activeEmployees: 231,
  onLeaveToday: 12,
  pendingRequests: 8,
  newHires: 15,
  totalDepartments: 12
};

export const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Engineering',
    manager: 'Sarah Johnson',
    employeeCount: 45,
    budget: 2500000,
    description: 'Software development and technical infrastructure',
    location: 'Building A, Floor 3',
    established: '2018-01-15'
  },
  {
    id: '2',
    name: 'Marketing',
    manager: 'Michael Chen',
    employeeCount: 28,
    budget: 1200000,
    description: 'Brand management, digital marketing, and customer acquisition',
    location: 'Building B, Floor 2',
    established: '2018-03-20'
  },
  {
    id: '3',
    name: 'Human Resources',
    manager: 'Emily Rodriguez',
    employeeCount: 12,
    budget: 800000,
    description: 'Talent acquisition, employee relations, and organizational development',
    location: 'Building A, Floor 1',
    established: '2018-01-10'
  },
  {
    id: '4',
    name: 'Finance',
    manager: 'Lisa Thompson',
    employeeCount: 18,
    budget: 950000,
    description: 'Financial planning, accounting, and budget management',
    location: 'Building A, Floor 2',
    established: '2018-02-01'
  },
  {
    id: '5',
    name: 'Sales',
    manager: 'James Anderson',
    employeeCount: 35,
    budget: 1800000,
    description: 'Revenue generation, client relationships, and business development',
    location: 'Building B, Floor 1',
    established: '2018-04-10'
  },
  {
    id: '6',
    name: 'Design',
    manager: 'David Wilson',
    employeeCount: 15,
    budget: 750000,
    description: 'User experience, visual design, and product design',
    location: 'Building A, Floor 4',
    established: '2019-06-15'
  }
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Sarah Johnson',
    date: '2024-01-15',
    checkIn: '09:00',
    checkOut: '17:30',
    hoursWorked: 8.5,
    status: 'present',
    overtime: 0.5
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Michael Chen',
    date: '2024-01-15',
    checkIn: '08:45',
    checkOut: '17:15',
    hoursWorked: 8.5,
    status: 'present',
    overtime: 0.5
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Emily Rodriguez',
    date: '2024-01-15',
    checkIn: '',
    checkOut: '',
    hoursWorked: 0,
    status: 'absent',
    overtime: 0
  },
  {
    id: '4',
    employeeId: '4',
    employeeName: 'David Wilson',
    date: '2024-01-15',
    checkIn: '09:15',
    checkOut: '17:00',
    hoursWorked: 7.75,
    status: 'late',
    overtime: 0
  },
  {
    id: '5',
    employeeId: '5',
    employeeName: 'Lisa Thompson',
    date: '2024-01-15',
    checkIn: '09:00',
    checkOut: '13:00',
    hoursWorked: 4,
    status: 'half-day',
    overtime: 0
  }
];

export const mockTimeEntries: TimeEntry[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Sarah Johnson',
    project: 'E-commerce Platform',
    task: 'Frontend Development',
    date: '2024-01-15',
    startTime: '09:00',
    endTime: '12:00',
    duration: 3,
    description: 'Implemented shopping cart functionality',
    billable: true
  },
  {
    id: '2',
    employeeId: '1',
    employeeName: 'Sarah Johnson',
    project: 'Mobile App',
    task: 'Bug Fixes',
    date: '2024-01-15',
    startTime: '13:00',
    endTime: '17:00',
    duration: 4,
    description: 'Fixed login authentication issues',
    billable: true
  },
  {
    id: '3',
    employeeId: '2',
    employeeName: 'Michael Chen',
    project: 'Marketing Campaign',
    task: 'Content Creation',
    date: '2024-01-15',
    startTime: '09:00',
    endTime: '11:30',
    duration: 2.5,
    description: 'Created social media content for Q1 campaign',
    billable: false
  },
  {
    id: '4',
    employeeId: '4',
    employeeName: 'David Wilson',
    project: 'Website Redesign',
    task: 'UI Design',
    date: '2024-01-15',
    startTime: '10:00',
    endTime: '16:00',
    duration: 6,
    description: 'Designed new homepage layout and components',
    billable: true
  }
];

export const mockPerformanceReviews: PerformanceReview[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Sarah Johnson',
    reviewPeriod: 'Q4 2023',
    reviewer: 'John Smith',
    overallRating: 4.5,
    goals: [
      'Lead frontend architecture migration',
      'Mentor junior developers',
      'Improve code review process'
    ],
    achievements: [
      'Successfully migrated legacy codebase to React',
      'Reduced page load times by 40%',
      'Mentored 3 junior developers'
    ],
    areasForImprovement: [
      'Public speaking and presentation skills',
      'Cross-team collaboration'
    ],
    nextReviewDate: '2024-04-15',
    status: 'completed'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Michael Chen',
    reviewPeriod: 'Q4 2023',
    reviewer: 'Jane Doe',
    overallRating: 4.2,
    goals: [
      'Increase social media engagement by 25%',
      'Launch new product campaign',
      'Develop marketing automation workflows'
    ],
    achievements: [
      'Achieved 30% increase in social media engagement',
      'Successfully launched Q4 product campaign',
      'Implemented automated email sequences'
    ],
    areasForImprovement: [
      'Data analysis and reporting',
      'Budget management'
    ],
    nextReviewDate: '2024-04-20',
    status: 'completed'
  },
  {
    id: '3',
    employeeId: '4',
    employeeName: 'David Wilson',
    reviewPeriod: 'Q1 2024',
    reviewer: 'Sarah Johnson',
    overallRating: 0,
    goals: [
      'Complete design system documentation',
      'Improve user research processes',
      'Lead accessibility improvements'
    ],
    achievements: [],
    areasForImprovement: [],
    nextReviewDate: '2024-04-30',
    status: 'pending'
  }
];

export const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Employee Handbook 2024',
    type: 'handbook',
    category: 'HR Policies',
    uploadDate: '2024-01-01',
    size: '2.4 MB',
    uploadedBy: 'Emily Rodriguez',
    description: 'Complete guide to company policies, procedures, and benefits',
    isPublic: true
  },
  {
    id: '2',
    name: 'Remote Work Policy',
    type: 'policy',
    category: 'HR Policies',
    uploadDate: '2023-12-15',
    size: '856 KB',
    uploadedBy: 'Emily Rodriguez',
    description: 'Guidelines and requirements for remote work arrangements',
    isPublic: true
  },
  {
    id: '3',
    name: 'Sarah Johnson - Employment Contract',
    type: 'contract',
    category: 'Contracts',
    uploadDate: '2022-03-10',
    size: '1.2 MB',
    uploadedBy: 'HR System',
    description: 'Employment agreement and terms of service',
    isPublic: false
  },
  {
    id: '4',
    name: 'Leave Request Form',
    type: 'form',
    category: 'Forms',
    uploadDate: '2023-11-20',
    size: '245 KB',
    uploadedBy: 'Emily Rodriguez',
    description: 'Standard form for requesting time off',
    isPublic: true
  },
  {
    id: '5',
    name: 'Safety Training Certificate - Michael Chen',
    type: 'certificate',
    category: 'Training',
    uploadDate: '2023-10-05',
    size: '512 KB',
    uploadedBy: 'Training Department',
    description: 'Workplace safety training completion certificate',
    isPublic: false
  },
  {
    id: '6',
    name: 'Code of Conduct',
    type: 'policy',
    category: 'HR Policies',
    uploadDate: '2023-09-01',
    size: '1.8 MB',
    uploadedBy: 'Legal Department',
    description: 'Company code of conduct and ethical guidelines',
    isPublic: true
  }
];

export const mockReports: ReportData[] = [
  {
    id: '1',
    title: 'Monthly Attendance Report - January 2024',
    type: 'attendance',
    generatedDate: '2024-01-31',
    generatedBy: 'HR System',
    period: 'January 2024',
    status: 'ready',
    downloadUrl: '/reports/attendance-jan-2024.pdf'
  },
  {
    id: '2',
    title: 'Q4 2023 Performance Summary',
    type: 'performance',
    generatedDate: '2024-01-15',
    generatedBy: 'Emily Rodriguez',
    period: 'Q4 2023',
    status: 'ready',
    downloadUrl: '/reports/performance-q4-2023.pdf'
  },
  {
    id: '3',
    title: 'Payroll Report - January 2024',
    type: 'payroll',
    generatedDate: '2024-01-30',
    generatedBy: 'Lisa Thompson',
    period: 'January 2024',
    status: 'generating'
  },
  {
    id: '4',
    title: 'Leave Analysis Report - 2023',
    type: 'leave',
    generatedDate: '2024-01-10',
    generatedBy: 'HR System',
    period: '2023',
    status: 'ready',
    downloadUrl: '/reports/leave-analysis-2023.pdf'
  },
  {
    id: '5',
    title: 'Recruitment Metrics - Q1 2024',
    type: 'recruitment',
    generatedDate: '2024-02-01',
    generatedBy: 'Emily Rodriguez',
    period: 'Q1 2024',
    status: 'scheduled'
  }
];