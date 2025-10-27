import axios from 'axios'
import { clearToken, getToken, setToken } from './auth'
import { useSessionActions } from '../stores/session'
import { toast } from 'sonner'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true
})

// Adiciona AccessToken em todas as requsições
api.interceptors.request.use((config) => {
  const token = getToken()
  console.log(token)
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
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/refresh`,
          {},
          {
            withCredentials: true,
          }
        );
        
        setToken(data.accessToken)

        originalRequest.headers.Authorization = `Bearer ${data.access_token}`
        return api(originalRequest)
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);

        const { logout } = useSessionActions();
        clearToken();
        logout();

        toast.error('Your session has expired. Please login again.');
        window.location.href = '/auth';

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error)
  }
)

export default api
