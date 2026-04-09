export type UserRole = 'USER' | 'ADMIN'

export type AuthUser = {
  username: string
  role: UserRole
}

export type AuthState = {
  token: string
  user: AuthUser
}

export type LoginPayload = {
  username: string
  password: string
}

export type RegisterPayload = {
  username: string
  password: string
}

export type AuthResponse = {
  token: string
  type: string
  username: string
  role: UserRole
}
