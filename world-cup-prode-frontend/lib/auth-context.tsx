"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import {
  clearToken,
  getToken,
  login as apiLogin,
  registrarUsuario,
  type LoginPayload,
  type RegistroPayload,
} from "@/lib/api"

interface SessionUser {
  apodo: string
}

interface AuthContextValue {
  token: string | null
  user: SessionUser | null
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegistroPayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const USER_KEY = "prode_user"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null)
  const [user, setUser] = useState<SessionUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const t = getToken()
    if (t) setTokenState(t)
    const u = window.localStorage.getItem(USER_KEY)
    if (u) {
      try {
        setUser(JSON.parse(u))
      } catch {
        // ignore
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (payload: LoginPayload) => {
    const t = await apiLogin(payload)
    setTokenState(t)
    const sessionUser = { apodo: payload.correo }
    setUser(sessionUser)
    window.localStorage.setItem(USER_KEY, JSON.stringify(sessionUser))
  }, [])

  const register = useCallback(
    async (payload: RegistroPayload) => {
      await registrarUsuario(payload)
      // Tras registrarse, iniciamos sesión automáticamente.
      await login({ correo: payload.correo, password: payload.password })
      const sessionUser = { apodo: payload.apodo }
      setUser(sessionUser)
      window.localStorage.setItem(USER_KEY, JSON.stringify(sessionUser))
    },
    [login],
  )

  const logout = useCallback(() => {
    clearToken()
    window.localStorage.removeItem(USER_KEY)
    setTokenState(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ token, user, isLoading, login, register, logout }),
    [token, user, isLoading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>")
  return ctx
}
