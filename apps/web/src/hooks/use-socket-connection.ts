import { io, Socket } from 'socket.io-client'
import { getToken } from '../utils/auth'
import { useSessionActions, useSocketSession, useUserSession } from '../stores/session'
import { useEffect, useRef } from 'react'

const SOCKET_URL = import.meta.env.VITE_API_SOCKET || 'ws://localhost:3000'

export function useSocketConnect() {
  const token = getToken()
  const storedSocket = useSocketSession()
  const user = useUserSession()
  const { setSocket } = useSessionActions()
  const socketRef = useRef<Socket | null>(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    if (!token) {
      console.warn('⚠️ Sem token, socket não será conectado')
      return
    }

    if (isInitialized.current) {
      return
    }

    if (storedSocket?.connected) {
      console.log('✅ Usando socket existente:', storedSocket.id)
      socketRef.current = storedSocket
      isInitialized.current = true
      return
    }

    console.log('🔌 Criando nova conexão socket...')
    const newSocket = io(`${SOCKET_URL}/api/notifications`, {
      auth: { token, userId: user?.id },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    newSocket.on('connect', () => {
      console.log('✅ Socket conectado:', newSocket.id)
    })

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket desconectado:', reason)
    })

    newSocket.on('connect_error', (error) => {
      console.error('🔴 Erro de conexão:', error)
    })

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconectado após', attemptNumber, 'tentativas')
    })

    socketRef.current = newSocket
    setSocket(newSocket)
    isInitialized.current = true

    return () => {
      console.log('🧹 Limpando socket...')
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
      isInitialized.current = false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return socketRef.current || storedSocket
}
