import React, { useState, useEffect } from 'react';
import { Building2, Users, MapPin, Calendar, Plus, X, Edit, Eye, Trash2, Info, Loader2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Department, CreateDepartmentRequest, UpdateDepartmentRequest } from '../../types/department.types';
import { departmentApiService } from '../../services/departmentApi';

// Modal Component (Generic)
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className = '' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-lg shadow-xl w-full ${className} p-6 relative`}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
};

// Add Department Modal
interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDepartment: (newDepartment: Department) => void;
}

const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({ isOpen, onClose, onAddDepartment }) => {
  const [formData, setFormData] = useState<CreateDepartmentRequest>({
    name: '',
    manager: '',
    description: '',
    location: '',
    establishDate: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await departmentApiService.createDepartment({
        ...formData,
        establishDate: formData.establishDate || null
      });
      
      if (response.success && response.data) {
        onAddDepartment(response.data);
        onClose();
        // Reset form
        setFormData({
          name: '',
          manager: '',
          description: '',
          location: '',
          establishDate: '',
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create department');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Department" className="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Department Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="establishDate" className="block text-sm font-medium text-gray-700">Established Date</label>
            <input
              type="date"
              id="establishDate"
              name="establishDate"
              value={formData.establishDate}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="manager" className="block text-sm font-medium text-gray-700">Manager</label>
            <input
              type="text"
              id="manager"
              name="manager"
              value={formData.manager}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isLoading}
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <textarea
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            rows={2}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isLoading}
          ></textarea>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isLoading ? 'Creating...' : 'Add Department'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

// View Department Modal
interface ViewDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
}

const ViewDepartmentModal: React.FC<ViewDepartmentModalProps> = ({ isOpen, onClose, department }) => {
  if (!department) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Details for ${department.name}`} className="max-w-xl">
      <div className="space-y-4 text-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Department Name</p>
            <p className="text-lg font-semibold text-gray-900">{department.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Manager</p>
            <p className="text-lg font-semibold text-gray-900">{department.manager}</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Description</p>
          <p className="text-gray-800">{department.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Location</p>
            <p className="text-gray-800">{department.location}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Established Date</p>
            <p className="text-gray-800">
              {department.establishDate 
                ? new Date(department.establishDate).toLocaleDateString()
                : 'Not specified'
              }
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

// Edit Department Modal
interface EditDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
  onUpdateDepartment: (updatedDepartment: Department) => void;
}

const EditDepartmentModal: React.FC<EditDepartmentModalProps> = ({ isOpen, onClose, department, onUpdateDepartment }) => {
  const [formData, setFormData] = useState<UpdateDepartmentRequest>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        manager: department.manager,
        description: department.description,
        location: department.location,
        establishDate: department.establishDate || '',
      });
    }
  }, [department]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!department) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await departmentApiService.updateDepartment(department.id, {
        ...formData,
        establishDate: formData.establishDate || null
      });
      
      if (response.success && response.data) {
        onUpdateDepartment(response.data);
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update department');
    } finally {
      setIsLoading(false);
    }
  };

  if (!department) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit ${department.name}`} className="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">Department Name</label>
          <input
            type="text"
            id="edit-name"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="edit-manager" className="block text-sm font-medium text-gray-700">Manager</label>
          <input
            type="text"
            id="edit-manager"
            name="manager"
            value={formData.manager || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="edit-description"
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isLoading}
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="edit-location" className="block text-sm font-medium text-gray-700">Location</label>
          <textarea
            id="edit-location"
            name="location"
            value={formData.location || ''}
            onChange={handleInputChange}
            rows={2}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isLoading}
          ></textarea>
        </div>
        <div>
          <label htmlFor="edit-establishDate" className="block text-sm font-medium text-gray-700">Established Date</label>
          <input
            type="date"
            id="edit-establishDate"
            name="establishDate"
            value={formData.establishDate || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Confirm Delete Modal
interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  departmentName: string;
  isLoading: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, departmentName, isLoading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion" className="max-w-sm">
      <div className="text-center p-4">
        <Info className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-lg text-gray-800 mb-6">
          Are you sure you want to delete the department "<span className="font-semibold">{departmentName}</span>"?
          This action cannot be undone.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isLoading ? 'Deleting...' : 'Delete'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export const DepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load departments on component mount
  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await departmentApiService.getAllDepartments();
      if (response.success) {
        setDepartments(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load departments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDepartment = (newDepartment: Department) => {
    setDepartments(prev => [newDepartment, ...prev]);
  };

  const handleUpdateDepartment = (updatedDepartment: Department) => {
    setDepartments(prev =>
      prev.map(dept => (dept.id === updatedDepartment.id ? updatedDepartment : dept))
    );
  };

  const handleDeleteClick = (department: Department) => {
    setDepartmentToDelete(department);
    setIsConfirmDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!departmentToDelete) return;

    setIsDeleting(true);
    try {
      const response = await departmentApiService.deleteDepartment(departmentToDelete.id);
      if (response.success) {
        setDepartments(prev => prev.filter(dept => dept.id !== departmentToDelete.id));
        setIsConfirmDeleteModalOpen(false);
        setDepartmentToDelete(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete department');
    } finally {
      setIsDeleting(false);
    }
  };

  const openViewModal = (department: Department) => {
    setSelectedDepartment(department);
    setIsViewModalOpen(true);
  };

  const openEditModal = (department: Department) => {
    setSelectedDepartment(department);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading departments...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={loadDepartments}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-15xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Departments</h1>
            <p className="text-gray-600">Manage organizational departments and structure</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Department</span>
          </button>
        </div>

        {/* Department Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Departments</p>
                <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Managers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(departments.map(d => d.manager)).size}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Locations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(departments.map(d => d.location)).size}
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <MapPin className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Departments Grid */}
        {departments.length === 0 ? (
          <Card className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first department.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Department
            </button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((department) => (
              <Card key={department.id} className="hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
                      <p className="text-sm text-gray-500">Manager: {department.manager}</p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{department.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Location</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 truncate max-w-32">{department.location}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Established</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {department.establishDate 
                        ? new Date(department.establishDate).toLocaleDateString()
                        : 'Not specified'
                      }
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openViewModal(department)}
                      className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => openEditModal(department)}
                      className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center space-x-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(department)}
                      className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center justify-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddDepartmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddDepartment={handleAddDepartment}
      />
      <ViewDepartmentModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        department={selectedDepartment}
      />
      <EditDepartmentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        department={selectedDepartment}
        onUpdateDepartment={handleUpdateDepartment}
      />
      <ConfirmDeleteModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        departmentName={departmentToDelete?.name || ''}
        isLoading={isDeleting}
      />
    </div>
  );
};