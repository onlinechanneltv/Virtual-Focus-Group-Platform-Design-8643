import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../config/supabase'

const { 
  FiPlus, FiUsers, FiTrendingUp, FiUserPlus, FiUserX, 
  FiSettings, FiEdit, FiTrash, FiUserCheck, FiDownload, FiUser
} = FiIcons

const AdminDashboard = () => {
  const { user, createManager } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClients: 0,
    totalParticipants: 0,
    totalProjects: 0
  })
  const [users, setUsers] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateManagerModal, setShowCreateManagerModal] = useState(false)
  const [managerForm, setManagerForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    company: ''
  })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    fetchStats()
    fetchUsers()
    fetchProjects()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch user statistics
      const { data: users, error: usersError } = await supabase
        .from('user_roles')
        .select('role')
      
      if (usersError) throw usersError
      
      // Fetch project count
      const { count: projectCount, error: projectError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
      
      if (projectError) throw projectError
      
      // Calculate stats
      const totalUsers = users.length
      const totalClients = users.filter(u => u.role === 'client').length
      const totalParticipants = users.filter(u => u.role === 'participant').length
      
      setStats({
        totalUsers,
        totalClients,
        totalParticipants,
        totalProjects: projectCount || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      // Join users with their roles
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          users:user_id (
            email,
            created_at,
            user_metadata
          )
        `)
        .order('created_at', { foreignTable: 'users', ascending: false })
      
      if (error) throw error
      
      // Format user data
      const formattedUsers = data.map(item => ({
        id: item.user_id,
        email: item.users.email,
        role: item.role,
        firstName: item.users.user_metadata?.first_name || '',
        lastName: item.users.user_metadata?.last_name || '',
        company: item.users.user_metadata?.company || '',
        createdAt: item.users.created_at
      }))
      
      setUsers(formattedUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const handleCreateManager = async (e) => {
    e.preventDefault()
    setFormError('')
    
    if (managerForm.password.length < 6) {
      setFormError('Password must be at least 6 characters')
      return
    }
    
    try {
      const userData = {
        first_name: managerForm.firstName,
        last_name: managerForm.lastName,
        company: managerForm.company,
        user_type: 'manager'
      }
      
      const { error } = await createManager(
        managerForm.email,
        managerForm.password,
        userData
      )
      
      if (error) {
        setFormError(error.message)
        return
      }
      
      // Success - close modal and refresh users
      setShowCreateManagerModal(false)
      setManagerForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        company: ''
      })
      
      fetchUsers()
      fetchStats()
    } catch (error) {
      setFormError('An unexpected error occurred')
      console.error('Error creating manager:', error)
    }
  }

  const handleChangeUserRole = async (userId, newRole) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId)
      
      if (error) throw error
      
      // Refresh user list
      fetchUsers()
      fetchStats()
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }
    
    try {
      // Delete user role first (to maintain referential integrity)
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
      
      if (roleError) throw roleError
      
      // Delete the user from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(userId)
      
      if (authError) throw authError
      
      // Refresh user list
      fetchUsers()
      fetchStats()
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user. See console for details.')
    }
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'manager': return 'bg-purple-100 text-purple-800'
      case 'client': return 'bg-blue-100 text-blue-800'
      case 'participant': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage users, projects, and platform settings</p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Button onClick={() => setShowCreateManagerModal(true)}>
              <SafeIcon icon={FiUserPlus} className="mr-2 w-5 h-5" />
              Create Manager
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'overview'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'users'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'projects'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'settings'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <SafeIcon icon={FiUsers} className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <SafeIcon icon={FiUserCheck} className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Clients</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <SafeIcon icon={FiUsers} className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Participants</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalParticipants}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Projects</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {/* Activity items would go here */}
                  <p className="text-gray-500 text-center py-4">Activity data will be shown here</p>
                </div>
              </Card.Content>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card>
            <Card.Header>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                <Button variant="ghost" size="sm">
                  <SafeIcon icon={FiDownload} className="mr-2 w-4 h-4" />
                  Export
                </Button>
              </div>
            </Card.Header>
            <Card.Content className="p-0">
              {loading ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading users...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-500" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(
                                user.role
                              )}`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.company || '—'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <div className="relative group">
                                <Button variant="ghost" size="sm">
                                  <SafeIcon icon={FiEdit} className="w-4 h-4" />
                                </Button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 p-2 hidden group-hover:block z-10">
                                  <p className="text-xs font-medium text-gray-500 mb-1 px-2">Change role to:</p>
                                  <button
                                    onClick={() => handleChangeUserRole(user.id, 'client')}
                                    className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                                  >
                                    Client
                                  </button>
                                  <button
                                    onClick={() => handleChangeUserRole(user.id, 'participant')}
                                    className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                                  >
                                    Participant
                                  </button>
                                  <button
                                    onClick={() => handleChangeUserRole(user.id, 'manager')}
                                    className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                                  >
                                    Manager
                                  </button>
                                  <button
                                    onClick={() => handleChangeUserRole(user.id, 'admin')}
                                    className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                                  >
                                    Admin
                                  </button>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <SafeIcon icon={FiTrash} className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Content>
          </Card>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <Card>
            <Card.Header>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">All Projects</h2>
                <Button variant="ghost" size="sm">
                  <SafeIcon icon={FiDownload} className="mr-2 w-4 h-4" />
                  Export
                </Button>
              </div>
            </Card.Header>
            <Card.Content className="p-0">
              {projects.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SafeIcon icon={FiTrendingUp} className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                  <p className="text-gray-500 mb-6">Projects will be listed here once created</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Project
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Participants
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {projects.map((project) => (
                        <tr key={project.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{project.title}</div>
                            <div className="text-sm text-gray-500">{project.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {project.client_name || '—'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                project.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : project.status === 'completed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {project.status || 'Draft'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {project.participant_count || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(project.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="ghost" size="sm">
                              <SafeIcon icon={FiEdit} className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <SafeIcon icon={FiTrash} className="w-4 h-4 text-red-500" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Content>
          </Card>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Platform Settings</h2>
            </Card.Header>
            <Card.Content>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Enable public registration</p>
                        <p className="text-xs text-gray-500">Allow users to register without invitation</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          id="toggle-registration"
                          className="sr-only"
                        />
                        <label
                          htmlFor="toggle-registration"
                          className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        >
                          <span className="block h-6 w-6 rounded-full bg-white shadow transform"></span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Email notifications</p>
                        <p className="text-xs text-gray-500">Send email notifications for system events</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          id="toggle-emails"
                          className="sr-only"
                        />
                        <label
                          htmlFor="toggle-emails"
                          className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        >
                          <span className="block h-6 w-6 rounded-full bg-white shadow transform"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">API Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        API Key
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value="••••••••••••••••••••••••••••••"
                          disabled
                          className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50"
                        />
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 border-l-0 rounded-r-lg hover:bg-gray-200">
                          Regenerate
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Enable API access</p>
                        <p className="text-xs text-gray-500">Allow external applications to access the API</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          id="toggle-api"
                          className="sr-only"
                        />
                        <label
                          htmlFor="toggle-api"
                          className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        >
                          <span className="block h-6 w-6 rounded-full bg-white shadow transform"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Danger Zone</h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-red-800">Reset Platform Data</p>
                        <p className="text-xs text-red-600">This will delete all projects and user data</p>
                      </div>
                      <Button variant="danger" size="sm">
                        Reset Data
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        )}
      </div>

      {/* Create Manager Modal */}
      <Modal
        isOpen={showCreateManagerModal}
        onClose={() => setShowCreateManagerModal(false)}
        title="Create Manager Account"
        size="md"
      >
        <form onSubmit={handleCreateManager} className="space-y-6">
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {formError}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={managerForm.firstName}
              onChange={(e) => setManagerForm({ ...managerForm, firstName: e.target.value })}
              required
            />
            <Input
              label="Last Name"
              value={managerForm.lastName}
              onChange={(e) => setManagerForm({ ...managerForm, lastName: e.target.value })}
              required
            />
          </div>
          
          <Input
            label="Email Address"
            type="email"
            value={managerForm.email}
            onChange={(e) => setManagerForm({ ...managerForm, email: e.target.value })}
            required
          />
          
          <Input
            label="Password"
            type="password"
            value={managerForm.password}
            onChange={(e) => setManagerForm({ ...managerForm, password: e.target.value })}
            required
          />
          
          <Input
            label="Company (Optional)"
            value={managerForm.company}
            onChange={(e) => setManagerForm({ ...managerForm, company: e.target.value })}
          />
          
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowCreateManagerModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create Manager
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default AdminDashboard