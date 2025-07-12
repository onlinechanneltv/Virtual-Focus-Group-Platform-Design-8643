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
  FiDownload, FiSettings, FiEdit, FiCheckCircle
} = FiIcons

const ClientDashboard = () => {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalParticipants: 0,
    avgRating: 0
  })
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false)
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    targetParticipants: 10,
    status: 'draft'
  })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    fetchProjects()
    fetchStats()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Total projects by this client
      const { count: projectCount, error: projectError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
      
      if (projectError) throw projectError
      
      // Active projects
      const { count: activeCount, error: activeError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .eq('status', 'active')
      
      if (activeError) throw activeError
      
      // Total participants across all projects
      let totalParticipants = 0
      const { data: projectsData, error: participantsError } = await supabase
        .from('projects')
        .select('participant_count')
        .eq('user_id', user?.id)
      
      if (participantsError) throw participantsError
      
      if (projectsData) {
        totalParticipants = projectsData.reduce(
          (sum, project) => sum + (project.participant_count || 0), 
          0
        )
      }
      
      // Average rating (would be calculated from feedback data)
      const avgRating = 4.7 // Placeholder
      
      setStats({
        totalProjects: projectCount || 0,
        activeProjects: activeCount || 0,
        totalParticipants,
        avgRating
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleCreateProject = async (e) => {
    e.preventDefault()
    setFormError('')
    
    try {
      const newProject = {
        title: projectForm.title,
        description: projectForm.description,
        user_id: user.id,
        target_participants: parseInt(projectForm.targetParticipants),
        status: projectForm.status,
        created_at: new Date().toISOString(),
        participant_count: 0
      }
      
      const { data, error } = await supabase
        .from('projects')
        .insert([newProject])
        .select()
      
      if (error) throw error
      
      // Success - close modal and refresh projects
      setShowCreateProjectModal(false)
      setProjectForm({
        title: '',
        description: '',
        targetParticipants: 10,
        status: 'draft'
      })
      
      // Add the new project to the list
      if (data && data[0]) {
        setProjects([data[0], ...projects])
      }
      
      fetchStats()
    } catch (error) {
      setFormError(error.message || 'An unexpected error occurred')
      console.error('Error creating project:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
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
              Welcome back, {user?.user_metadata?.first_name || 'Client'}!
            </h1>
            <p className="text-gray-600">Manage your focus groups and track results</p>
          </div>
          <Button className="mt-4 md:mt-0" onClick={() => setShowCreateProjectModal(true)}>
            <SafeIcon icon={FiPlus} className="mr-2 w-5 h-5" />
            Create Focus Group
          </Button>
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
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
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
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgRating}/5</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <Card.Header>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
                <Button variant="ghost" size="sm">
                  View All
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
                  <p className="text-gray-500 mb-6">Create your first focus group to get started</p>
                  <Button onClick={() => setShowCreateProjectModal(true)}>
                    <SafeIcon icon={FiPlus} className="mr-2 w-5 h-5" />
                    Create Focus Group
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {projects.map((project) => (
                    <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {project.title}
                          </h3>
                          <p className="text-gray-500 text-sm mb-2">{project.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <SafeIcon icon={FiUsers} className="w-4 h-4 mr-1" />
                              {project.participant_count || 0} participants
                            </span>
                            <span className="flex items-center">
                              <SafeIcon icon={FiClock} className="w-4 h-4 mr-1" />
                              {new Date(project.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {project.status || 'Draft'}
                          </span>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <SafeIcon icon={FiEye} className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <SafeIcon icon={FiDownload} className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <SafeIcon icon={FiSettings} className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Content>
          </Card>
        </motion.div>
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateProjectModal}
        onClose={() => setShowCreateProjectModal(false)}
        title="Create New Focus Group"
        size="md"
      >
        <form onSubmit={handleCreateProject} className="space-y-6">
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {formError}
            </div>
          )}
          
          <Input
            label="Project Title"
            value={projectForm.title}
            onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows="3"
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              required
            ></textarea>
          </div>
          
          <Input
            label="Target Participants"
            type="number"
            min="1"
            value={projectForm.targetParticipants}
            onChange={(e) => setProjectForm({ ...projectForm, targetParticipants: e.target.value })}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={projectForm.status}
              onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
              required
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowCreateProjectModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              <SafeIcon icon={FiCheckCircle} className="mr-2 w-5 h-5" />
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ClientDashboard