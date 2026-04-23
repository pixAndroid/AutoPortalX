'use client'

import { createContext, useContext } from 'react'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
  companyId: string | null
  company?: { id: string; name: string; logo?: string; timezone: string } | null
}

export interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  refresh: async () => {},
})

export const useAuth = () => useContext(AuthContext)
