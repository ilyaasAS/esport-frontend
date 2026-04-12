import axios from 'axios'

/** True si l’API a répondu 401 (non authentifié / token absent ou invalide). */
export function isAxiosUnauthorized(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401
}
