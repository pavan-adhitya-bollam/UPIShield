import { motion } from 'framer-motion'
import { Bell, AlertTriangle, User, Brain, XCircle, Check } from 'lucide-react'
import Card from '../Card'

const NotificationsPanel = ({ notifications = [] }) => {
  const getNotificationConfig = (type) => {
    switch (type) {
      case 'High Risk':
        return { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' }
      case 'New User':
        return { icon: User, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' }
      case 'Model Update':
        return { icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30' }
      case 'OTP Failed':
        return { icon: XCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' }
      case 'System':
        return { icon: Bell, color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/30' }
      default:
        return { icon: Bell, color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/30' }
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
            Mark all as read
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.map((notification, index) => {
            const config = getNotificationConfig(notification.type)
            const Icon = config.icon

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded-lg border ${config.border} ${config.bg} ${!notification.read ? 'border-l-4 border-l-primary-500' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${config.bg} flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${config.color}`}>{notification.type}</span>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-300">{notification.message}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        <button className="w-full mt-4 text-sm text-primary-400 hover:text-primary-300 transition-colors">
          View All Notifications
        </button>
      </Card>
    </motion.div>
  )
}

export default NotificationsPanel
