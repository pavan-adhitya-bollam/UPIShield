import { motion } from 'framer-motion'
import { AlertTriangle, Shield, XCircle, Clock } from 'lucide-react'
import Card from '../Card'

const RecentFraudAlerts = ({ alerts = [] }) => {
  const getAlertConfig = (type) => {
    switch (type) {
      case 'High Risk':
        return { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' }
      case 'Medium Risk':
        return { icon: Shield, color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' }
      case 'Blocked':
        return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' }
      case 'OTP Required':
        return { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' }
      default:
        return { icon: AlertTriangle, color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/30' }
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
          <AlertTriangle className="w-5 h-5 text-red-400" />
          Recent Fraud Alerts
        </h3>

        <div className="space-y-3">
          {alerts.map((alert, index) => {
            const config = getAlertConfig(alert.type)
            const Icon = config.icon

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded-lg border ${config.border} ${config.bg}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${config.bg}`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${config.color}`}>{alert.type}</span>
                      <span className="text-xs text-gray-500">{alert.time}</span>
                    </div>
                    <p className="text-sm text-gray-300">{alert.message}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <button className="w-full mt-4 text-sm text-primary-400 hover:text-primary-300 transition-colors">
          View All Alerts
        </button>
      </Card>
    </motion.div>
  )
}

export default RecentFraudAlerts
