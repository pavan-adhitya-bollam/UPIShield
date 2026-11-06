import { motion } from 'framer-motion'
import { Bell, CheckCircle, AlertTriangle, Info, X } from 'lucide-react'
import Card from '../components/Card'

const NotificationsPanel = ({ notifications = [] }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'fraud': return AlertTriangle
      case 'success': return CheckCircle
      case 'warning': return AlertTriangle
      case 'info': return Info
      default: return Bell
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'fraud': return { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400' }
      case 'success': return { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400' }
      case 'warning': return { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400' }
      case 'info': return { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400' }
      default: return { bg: 'bg-gray-500/20', border: 'border-gray-500/30', text: 'text-gray-400' }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary-400" />
            Notifications
          </h3>
          <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
            Mark all read
          </button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400">No notifications</p>
            </div>
          ) : (
            notifications.map((notification, index) => {
              const Icon = getNotificationIcon(notification.type)
              const colorConfig = getNotificationColor(notification.type)
              
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 rounded-lg border ${colorConfig.bg} ${colorConfig.border} ${!notification.read ? 'border-l-4 border-l-primary-500' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${colorConfig.bg} flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${colorConfig.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-white text-sm">{notification.title}</p>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2">{notification.message}</p>
                      <p className="text-gray-500 text-xs mt-2">{notification.time}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </Card>
    </motion.div>
  )
}

export default NotificationsPanel
