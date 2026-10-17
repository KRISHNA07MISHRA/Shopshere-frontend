import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser, getToken, logout as logoutService } from '../services/AuthService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      if (!getToken()) {
        setLoading(false)
        return
      }

      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch {
        logoutService()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  function logout() {
    logoutService()
    setUser(null)
  }

  const value = {
    user,
    loading,
    setUser,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Context modules intentionally export both the provider and its consumer hook.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
return useContext(AuthContext)
}