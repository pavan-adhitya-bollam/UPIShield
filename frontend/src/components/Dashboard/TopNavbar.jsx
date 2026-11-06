import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, Sun, Moon, User, Menu, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Card from '../Card'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const TopNavbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const notifications = [
    { id: 1, title: 'Fraud Alert', message: 'Suspicious transaction detected', time: '2h ago', unread: true },
    { id: 2, title: 'Payment Success', message: '₹2,499 paid to Amazon', time: '3h ago', unread: true },
    { id: 3, title: 'Low Balance', message: 'Balance below ₹5,000', time: '5h ago', unread: false },
  ]

  return (
    <header className="h-16 bg-dark-800/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            aria-label="Toggle dashboard menu"
            className="p-2 rounded-lg hover:bg-white/5 transition-colors shrink-0"
          >
            <Menu className="w-5 h-5 text-gray-400" />
          </button>
          
          <div className="hidden md:flex items-center gap-2">
            <span className="text-gray-400 text-sm">{currentTime}</span>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search transactions, reports..."
              className="w-full pl-10 pr-4 py-2 bg-dark-600/50 border border-white/10 rounded-xl 
                       focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 
                       transition-all duration-300 placeholder-gray-500 text-sm text-white"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications)
                setShowProfile(false)
              }}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-gray-400" />
              {notifications.some(n => n.unread) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-12 w-80 z-50"
                >
                  <Card className="p-4">
                    <h3 className="font-semibold text-white mb-3">Notifications</h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg ${
                            notification.unread ? 'bg-primary-500/10' : 'bg-white/5'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-white text-sm">{notification.title}</p>
                              <p className="text-gray-400 text-xs mt-1">{notification.message}</p>
                            </div>
                            <span className="text-gray-500 text-xs">{notification.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(!showProfile)
                setShowNotifications(false)
              }}
              className="flex items-center gap-2 p-1 pr-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center overflow-hidden">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-sm font-medium">
                    {(user?.fullName || user?.name || user?.firstName || 'U').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-12 w-56 z-50"
                >
                  <Card className="p-2">
                    <div className="px-3 py-2 border-b border-white/10 mb-2">
                      <p className="font-medium text-white">{user?.fullName || user?.name || user?.firstName || 'User'}</p>
                      <p className="text-gray-400 text-xs">{user?.email || 'user@example.com'}</p>
                    </div>
                    <Link to="/profile" className="block w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                      View Profile
                    </Link>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                      Settings
                    </button>
                    <button onClick={async () => { await logout(); navigate('/login', { replace: true }) }} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                      Logout
                    </button>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopNavbar
