import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], // Array of allowed roles, empty means any authenticated user
  redirectPath = '/signin' 
}) => {
  const { user, userRole, loading } = useAuth()

  // If still loading, show a loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to={redirectPath} replace />
  }
  
  // If roles are specified and user's role doesn't match, redirect to dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />
  }
  
  // If all checks pass, render the protected component
  return children
}

export default ProtectedRoute