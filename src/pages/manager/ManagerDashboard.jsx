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
  FiPlus, FiUsers, FiTrendingUp, FiClock, FiEye, 
  FiDownload, FiSettings, FiEdit, FiTrash, FiCheckCircle
} = FiIcons

const ManagerDashboard = () => {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('projects')
  const [stats, setStats] = useState({
    managedProjects: 0,
    activeProjects: 0,
    totalClients: 0,
    totalParticipants: 0
  })
  const [showAddClientModal, setShowAddClientModal] = useState(false)
  const [clientForm, setClientForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    notes: ''
  })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    fetchProjects()
    fetchClients()
    fetchStats()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*, client_id(*)')
        .eq('manager_id', user?.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchClients = async () => {
    try {
      // Get users with client role that are assigned to this manager
      const { data, error } = await supabase
        .from('client_managers')
        .select(`
          client_id,
          clients:client_id (
            email,
            user_metadata,
            created_at
          )
        `)
        .eq('manager_id', user?.id)
      
      if (error) throw error
      
      // Format client data
      const formattedClients = data.map(item => ({
        id: item.client_id,
        email: item.clients.email,
        firstName: item.clients.user_metadata?.first_name || '',
        lastName: item.clients.user_metadata?.last_name || '',
        company: item.clients.user_metadata?.company || '',
        createdAt: item.clients.created_at
      }))
      
      setClients(formattedClients)
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  const fetchStats = async () => {
    try {
      // Projects managed by this manager
      const { count: projectCount, error: projectError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('manager_id', user?.id)
      
      if (projectError) throw projectError
      
      // Active projects
      const { count: activeCount, error: activeError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('manager_id', user?.id)
        .eq('status', 'active')
      
      if (activeError) throw activeError
      
      // Clients managed by this manager
      const { count: clientCount, error: clientError } = await supabase
        .from('client_managers')
        .select('*', { count: 'exact', head: true })
        .eq('manager_id', user?.id)
      
      if (clientError) throw clientError
      
      // Total participants across all projects
      let totalParticipants = 0
      const { data: projectsData, error: participantsError } = await supabase
        .from('projects')
        .select('participant_count')
        .eq('manager_id', user?.id)
      
      if (participantsError) throw participantsError
      
      if (projectsData) {
        totalParticipants = projectsData.reduce(
          (sum, project) => sum + (project.participant_count || 0), 
          0
        )
      }
      
      setStats({
        managedProjects: projectCount || 0,
        activeProjects: activeCount || 0,
        totalClients: clientCount || 0,
        totalParticipants
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleAddClient = async (e) => {
    e.preventDefault()
    setFormError('')
    
    try {
      // First check if user exists
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', clientForm.email)
        .single()
      
      if (userError && userError.code !== 'PGRST116') {
        throw userError
      }
      
      let clientId = existingUser?.id
      
      // If user doesn't exist, create a new one
      if (!clientId) {
        // Create user with client role
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: clientForm.email,
          email_confirm: true,
          user_metadata: {
            first_name: clientForm.firstName,
            last_name: clientForm.lastName,
            company: clientForm.company,
            notes: clientForm.notes
          }
        })
        
        if (createError) throw createError
        
        clientId = newUser.user.id
        
        // Set user role to client
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert([{ user_id: clientId, role: 'client' }])
        
        if (roleError) throw roleError
      }
      
      // Assign client to this manager
      const { error: assignError } = await supabase
        .from('client_managers')
        .insert([{ 
          client_id: clientId, 
          manager_id: user.id 
        }])
      
      if (assignError) throw assignError
      
      // Success - close modal and refresh clients
      setShowAddClientModal(false)
      setClientForm({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        notes: ''
      })
      
      fetchClients()
      fetchStats()
    } catch (error) {
      setFormError(error.message || 'An unexpected error occurred')
      console.error('Error adding client:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Manager Dashboard
            </h1>
            <p className="text-gray-600">
              Manage clients, projects, and focus groups
            </p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Button onClick={() => setShowAddClientModal(true)}>
              <SafeIcon icon={FiPlus} className="mr-2 w-5 h-5" />
              Add Client
            </Button>
            <Button>
              <SafeIcon icon={FiPlus} className="mr-2 w-5 h-5" />
              Create Project
            </Button>
          </div>
        </div>

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
                  <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Managed Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.managedProjects}</p>
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
                <div className="p-2 bg-green-100 rounded-lg">
                  <SafeIcon icon={FiClock} className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
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
                <div className="p-2 bg-blue-100 rounded-lg">
                  <SafeIcon icon={FiUsers} className="w-6 h-6 text-blue-600" />
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
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-secondary-100 rounded-lg">
                  <SafeIcon icon={FiUsers} className="w-6 h-6 text-secondary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Participants</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalParticipants}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
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
              activeTab === 'clients'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('clients')}
          >
            Clients
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'reports'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <Card>
            <Card.Header>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Managed Projects</h2>
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
                  <p className="text-gray-500 mt-2">Loading projects...</p>
                </div>
              ) : projects.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SafeIcon icon={FiTrendingUp} className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                  <p className="text-gray-500 mb-6">Create your first project to get started</p>
                  <Button>
                    <SafeIcon icon={FiPlus} className="mr-2 w-5 h-5" />
                    Create Project
                  </Button>
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
                            {project.client_id?.email || '—'}
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
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="sm">
                                <SafeIcon icon={FiEye} className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <SafeIcon icon={FiEdit} className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
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

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <Card>
            <Card.Header>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Managed Clients</h2>
                <Button variant="ghost" size="sm">
                  <SafeIcon icon={FiDownload} className="mr-2 w-4 h-4" />
                  Export
                </Button>
              </div>
            </Card.Header>
            <Card.Content className="p-0">
              {clients.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SafeIcon icon={FiUsers} className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No clients yet</h3>
                  <p className="text-gray-500 mb-6">Add your first client to get started</p>
                  <Button onClick={() => setShowAddClientModal(true)}>
                    <SafeIcon icon={FiPlus} className="mr-2 w-5 h-5" />
                    Add Client
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Projects
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Since
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {clients.map((client) => (
                        <tr key={client.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-500 font-medium">
                                  {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {client.firstName} {client.lastName}
                                </div>
                                <div className="text-sm text-gray-500">{client.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {client.company || '—'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {/* This would be populated with actual project count */}
                            0
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(client.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="sm">
                                <SafeIcon icon={FiPlus} className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <SafeIcon icon={FiEdit} className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
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

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <Card>
            <Card.Header>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Performance Reports</h2>
                <Button variant="ghost" size="sm">
                  <SafeIcon icon={FiDownload} className="mr-2 w-4 h-4" />
                  Export
                </Button>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiTrendingUp} className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Reports Coming Soon</h3>
                <p className="text-gray-500">
                  Performance reports and analytics will be available here
                </p>
              </div>
            </Card.Content>
          </Card>
        )}
      </div>

      {/* Add Client Modal */}
      <Modal
        isOpen={showAddClientModal}
        onClose={() => setShowAddClientModal(false)}
        title="Add New Client"
        size="md"
      >
        <form onSubmit={handleAddClient} className="space-y-6">
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {formError}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={clientForm.firstName}
              onChange={(e) => setClientForm({ ...clientForm, firstName: e.target.value })}
              required
            />
            <Input
              label="Last Name"
              value={clientForm.lastName}
              onChange={(e) => setClientForm({ ...clientForm, lastName: e.target.value })}
              required
            />
          </div>
          
          <Input
            label="Email Address"
            type="email"
            value={clientForm.email}
            onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
            required
          />
          
          <Input
            label="Company (Optional)"
            value={clientForm.company}
            onChange={(e) => setClientForm({ ...clientForm, company: e.target.value })}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows="3"
              value={clientForm.notes}
              onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
            ></textarea>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowAddClientModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              <SafeIcon icon={FiCheckCircle} className="mr-2 w-5 h-5" />
              Add Client
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ManagerDashboard