import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './ui/AppLayout'
import { DashboardPage } from '../features/dashboard/pages/DashboardPage'
import { PlayersPage } from '../features/players/pages/PlayersPage'
import { MatchesPage } from '../features/matches/pages/MatchesPage.tsx'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { ProtectedRoute } from '../shared/components/ProtectedRoute'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route
          path="players"
          element={
            <ProtectedRoute>
              <PlayersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="matches"
          element={
            <ProtectedRoute>
              <MatchesPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
