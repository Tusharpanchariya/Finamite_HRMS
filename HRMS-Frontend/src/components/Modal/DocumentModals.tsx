import React, { useState } from 'react';
import { X, Upload, Eye, Download, AlertTriangle, FileText, Calendar, User, Tag, Globe, Lock } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  uploadDate: string;
  size: string;
  uploadedBy: string;
  description: string;
  isPublic: boolean;
}

// Upload Document Modal
interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (document: Omit<Document, 'id' | 'uploadDate' | 'uploadedBy'>) => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'policy',
    category: '',
    description: '',
    isPublic: true,
    file: null as File | null
  });
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFormData(prev => ({ 
        ...prev, 
        file,
        // Only set name if it's empty, don't overwrite user input
        name: prev.name || file.name 
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ 
        ...prev, 
        file,
        // Only set name if it's empty, don't overwrite user input
        name: prev.name || file.name 
      }));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) return;

    const newDocument = {
      name: formData.name,
      type: formData.type,
      category: formData.category,
      description: formData.description,
      isPublic: formData.isPublic,
      size: formatFileSize(formData.file.size)
    };

    onUpload(newDocument);
    setFormData({
      name: '',
      type: 'policy',
      category: '',
      description: '',
      isPublic: true,
      file: null
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl font-bold text-gray-900 mb-6">Upload Document</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {formData.file ? (
              <div className="space-y-2">
                <FileText className="w-12 h-12 text-blue-600 mx-auto" />
                <p className="text-sm font-medium text-gray-900">{formData.file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(formData.file.size)}</p>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <p className="text-sm text-gray-600">
                  Drag and drop your file here, or{' '}
                  <label className="text-blue-600 hover:text-blue-800 cursor-pointer">
                    browse
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    />
                  </label>
                </p>
                <p className="text-xs text-gray-500">
                  Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)
                </p>
              </div>
            )}
          </div>

          {/* Document Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="policy">Policy</option>
                <option value="contract">Contract</option>
                <option value="handbook">Handbook</option>
                <option value="form">Form</option>
                <option value="certificate">Certificate</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="e.g., HR Policies, Training, Legal"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of the document..."
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
              Make this document publicly accessible to all employees
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.file}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// View Document Modal
interface ViewDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
}

export const ViewDocumentModal: React.FC<ViewDocumentModalProps> = ({ isOpen, onClose, document }) => {
  if (!isOpen || !document) return null;

  const getTypeIcon = (type: string) => {
    const icons = {
      contract: '📄',
      policy: '📋',
      handbook: '📚',
      form: '📝',
      certificate: '🏆'
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-start space-x-4 mb-6">
          <div className="text-4xl">{getTypeIcon(document.type)}</div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{document.name}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Tag className="w-4 h-4 mr-1" />
                {document.category}
              </span>
              <span className="flex items-center">
                {document.isPublic ? <Globe className="w-4 h-4 mr-1" /> : <Lock className="w-4 h-4 mr-1" />}
                {document.isPublic ? 'Public' : 'Private'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Calendar className="w-4 h-4 mr-2" />
                Upload Date
              </div>
              <p className="font-medium text-gray-900">
                {new Date(document.uploadDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <User className="w-4 h-4 mr-2" />
                Uploaded By
              </div>
              <p className="font-medium text-gray-900">{document.uploadedBy}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <FileText className="w-4 h-4 mr-2" />
              File Details
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Size: {document.size}</span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                {document.type.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">Description</div>
            <p className="text-gray-900">{document.description}</p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              // Simulate download
              const link = document.createElement('a');
              link.href = '#';
              link.download = document.name;
              link.click();
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  documentName: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  documentName 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
          Delete Document
        </h3>
        
        <p className="text-sm text-gray-500 text-center mb-6">
          Are you sure you want to delete "<span className="font-medium text-gray-900">{documentName}</span>"? 
          This action cannot be undone.
        </p>
        
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};