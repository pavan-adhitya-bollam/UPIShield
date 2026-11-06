import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, User, Moon, Sun, Menu, ChevronDown } from 'lucide-react'
import Card from '../Card'

const AdminTopNavbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatDateTime = (date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-dark-800/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30"
    >
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-400" />
          </button>
          
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-dark-700/50 border border-white/10 rounded-xl px-4 py-2 w-80">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search transactions, users..."
              className="bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm w-full"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Date/Time */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-400">
            <span>{formatDateTime(currentTime)}</span>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isDarkMode ? (
              <Moon className="w-5 h-5 text-gray-400" />
            ) : (
              <Sun className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
            >
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-12 w-80"
                >
                  <Card>
                    <div className="p-4 border-b border-white/10">
                      <h3 className="font-semibold text-white">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {[1, 2, 3].map((item) => (
                        <div
                          key={item}
                          className="p-4 border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 mt-2 bg-red-500 rounded-full" />
                            <div>
                              <p className="text-sm text-white">High risk transaction detected</p>
                              <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-white/10">
                      <button className="text-sm text-primary-400 hover:text-primary-300 w-full text-center">
                        View All Notifications
                      </button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-white text-sm font-medium">AD</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-12 w-56"
                >
                  <Card>
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                          <span className="text-white font-medium">AD</span>
                        </div>
                        <div>
                          <p className="font-medium text-white">Admin User</p>
                          <p className="text-xs text-gray-500">admin@upifraud.com</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">Profile Settings</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left text-red-400">
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default AdminTopNavbar
