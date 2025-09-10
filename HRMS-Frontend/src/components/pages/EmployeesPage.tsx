import React, { useState, ReactNode } from 'react';
import { Search, Filter, Trash2, Mail, Phone, Plus, Info, X } from 'lucide-react';
import { AddEmployeeModal } from '../Modal/AddEmployeeModal';
import { EmployeeDetailsModal } from '../Modal/EmployeeDetailsModal';
import { employeeService } from '../../services/employee.service';
import { mapAPIToDisplayData } from '../../Utils/employeeMapper';
import { DisplayEmployee, EmployeeFilters } from '../../types/employee.types';

interface CardProps {
  children: ReactNode;
  className?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  employeeName?: string;
}

interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, row: DisplayEmployee) => React.ReactNode;
}

interface TableProps {
  columns: TableColumn[];
  data: DisplayEmployee[];
}

// Card Component
const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
    {children}
  </div>
);

// Modal Component (reused for ConfirmDeleteModal consistency)
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-out"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="flex h-screen items-center justify-center p-4">
        <div
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out scale-100 opacity-100"
          style={{
            animation: isOpen ? 'modalSlideIn 0.3s ease-out' : 'modalSlideOut 0.3s ease-in'
          }}
        >
          {children}
        </div>
      </div>
      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes modalSlideOut {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
        }
      `}</style>
    </div>
  );
};

// Confirm Delete Modal Component
const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, employeeName }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Confirm Deletion</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-700 mb-6">
          Are you sure you want to change the status of <span className="font-medium">{employeeName}</span> to 'Inactive'? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Confirm Inactive
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Table Component
const Table: React.FC<TableProps> = ({ columns, data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((row, index) => (
          <tr key={index} className="hover:bg-gray-50">
            {columns.map((column) => (
              <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                {column.render ? column.render((row as any)[column.key], row) : (row as any)[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Main Employees Page Component
export const EmployeesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<DisplayEmployee | null>(null);
  const [employees, setEmployees] = useState<DisplayEmployee[]>([]);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState<boolean>(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<DisplayEmployee | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load employees on component mount
  React.useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async (filters?: EmployeeFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use the combined method to get employees with statutory details
      const employeesWithStatutory = await employeeService.getAllEmployeesWithStatutoryDetails(filters);
      
      const displayEmployees = employeesWithStatutory.map(mapAPIToDisplayData);
      setEmployees(displayEmployees);
    } catch (error) {
      console.error('Failed to load employees:', error);
      setError(error instanceof Error ? error.message : 'Failed to load employees');
      setEmployees([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || employee.departmentName === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departments = [...new Set(employees.map(emp => emp.departmentName))];

  const handleAddEmployee = (newEmployee: DisplayEmployee) => {
    setEmployees(prev => [...prev, newEmployee]);
  };

  const handleUpdateEmployee = (updatedEmployee: DisplayEmployee) => {
    setEmployees(prev => 
      prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp)
    );
  };

  const handleViewDetails = (employee: DisplayEmployee) => {
    setSelectedEmployee(employee);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteClick = (employee: DisplayEmployee) => {
    setEmployeeToDelete(employee);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (employeeToDelete) {
      try {
        const response = await employeeService.updateEmployeestatus(
          Number(employeeToDelete.id), 
          'INACTIVE'
        );
        
        if (response.success) {
          setEmployees(prevEmployees =>
            prevEmployees.map(emp =>
              emp.id === employeeToDelete.id ? { ...emp, status: 'INACTIVE' as const } : emp
            )
          );
          console.log(`Employee ${employeeToDelete.fullName} status changed to Inactive.`);
        } else {
          throw new Error(response.message || 'Failed to update employee status');
        }
      } catch (error) {
        console.error('Failed to update employee status:', error);
        // You could show an error toast here
      } finally {
        setIsConfirmDeleteModalOpen(false);
        setEmployeeToDelete(null);
      }
    }
  };

  const getstatusBadge = (status: DisplayEmployee['status']) => {
    const styles: Record<DisplayEmployee['status'], string> = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
      'ON_LEAVE': 'bg-yellow-100 text-yellow-800'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const columns: TableColumn[] = [
    {
      key: 'employee',
      label: 'Employee',
      render: (_, row) => (
        <div className="flex items-center space-x-3">
          <img
            src={row.avatar}
            alt={row.fullName}
            className="w-10 h-10 rounded-full object-cover cursor-pointer" // Added cursor-pointer
            onClick={() => handleViewDetails(row)} // Added onClick to image
          />
          <div>
            <p className="font-medium text-gray-900">{row.fullName}</p>
          </div>
        </div>
      )
    },
    {
      key: 'designation',
      label: 'Position',
      render: (_, row) => (
        <div>
          <p className="font-medium text-gray-900">{row.designation}</p>
          <p className="text-sm text-gray-500">{row.departmentName}</p>
        </div>
      )
    },
    {
      key: 'contactNumber',
      label: 'Contact',
      render: (_, row) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{row.email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{row.contactNumber}</span>
          </div>
        </div>
      )
    },
    {
      key: 'joiningDate',
      label: 'Join Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'status',
      label: 'status',
      render: (value: DisplayEmployee['status']) => getstatusBadge(value)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewDetails(row)}
            className="p-1 text-indigo-600 hover:bg-indigo-50 rounded transition-colors duration-200"
            title="View Details"
          >
            <Info className="w-4 h-4" />
          </button>
          {/* Removed Edit button */}
          {/* <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200" title="Edit">
            <Edit className="w-4 h-4" />
          </button> */}
          <button
            onClick={() => handleDeleteClick(row)}
            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
            title="Change status to Inactive"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-15xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Employee Management</h1>
          <p className="text-gray-600">Manage your team members and their information</p>
        </div>

        {/* Filters and Actions */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full sm:w-64 transition-colors duration-200"
                />
              </div>
              {/* Department Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white transition-colors duration-200"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Add Employee Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          </div>
        </Card>

        {/* Employee Table */}
        <Card>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Employees ({isLoading ? '...' : filteredEmployees.length})
            </h2>
            <p className="text-sm text-gray-500">
              {searchTerm && `Showing results for "${searchTerm}"`}
              {filterDepartment !== 'all' && ` in ${filterDepartment}`}
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Loading employees...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-red-600 mb-2">Error loading employees</p>
                <p className="text-gray-500 text-sm mb-4">{error}</p>
                <button
                  onClick={() => loadEmployees()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-gray-500 mb-2">No employees found</p>
                <p className="text-gray-400 text-sm">
                  {searchTerm || filterDepartment !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : 'Add your first employee to get started'
                  }
                </p>
              </div>
            </div>
          ) : (
            <Table columns={columns} data={filteredEmployees} />
          )}
        </Card>

        {/* Add Employee Modal */}
        <AddEmployeeModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddEmployee}
        />

        {/* Employee Details Modal */}
        {selectedEmployee && (
          <EmployeeDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            employee={selectedEmployee}
            onUpdate={handleUpdateEmployee}
          />
        )}

        {/* Confirm Delete Modal */}
        <ConfirmDeleteModal
          isOpen={isConfirmDeleteModalOpen}
          onClose={() => setIsConfirmDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          employeeName={employeeToDelete?.fullName}
        />
      </div>
    </div>
  );
};