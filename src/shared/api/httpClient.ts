import axios, { AxiosHeaders } from 'axios'
import { readAuthToken } from '../../features/auth/services/authStorage'
import { getApiRootUrl } from './apiBaseUrl'

export const httpClient = axios.create({
  baseURL: getApiRootUrl(),
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use((config) => {
  const token = readAuthToken()
  if (token) {
    const headers = AxiosHeaders.from(config.headers ?? {})
    headers.set('Authorization', 'Bearer ' + token)
    config.headers = headers
  }
  return config
})
