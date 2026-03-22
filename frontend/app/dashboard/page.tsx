'use client';

import { useState, useEffect } from 'react';
import { getUsers, deleteUser, getStats } from '@/utils/api';
import type { Person, StatsResponse } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const [users, setUsers] = useState<Person[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      const [usersData, statsData] = await Promise.all([
        getUsers(),
        getStats(),
      ]);
      setUsers(usersData);
      setStats(statsData);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: number, userName: string) => {
    if (confirm(`Delete ${userName}? This action cannot be undone.`)) {
      setDeletingId(userId);
      try {
        await deleteUser(userId);
        fetchData();
      } catch (err) {
        alert('Failed to delete user');
      } finally {
        setDeletingId(null);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl">📊</span>
            </div>
          </div>
          <p className="text-white/80 font-medium mt-4">Loading dashboard...</p>
          <p className="text-white/50 text-sm">Fetching your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-50"></div>
              <div className="relative w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-4xl">📊</span>
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 bg-clip-text text-transparent mb-3">
            Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Manage registered people and view system statistics
          </p>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start space-x-3">
                <span className="text-xl">⚠️</span>
                <div className="flex-1">
                  <p className="text-red-700 font-medium">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    Dismiss →
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-2xl">👥</span>
                  </div>
                  <span className="text-3xl font-bold text-blue-600">{stats.people_count}</span>
                </div>
                <h3 className="text-gray-700 font-semibold">Registered People</h3>
                <p className="text-sm text-gray-400 mt-1">Total in system</p>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-2xl">🔢</span>
                  </div>
                  <span className="text-3xl font-bold text-purple-600">{stats.encodings_count}</span>
                </div>
                <h3 className="text-gray-700 font-semibold">Face Encodings</h3>
                <p className="text-sm text-gray-400 mt-1">Active in database</p>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-2xl">🗄️</span>
                  </div>
                  <span className="text-3xl font-bold text-green-600">{stats.database}</span>
                </div>
                <h3 className="text-gray-700 font-semibold">Database</h3>
                <p className="text-sm text-gray-400 mt-1">Storage type</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Users Table Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          {/* Table Header */}
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <span className="text-2xl">👥</span>
                  <span>Registered People</span>
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Total: {users.length} registered {users.length === 1 ? 'person' : 'people'}
                </p>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-64"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>
            </div>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto">
            {filteredUsers.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Registered</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Encodings</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-gradient-to-r hover:from-purple-50 hover:to-transparent transition-all duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-xs font-mono font-semibold text-gray-700">
                          {user.id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-400">User ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-700">
                            {new Date(user.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(user.created_at).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 max-w-24 bg-gray-100 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full h-2 transition-all duration-500"
                              style={{ width: `${Math.min((user.encoding_count / 10) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-purple-600">
                            {user.encoding_count}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          disabled={deletingId === user.id}
                          className="group relative inline-flex items-center space-x-1 px-3 py-1.5 text-red-600 hover:text-red-700 text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === user.id ? (
                            <>
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Deleting...</span>
                            </>
                          ) : (
                            <>
                              <span className="text-lg">🗑️</span>
                              <span className="group-hover:scale-105 transition-transform">Delete</span>
                            </>
                          )}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="px-6 py-16 text-center">
                <div className="inline-block">
                  <div className="text-7xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {searchTerm ? 'No matching results' : 'No registered people yet'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm 
                      ? `No results found for "${searchTerm}"`
                      : 'Go to Register page to add someone.'
                    }
                  </p>
                  {!searchTerm && (
                    <button 
                      onClick={() => window.location.href = '/register'}
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all hover:-translate-y-0.5"
                    >
                      <span>📝</span>
                      <span>Register Now</span>
                      <span>→</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Footer Stats */}
        {users.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500"
          >
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span>System Active</span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="flex items-center space-x-1">
                <span className="text-gray-400">📊</span>
                <span>{users.length} total users</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="text-gray-400">🕐</span>
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </span>
              <button 
                onClick={fetchData}
                className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                <span className="text-sm">🔄</span>
                <span>Refresh</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}