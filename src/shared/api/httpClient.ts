import axios from 'axios'
import { readAuthToken } from '../../features/auth/services/authStorage'

export const httpClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use((config) => {
  const token = readAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
