import { motion } from 'framer-motion'
import { ArrowRight, LogIn, AlertTriangle, CheckCircle, XCircle, ArrowDownLeft } from 'lucide-react'
import Card from '../Card'

const LiveActivityPanel = ({ activities = [] }) => {
  const getActivityConfig = (type) => {
    switch (type) {
      case 'Transaction':
        return { icon: ArrowRight, color: 'text-primary-400', bg: 'bg-primary-500/20' }
      case 'Login':
        return { icon: LogIn, color: 'text-blue-400', bg: 'bg-blue-500/20' }
      case 'Fraud':
        return { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/20' }
      case 'Success':
        return { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' }
      case 'Failed':
        return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20' }
      default:
        return { icon: ArrowRight, color: 'text-gray-400', bg: 'bg-gray-500/20' }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Live Activity
        </h3>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activities.map((activity, index) => {
            const config = getActivityConfig(activity.type)
            const Icon = config.icon

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className={`p-2 rounded-lg ${config.bg} flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <button className="w-full mt-4 text-sm text-primary-400 hover:text-primary-300 transition-colors">
          View All Activity
        </button>
      </Card>
    </motion.div>
  )
}

export default LiveActivityPanel
