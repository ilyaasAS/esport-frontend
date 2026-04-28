export type ApiErrorResponse = {
  timestamp: string
  status: number
  error: string
  errorCode: string
  message: string
  path: string
  details?: Record<string, string>
}

export type AppApiError = {
  status: number
  message: string
  errorCode?: string
  details?: Record<string, string>
}
