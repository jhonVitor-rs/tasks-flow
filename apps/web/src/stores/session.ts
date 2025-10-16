import { create } from "zustand"
import { persist } from "zustand/middleware"

type User = {
  id: string
  name: string
  email: string
}

interface SessionState {
  user: User | null
  isAuthenticated: boolean

  actions: {
    setUser: (user: User | null) => void
    logout: () => void
  }
}

const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      actions: {
        setUser: (user) => set({ user: user, isAuthenticated: !!user }),
        logout: () => set({user: null, isAuthenticated: false})
      }
    }),
    {
      name: "session-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

export const useUserSession = () => useSessionStore((state) => state.user)
export const useSessionAuthenticated = () => useSessionStore((state) => state.isAuthenticated)
export const useSessionActions = () => useSessionStore((state) => state.actions)
