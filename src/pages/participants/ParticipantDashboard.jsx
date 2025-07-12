import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../config/supabase'

const { 
  FiClock, FiDollarSign, FiCheckCircle, FiCalendar,
  FiEdit, FiList, FiBarChart, FiUser, FiEye
} = FiIcons

const ParticipantDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    completedSessions: 0,
    upcomingSessions: 0,
    totalEarned: 0,
    profileCompletion: 0
  })
  const [sessions, setSessions] = useState([])
  const [profileData, setProfileData] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('sessions')
  const [showProfileModal, setShowProfileModal] = useState(false)

  useEffect(() => {
    fetchSessions()
    fetchProfileData()
    fetchStats()
  }, [])

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('participant_sessions')
        .select('*, project:project_id(*)')
        .eq('participant_id', user?.id)
        .order('scheduled_date', { ascending: true })
      
      if (error) throw error
      setSessions(data || [])
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from('participant_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single()
      
      if (error && error.code !== 'PGRST116') {
        throw error
      }
      
      setProfileData(data || {})
    } catch (error) {
      console.error('Error fetching profile data:', error)
    }
  }

  const fetchStats = async () => {
    try {
      // Completed sessions
      const { count: completedCount, error: completedError } = await supabase
        .from('participant_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('participant_id', user?.id)
        .eq('status', 'completed')
      
      if (completedError) throw completedError
      
      // Upcoming sessions
      const { count: upcomingCount, error: upcomingError } = await supabase
        .from('participant_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('participant_id', user?.id)
        .eq('status', 'scheduled')
        .gte('scheduled_date', new Date().toISOString())
      
      if (upcomingError) throw upcomingError
      
      // Total earned
      const { data: earningsData, error: earningsError } = await supabase
        .from('participant_payments')
        .select('amount')
        .eq('participant_id', user?.id)
        .eq('status', 'paid')
      
      if (earningsError) throw earningsError
      
      const totalEarned = earningsData
        ? earningsData.reduce((sum, payment) => sum + payment.amount, 0)
        : 0
      
      // Calculate profile completion
      let profileCompletion = 0
      if (Object.keys(profileData).length > 0) {
        // Count filled fields (excluding user_id and created_at)
        const totalFields = Object.keys(profileData).length - 2
        const filledFields = Object.entries(profileData).filter(
          ([key, value]) => key !== 'user_id' && key !== 'created_at' && value
        ).length
        
        profileCompletion = Math.round((filledFields / totalFields) * 100)
      }
      
      setStats({
        completedSessions: completedCount || 0,
        upcomingSessions: upcomingCount || 0,
        totalEarned,
        profileCompletion
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const getSessionStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
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
              Participant Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your focus group sessions and profile
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button onClick={() => setShowProfileModal(true)}>
              <SafeIcon icon={FiEdit} className="mr-2 w-5 h-5" />
              Update Profile
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
                <div className="p-2 bg-green-100 rounded-lg">
                  <SafeIcon icon={FiCheckCircle} className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedSessions}</p>
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
                  <SafeIcon icon={FiClock} className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Upcoming Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.upcomingSessions}</p>
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
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <SafeIcon icon={FiDollarSign} className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Earned</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalEarned.toFixed(2)}</p>
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
                <div className="p-2 bg-purple-100 rounded-lg">
                  <SafeIcon icon={FiUser} className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Profile Completion</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-gray-900">{stats.profileCompletion}%</p>
                    <div className="ml-2 bg-gray-200 w-16 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-purple-600 h-full rounded-full" 
                        style={{ width: `${stats.profileCompletion}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'sessions'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('sessions')}
          >
            My Sessions
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'opportunities'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('opportunities')}
          >
            Opportunities
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'profile'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            My Profile
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'payments'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('payments')}
          >
            Payments
          </button>
        </div>

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">My Focus Group Sessions</h2>
            </Card.Header>
            <Card.Content className="p-0">
              {loading ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading sessions...</p>
                </div>
              ) : sessions.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SafeIcon icon={FiCalendar} className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions yet</h3>
                  <p className="text-gray-500 mb-6">
                    You'll see your upcoming and past focus group sessions here
                  </p>
                  <Button onClick={() => setActiveTab('opportunities')}>
                    Browse Opportunities
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Focus Group
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Compensation
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sessions.map((session) => (
                        <tr key={session.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {session.project?.title || 'Untitled Project'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {session.project?.description || '—'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(session.scheduled_date).toLocaleDateString()}, 
                            {' '}
                            {session.scheduled_time || '—'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSessionStatusColor(
                                session.status
                              )}`}
                            >
                              {session.status || 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${session.compensation || '0.00'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="sm">
                                <SafeIcon icon={FiEye} className="w-4 h-4" />
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

        {/* Opportunities Tab */}
        {activeTab === 'opportunities' && (
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Available Opportunities</h2>
            </Card.Header>
            <Card.Content>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiList} className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No opportunities available right now
                </h3>
                <p className="text-gray-500">
                  Check back soon for new focus group opportunities that match your profile
                </p>
              </div>
            </Card.Content>
          </Card>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card>
            <Card.Header>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">My Profile</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowProfileModal(true)}>
                  <SafeIcon icon={FiEdit} className="mr-2 w-4 h-4" />
                  Edit
                </Button>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-6">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <SafeIcon icon={FiUser} className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Complete your profile to get matched with more focus group opportunities.
                        {stats.profileCompletion < 100 && (
                          <span className="font-medium"> Your profile is {stats.profileCompletion}% complete.</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Basic Information</h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                      <dd className="mt-1 text-gray-900">
                        {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-gray-900">{user?.email}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Age</dt>
                      <dd className="mt-1 text-gray-900">{profileData?.age || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Gender</dt>
                      <dd className="mt-1 text-gray-900">{profileData?.gender || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Location</dt>
                      <dd className="mt-1 text-gray-900">
                        {profileData?.location_city ? (
                          <>
                            {profileData.location_city}, {profileData.location_state}, {profileData.location_country}
                          </>
                        ) : (
                          '—'
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Occupation</dt>
                      <dd className="mt-1 text-gray-900">{profileData?.occupation || '—'}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Demographics</h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Education</dt>
                      <dd className="mt-1 text-gray-900">{profileData?.education || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Income Range</dt>
                      <dd className="mt-1 text-gray-900">{profileData?.income || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Marital Status</dt>
                      <dd className="mt-1 text-gray-900">{profileData?.marital_status || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Household Size</dt>
                      <dd className="mt-1 text-gray-900">{profileData?.household_size || '—'}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Interests & Preferences</h3>
                  <dl className="grid grid-cols-1 gap-y-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Hobbies</dt>
                      <dd className="mt-1 text-gray-900">
                        {profileData?.hobbies ? profileData.hobbies.join(', ') : '—'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Media Preferences</dt>
                      <dd className="mt-1 text-gray-900">
                        {profileData?.favorite_genres ? profileData.favorite_genres.join(', ') : '—'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </Card.Content>
          </Card>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
            </Card.Header>
            <Card.Content>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiBarChart} className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
                <p className="text-gray-500">
                  Your payment history will appear here after participating in focus groups
                </p>
              </div>
            </Card.Content>
          </Card>
        )}
      </div>

      {/* Profile Update Modal would go here */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="Update Your Profile"
        size="xl"
      >
        <div className="p-4">
          <p className="text-center text-gray-600 mb-6">
            Complete your profile to improve your chances of being matched with focus groups
          </p>
          
          {/* Profile form would go here */}
          <div className="text-center">
            <Button onClick={() => setShowProfileModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ParticipantDashboard