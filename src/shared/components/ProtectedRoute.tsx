import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/context/AuthContext'
import type { UserRole } from '../../features/auth/types/auth.types'

type ProtectedRouteProps = {
  children: ReactNode
  requiredRole?: UserRole
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
