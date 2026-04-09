export type ApiErrorResponse = {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
  details?: Record<string, string>
}

export type AppApiError = {
  status: number
  message: string
  details?: Record<string, string>
}
