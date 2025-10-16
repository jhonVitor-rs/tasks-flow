import axios from 'axios'
import { getToken, setToken } from './auth'
import { useSessionActions } from '../stores/session'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
})

// Adiciona AccessToken em todas as requsições
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Intercepta respostas 401 e tenta refresh
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = sessionStorage.getItem('refresh_token')
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refreshToken: refreshToken }
        )

        setToken(data.access_token)
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`
        return api(originalRequest)
      } catch {
        const { logout } = useSessionActions()
        logout()
        window.location.href = '/auth'
      }
    }

    return Promise.reject(error)
  }
)

export default api
