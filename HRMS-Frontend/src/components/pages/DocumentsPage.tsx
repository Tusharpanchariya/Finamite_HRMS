import React, { useState } from 'react';
import { FileText, Download, Upload, Search, Filter, Eye, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Table } from '../ui/Table';
import { mockDocuments } from '../../data/mockData';

export const DocumentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

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

  const getTypeBadge = (type: string) => {
    const styles = {
      contract: 'bg-blue-100 text-blue-800',
      policy: 'bg-green-100 text-green-800',
      handbook: 'bg-purple-100 text-purple-800',
      form: 'bg-yellow-100 text-yellow-800',
      certificate: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[type as keyof typeof styles]}`}>
        {type.toUpperCase()}
      </span>
    );
  };

  const columns = [
    {
      key: 'document',
      label: 'Document',
      render: (_: any, row: any) => (
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getTypeIcon(row.type)}</div>
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            <p className="text-sm text-gray-500">{row.category}</p>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: string) => getTypeBadge(value)
    },
    {
      key: 'size',
      label: 'Size'
    },
    {
      key: 'uploadDate',
      label: 'Upload Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'uploadedBy',
      label: 'Uploaded By'
    },
    {
      key: 'visibility',
      label: 'Visibility',
      render: (_: any, row: any) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          row.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {row.isPublic ? 'PUBLIC' : 'PRIVATE'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex items-center space-x-2">
          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-1 text-green-600 hover:bg-green-50 rounded">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-1 text-red-600 hover:bg-red-50 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const documentTypes = [...new Set(mockDocuments.map(doc => doc.type))];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-15xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Document Management</h1>
            <p className="text-gray-600">Manage company documents, policies, and files</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>

        {/* Document Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900">{mockDocuments.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Public Documents</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockDocuments.filter(doc => doc.isPublic).length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {[...new Set(mockDocuments.map(doc => doc.category))].length}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Filter className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">This Month</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <Upload className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full sm:w-64"
                />
              </div>

              {/* Type Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                >
                  <option value="all">All Types</option>
                  {documentTypes.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Documents Table */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Documents ({filteredDocuments.length})
              </h2>
              <p className="text-sm text-gray-500">
                {searchTerm && `Showing results for "${searchTerm}"`}
                {filterType !== 'all' && ` filtered by ${filterType}`}
              </p>
            </div>
          </div>
          
          <Table columns={columns} data={filteredDocuments} />
        </Card>
      </div>
    </div>
  );
};