import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data?.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, email) => {
    if (!window.confirm(`Are you sure you want to delete user "${email}"?`)) return;
    
    setDeleting(id);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('User deleted successfully!');
      fetchUsers();
    } catch (err) {
      console.error('Delete failed:', err);
      alert(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="text-xl text-white">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-zinc-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <div className="text-gray-400">Total Users: {users.length}</div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No users found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-zinc-800 rounded-xl p-6 shadow-lg hover:shadow-[0_0_20px_rgba(234,21,56,0.4)] transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.fullName?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {user.fullName || user.username || user.email}
                  </h3>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Role:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.role === 'admin' 
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' 
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                  }`}>
                    {user.role || 'user'}
                  </span>
                </div>

                {user.username && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Username:</span>
                    <span className="text-white text-sm">@{user.username}</span>
                  </div>
                )}

                {user.createdAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Joined:</span>
                    <span className="text-white text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t border-zinc-700">
                <button
                  onClick={() => handleDelete(user._id, user.email)}
                  disabled={deleting === user._id || user.role === 'admin'}
                  className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title={user.role === 'admin' ? 'Cannot delete admin users' : 'Delete user'}
                >
                  {deleting === user._id ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
                  onClick={() => alert('View details functionality coming soon!')}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
