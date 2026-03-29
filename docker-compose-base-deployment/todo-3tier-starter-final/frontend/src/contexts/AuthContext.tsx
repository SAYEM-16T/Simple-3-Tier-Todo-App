import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/client'
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '../types/auth'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setIsLoading(false)
      return
    }

    api
      .get<User>('/auth/me')
      .then((response) => setUser(response.data))
      .catch(() => {
        localStorage.removeItem('access_token')
        setUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  async function login(payload: LoginPayload) {
    const response = await api.post<AuthResponse>('/auth/login', {
      ...payload,
      email: normalizeEmail(payload.email)
    })
    localStorage.setItem('access_token', response.data.access_token)
    setUser(response.data.user)
  }

  async function register(payload: RegisterPayload) {
    const normalizedPayload = {
      ...payload,
      name: payload.name.trim(),
      email: normalizeEmail(payload.email)
    }

    await api.post('/auth/register', normalizedPayload)
    await login({ email: normalizedPayload.email, password: normalizedPayload.password })
  }

  function logout() {
    localStorage.removeItem('access_token')
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout }),
    [user, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
