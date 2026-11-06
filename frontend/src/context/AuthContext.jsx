import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
      authService.getCurrentUser()
        .then((response) => {
          const currentUser = response.data?.data
          if (currentUser) {
            setUser(currentUser)
            localStorage.setItem('user', JSON.stringify(currentUser))
          }
        })
        .catch(() => {
          localStorage.removeItem('user')
          localStorage.removeItem('token')
          setUser(null)
          setIsAuthenticated(false)
        })
    }
    setLoading(false)
  }, [])

  const login = (userData, token) => {
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', token)
  }

  const logout = async () => {
    try {
      if (localStorage.getItem('token')) await authService.logout()
    } catch {
      // The local session must still be cleared if the server is unavailable.
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }

  const updateUser = (userData) => {
    setUser((currentUser) => {
      const updatedUser = { ...currentUser, ...userData }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      return updatedUser
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        isAuthenticated,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
