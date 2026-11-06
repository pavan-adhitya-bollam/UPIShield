import { motion } from 'framer-motion'
import { AlertTriangle, Shield, Eye, XCircle } from 'lucide-react'
import Card from '../components/Card'

const FraudAlertWidget = ({ alerts = [] }) => {
  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'HIGH':
        return { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400', icon: XCircle }
      case 'MEDIUM':
        return { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400', icon: AlertTriangle }
      case 'LOW':
        return { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400', icon: Shield }
      default:
        return { bg: 'bg-gray-500/20', border: 'border-gray-500/30', text: 'text-gray-400', icon: AlertTriangle }
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
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Fraud Alerts
          </h3>
          <span className="text-sm text-gray-400">{alerts.length} active</span>
        </div>

        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-green-400 mx-auto mb-2" />
              <p className="text-gray-400">No fraud alerts</p>
            </div>
          ) : (
            alerts.map((alert, index) => {
              const riskConfig = getRiskLevelColor(alert.riskLevel)
              const RiskIcon = riskConfig.icon

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border ${riskConfig.bg} ${riskConfig.border}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <RiskIcon className={`w-4 h-4 ${riskConfig.text}`} />
                      <span className={`text-sm font-medium ${riskConfig.text}`}>
                        {alert.riskLevel} RISK
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-300">
                      Transaction ID: <span className="text-white font-mono">{alert.transactionId}</span>
                    </p>
                    <p className="text-sm text-gray-300">
                      Probability: <span className="text-white font-semibold">{alert.probability}%</span>
                    </p>
                    <p className="text-sm text-gray-300">
                      Action: <span className="text-white">{alert.suggestedAction}</span>
                    </p>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 px-3 py-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white">
                      <Eye className="w-3 h-3 inline mr-1" />
                      View
                    </button>
                    <button className="flex-1 px-3 py-1.5 text-xs font-medium bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-red-400">
                      Take Action
                    </button>
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

export default FraudAlertWidget
