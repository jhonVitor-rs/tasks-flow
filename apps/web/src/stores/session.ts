// import type { INotification } from "@repo/core"
import type { Socket } from "socket.io-client"
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
  socket: Socket | null
  // listeners: Map<string, Set<(data: INotification) => void>>

  actions: {
    setUser: (user: User | null) => void
    logout: () => void
    setSocket: (socket: Socket) => void
  }
}

const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      socket: null,
      // listeners: new Map<string, Set<(data: INotification) => void>>(),

      actions: {
        setUser: (user) => set({ user: user, isAuthenticated: !!user }),
        logout: () => {
          const { socket } = get()
          if (socket) {
            socket.disconnect()
          }
          set({ user: null, isAuthenticated: false })
        },
        setSocket: (socket) => set({socket: socket})
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
export const useSocketSession = () => useSessionStore((state) => state.socket)
// export const useListenerSession = () => useSessionStore((state) => state.listeners)
export const useSessionActions = () => useSessionStore((state) => state.actions)
