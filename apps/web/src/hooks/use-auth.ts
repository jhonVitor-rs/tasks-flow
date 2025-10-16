import axios from "axios"
import { useSessionActions, useSessionAuthenticated, useUserSession } from "../stores/session"
import { clearToken, setToken } from "../utils/auth"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

export function useAuth() {
  const user = useUserSession()
  const isAuthenticated = useSessionAuthenticated()
  const actions = useSessionActions()

  async function login(email: string, password: string) {
    const { data } = await axios.post(`${API_URL}/auth/login`, {
      email, password
    })
    setToken(data.access_token)
    actions.setUser(data.user)
  }

  function signOut() {
    clearToken()
    actions.logout()
  }

  return {user, isAuthenticated, login, signOut}
}
