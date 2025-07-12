import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// This is a router component that redirects to the appropriate dashboard based on user role
const Dashboard = () => {
  const { user, userRole, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user && userRole) {
      switch (userRole) {
        case 'admin':
          navigate('/admin')
          break
        case 'manager':
          navigate('/manager')
          break
        case 'client':
          navigate('/client')
          break
        case 'participant':
          navigate('/participant')
          break
        default:
          // Default to client dashboard if role is unknown
          navigate('/client')
      }
    }
  }, [loading, user, userRole, navigate])

  // Show loading state while determining where to redirect
  if (loading || !userRole) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // This should not be visible as the useEffect should redirect
  return null
}

export default Dashboard