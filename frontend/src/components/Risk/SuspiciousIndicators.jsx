import { motion } from 'framer-motion'
import { Check, X, AlertTriangle, Smartphone, MapPin, TrendingUp, UserPlus, Clock } from 'lucide-react'
import Card from '../Card'

const SuspiciousIndicators = ({ indicators = [] }) => {
  const getIcon = (label) => {
    switch (label) {
      case 'New Device': return Smartphone
      case 'New Beneficiary': return UserPlus
      case 'High Amount': return TrendingUp
      case 'High Velocity': return TrendingUp
      case 'Location Changed': return MapPin
      case 'Behaviour Deviation': return AlertTriangle
      default: return AlertTriangle
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'low': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const detectedCount = indicators.filter(i => i.detected).length

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
            Suspicious Indicators
          </h3>
          <span className={`text-sm px-2 py-1 rounded-full ${
            detectedCount > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
          }`}>
            {detectedCount} detected
          </span>
        </div>

        <div className="space-y-3">
          {indicators.map((indicator, index) => {
            const Icon = getIcon(indicator.label)
            const severityColor = getSeverityColor(indicator.severity)

            return (
              <motion.div
                key={indicator.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200
                  ${indicator.detected 
                    ? severityColor 
                    : 'bg-white/5 border-white/10'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${indicator.detected ? severityColor : 'bg-gray-500/20'}`}>
                    <Icon className={`w-4 h-4 ${indicator.detected ? severityColor.split(' ')[0] : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <p className={`font-medium ${indicator.detected ? 'text-white' : 'text-gray-400'}`}>
                      {indicator.label}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{indicator.severity} severity</p>
                  </div>
                </div>
                <div className={`p-2 rounded-full ${indicator.detected ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                  {indicator.detected ? (
                    <X className="w-4 h-4 text-red-400" />
                  ) : (
                    <Check className="w-4 h-4 text-green-400" />
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {detectedCount === 0 && (
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <p className="text-sm text-green-400">No suspicious activity detected</p>
            </div>
          </div>
        )}

        {detectedCount > 0 && (
          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <p className="text-sm text-yellow-400">
                {detectedCount} suspicious indicator{detectedCount > 1 ? 's' : ''} detected. Please review before proceeding.
              </p>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

export default SuspiciousIndicators
