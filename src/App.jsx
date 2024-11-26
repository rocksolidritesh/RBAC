import React, { useState, useMemo } from 'react';
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Edit, 
  Trash2, 
  ArrowRight, 
  Search,
  Filter,
  SortAsc,
  AlertTriangle
} from 'lucide-react';

// Simulated Data
const initialUsers = [
  { 
    id: 1, 
    name: 'John Doe', 
    email: 'john@example.com', 
    role: 'Admin', 
    status: 'Active',
    lastLogin: new Date('2024-01-15')
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    email: 'jane@example.com', 
    role: 'Editor', 
    status: 'Active',
    lastLogin: new Date('2024-01-20')
  }
];

const initialRoles = [
  { 
    id: 1, 
    name: 'Admin', 
    description: 'Full system access and management',
    permissions: [
      'users:read', 
      'users:write', 
      'users:delete', 
      'roles:manage',
      'system:config'
    ] 
  },
  { 
    id: 2, 
    name: 'Editor', 
    description: 'Content management capabilities',
    permissions: [
      'users:read', 
      'users:write',
      'content:create',
      'content:edit'
    ] 
  }
];

const permissionLabels = {
  'users:read': 'View Users',
  'users:write': 'Edit Users',
  'users:delete': 'Delete Users',
  'roles:manage': 'Manage Roles',
  'system:config': 'System Configuration',
  'content:create': 'Create Content',
  'content:edit': 'Edit Content'
};

const RBACDashboard = () => {
  // State Management
  const [users, setUsers] = useState(initialUsers);
  const [roles, setRoles] = useState(initialRoles);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  // Advanced Filtering and Sorting States
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc'
  });

  // Enhanced Filtering Logic with Memoization
  const filteredAndSortedUsers = useMemo(() => {
    // Filter users based on search term
    let result = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sorting Logic
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return result;
  }, [users, searchTerm, sortConfig]);

  // Validation Helpers
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // User Management Functions with Basic Validation
  const addUser = (newUser) => {
    if (!validateEmail(newUser.email)) {
      alert('Invalid email format');
      return;
    }
    setUsers(prevUsers => [...prevUsers, { 
      ...newUser, 
      id: prevUsers.length + 1,
      lastLogin: new Date()
    }]);
  };

  const editUser = (updatedUser) => {
    if (!validateEmail(updatedUser.email)) {
      alert('Invalid email format');
      return;
    }
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
  };

  const deleteUser = (userId) => {
    // Confirm deletion to prevent accidental removal
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    }
  };

  // Role Management Functions
  const addRole = (newRole) => {
    setRoles(prevRoles => [...prevRoles, { 
      ...newRole, 
      id: prevRoles.length + 1 
    }]);
  };

  const editRole = (updatedRole) => {
    setRoles(prevRoles => 
      prevRoles.map(role => 
        role.id === updatedRole.id ? updatedRole : role
      )
    );
  };

  // Render Method
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-white border-r p-4 shadow-md">
        <div className="flex items-center mb-8">
          <ShieldCheck className="mr-2 text-blue-600" />
          <h1 className="text-xl font-bold">RBAC Dashboard</h1>
        </div>
        
        <nav>
          {['User Management', 'Role Management', 'System Logs'].map(item => (
            <div 
              key={item}
              className="flex items-center mb-4 p-2 hover:bg-blue-50 rounded cursor-pointer"
            >
              <Users className="mr-2" />
              <span>{item}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-4 md:p-8">
        {/* Search and Actions Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <div className="relative flex-grow mr-0 md:mr-4 w-full md:w-auto">
            <Search className="absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-2">
            <button 
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={() => setSelectedUser({
                id: 0,
                name: '',
                email: '',
                role: '',
                status: 'Active'
              })}
            >
              <UserPlus className="mr-2" /> Add User
            </button>
            <button 
              className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300"
              title="Filter Users"
            >
              <Filter size={20} />
            </button>
            <button 
              className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300"
              title="Sort Users"
              onClick={() => setSortConfig(prev => ({
                key: 'name',
                direction: prev.direction === 'asc' ? 'desc' : 'asc'
              }))}
            >
              <SortAsc size={20} />
            </button>
          </div>
        </div>

        {/* Empty State Handling */}
        {filteredAndSortedUsers.length === 0 && (
          <div className="flex items-center justify-center bg-yellow-50 p-4 rounded-lg">
            <AlertTriangle className="mr-2 text-yellow-600" />
            <span>No users found. Try a different search term.</span>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                {['Name', 'Email', 'Role', 'Status', 'Last Login', 'Actions'].map(header => (
                  <th key={header} className="p-3 text-left">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 border-b">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3">
                    <span className={`
                      px-2 py-1 rounded-full text-xs
                      ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    `}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {user.lastLogin ? user.lastLogin.toLocaleDateString() : 'Never'}
                  </td>
                  <td className="p-3 text-right">
                    <button 
                      onClick={() => setSelectedUser(user)} 
                      className="mr-2 text-blue-600 hover:text-blue-800"
                      aria-label="Edit User"
                    >
                      <Edit size={20} />
                    </button>
                    <button 
                      onClick={() => deleteUser(user.id)} 
                      className="text-red-600 hover:text-red-800"
                      aria-label="Delete User"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Roles Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Roles & Permissions</h2>
            <button 
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={() => setSelectedRole({})}
            >
              <ShieldCheck className="mr-2" /> Add Role
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map(role => (
              <div 
                key={role.id} 
                className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{role.name}</h3>
                  <div>
                    <button 
                      onClick={() => setSelectedRole(role)} 
                      className="mr-2 text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={20} />
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2 text-gray-600">Permissions</h4>
                  <div className="space-y-2">
                    {role.permissions.map(permission => (
                      <div 
                        key={permission} 
                        className="flex items-center text-sm text-gray-700"
                      >
                        <ArrowRight size={16} className="mr-2 text-blue-500" />
                        {permissionLabels[permission] || permission}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Modal (Simplified) */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl mb-4">
                {selectedUser.id ? 'Edit User' : 'Add New User'}
              </h2>
              {/* Basic form fields would be added here */}
              <div className="mt-4 flex justify-end space-x-2">
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    // Add user logic would be implemented here
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Role Modal (Simplified) */}
        {selectedRole && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl mb-4">
                {selectedRole.id ? 'Edit Role' : 'Add New Role'}
              </h2>
              {/* Basic role form fields would be added here */}
              <div className="mt-4 flex justify-end space-x-2">
                <button 
                  onClick={() => setSelectedRole(null)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    // Add role logic would be implemented here
                    setSelectedRole(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RBACDashboard;