import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  ArrowRightLeft,
  ShieldAlert,
  BarChart3,
  Brain,
  FileText,
  Bell,
  Settings,
  LogOut,
  X,
  Menu
} from 'lucide-react'
import { adminSidebarItems } from '../../data/adminDashboardData'

const iconMap = {
  LayoutDashboard,
  Users,
  ArrowRightLeft,
  ShieldAlert,
  BarChart3,
  Brain,
  FileText,
  Bell,
  Settings
}

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation()
  const [activeItem, setActiveItem] = useState(location.pathname)

  const handleItemClick = (path) => {
    setActiveItem(path)
    if (window.innerWidth < 1024) {
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed top-0 left-0 h-full w-72 bg-dark-800 border-r border-white/10 z-50 lg:relative lg:translate-x-0 ${
          !isOpen && 'lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h1 className="text-xl font-bold gradient-text">Admin Panel</h1>
              <p className="text-xs text-gray-500 mt-1">UPI Fraud Detection</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {adminSidebarItems.map((item) => {
              const Icon = iconMap[item.icon]
              const isActive = activeItem === item.path

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => handleItemClick(item.path)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive
                      ? 'bg-gradient-primary text-white shadow-lg shadow-primary-500/20'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-2 h-2 rounded-full bg-white"
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default AdminSidebar
