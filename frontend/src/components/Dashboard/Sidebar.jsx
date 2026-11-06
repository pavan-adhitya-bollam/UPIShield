import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard,
  Send,
  History,
  Shield,
  BarChart3,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', route: '/dashboard' },
    { icon: Send, label: 'Send Money', route: '/send-money' },
    { icon: History, label: 'Transactions', route: '/transactions' },
    { icon: Shield, label: 'Fraud Detection', route: '/fraud-detection' },
    { icon: BarChart3, label: 'Analytics', route: '/analytics' },
    { icon: User, label: 'Analyst', route: '/analyst' },
    { icon: Bell, label: 'Notifications', route: '/notifications' },
    { icon: User, label: 'Profile', route: '/profile' },
    { icon: Settings, label: 'Settings', route: '/settings' },
  ]

  const isActive = (route) => location.pathname === route

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -280,
          width: isOpen ? 280 : 0
        }}
        className="fixed left-0 top-0 h-full bg-dark-800/95 backdrop-blur-xl border-r border-white/10 z-50 lg:fixed lg:block"
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">UPI Shield</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.route}
                  to={item.route}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive(item.route)
                      ? 'bg-gradient-primary text-white shadow-lg shadow-primary-500/25'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive(item.route) && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={async () => { await logout(); navigate('/login', { replace: true }) }}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar
