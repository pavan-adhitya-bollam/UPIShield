import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext(null)
const DEFAULT_THEME = 'dark'

const getStoredTheme = (userId) => {
  const key = userId ? `upi-shield-theme-${userId}` : 'upi-shield-theme'
  return localStorage.getItem(key) || localStorage.getItem('upi-shield-theme') || DEFAULT_THEME
}

export const ThemeProvider = ({ children, userId }) => {
  const [theme, setThemeState] = useState(() => getStoredTheme(userId))

  useEffect(() => {
    const nextTheme = getStoredTheme(userId)
    setThemeState(nextTheme)
  }, [userId])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.body.classList.toggle('light-theme', theme === 'light')
    document.body.classList.toggle('dark-theme', theme === 'dark')
  }, [theme])

  const setTheme = (nextTheme) => {
    const normalizedTheme = nextTheme === 'light' ? 'light' : 'dark'
    const key = userId ? `upi-shield-theme-${userId}` : 'upi-shield-theme'
    localStorage.setItem(key, normalizedTheme)
    localStorage.setItem('upi-shield-theme', normalizedTheme)
    setThemeState(normalizedTheme)
  }

  const value = useMemo(() => ({
    theme,
    isDark: theme === 'dark',
    setTheme,
    toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark')
  }), [theme, userId])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
