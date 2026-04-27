import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (token) {
      api.getProfile().then(data => setIsAdmin(!!data.admin)).catch(() => setIsAdmin(false))
    } else {
      setIsAdmin(false)
    }
  }, [token])

  function login(newToken, user) {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    if (user) setIsAdmin(!!user.admin)
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ token, isLoggedIn: !!token, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
