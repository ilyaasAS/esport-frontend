import axios from 'axios'
import type { ApiErrorResponse, AppApiError } from './types'

export function toAppApiError(error: unknown): AppApiError {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const payload = error.response?.data
    if (payload && typeof payload === 'object') {
      return {
        status: payload.status ?? error.response?.status ?? 500,
        message: payload.message ?? "Une erreur API inattendue s'est produite.",
        details: payload.details,
      }
    }
  }

  return {
    status: 500,
    message: "Erreur réseau. Veuillez réessayer.",
  }
}
