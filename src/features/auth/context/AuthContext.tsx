import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { login as loginRequest, register as registerRequest } from '../services/authApi'
import { clearAuthState, readAuthState, saveAuthState } from '../services/authStorage'
import type { AuthState, AuthUser, LoginPayload, RegisterPayload, UserRole } from '../types/auth'

type AuthContextValue = {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  role: UserRole | null
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState | null>(() => readAuthState())

  const login = async (payload: LoginPayload) => {
    const response = await loginRequest(payload)
    const nextState: AuthState = {
      token: response.token,
      user: {
        username: response.username,
        role: response.role,
      },
    }
    saveAuthState(nextState)
    setAuthState(nextState)
  }

  const register = async (payload: RegisterPayload) => {
    const response = await registerRequest(payload)
    const nextState: AuthState = {
      token: response.token,
      user: {
        username: response.username,
        role: response.role,
      },
    }
    saveAuthState(nextState)
    setAuthState(nextState)
  }

  const logout = () => {
    clearAuthState()
    setAuthState(null)
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      token: authState?.token ?? null,
      user: authState?.user ?? null,
      isAuthenticated: Boolean(authState?.token),
      role: authState?.user.role ?? null,
      login,
      register,
      logout,
    }),
    [authState],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider.")
  }
  return context
}
