import { httpClient } from '../../../shared/api/httpClient'
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/auth'

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await httpClient.post<AuthResponse>('/auth/login', payload)
  return response.data
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await httpClient.post<AuthResponse>('/auth/register', payload)
  return response.data
}
