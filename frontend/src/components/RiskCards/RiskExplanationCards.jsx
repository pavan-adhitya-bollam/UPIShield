import { motion } from 'framer-motion'
import { Check, X, AlertTriangle, Smartphone, MapPin, TrendingUp, UserPlus, Activity } from 'lucide-react'
import Card from '../Card'

const RiskExplanationCards = ({ cards = [] }) => {
  const getIcon = (feature) => {
    switch (feature) {
      case 'Behaviour Deviation': return Activity
      case 'Device Changed': return Smartphone
      case 'New Beneficiary': return UserPlus
      case 'Transaction Velocity': return TrendingUp
      case 'Location Changed': return MapPin
      case 'Large Amount': return TrendingUp
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

  const detectedCount = cards.filter(c => c.detected).length

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
            Risk Analysis
          </h3>
          <span className={`text-sm px-2 py-1 rounded-full ${
            detectedCount > 0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
          }`}>
            {detectedCount} detected
          </span>
        </div>

        <div className="space-y-3">
          {cards.map((card, index) => {
            const Icon = getIcon(card.feature)
            const severityColor = getSeverityColor(card.severity)

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-xl border transition-all duration-200
                  ${card.detected 
                    ? severityColor 
                    : 'bg-white/5 border-white/10 opacity-60'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${card.detected ? severityColor : 'bg-gray-500/20'} flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${card.detected ? severityColor.split(' ')[0] : 'text-gray-500'}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-medium ${card.detected ? 'text-white' : 'text-gray-400'}`}>
                        {card.feature}
                      </h4>
                      <span className={`text-sm font-semibold ${card.detected ? severityColor.split(' ')[0] : 'text-gray-500'}`}>
                        {card.riskWeight}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{card.explanation}</p>
                    
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        card.detected 
                          ? severityColor 
                          : 'bg-gray-500/20 text-gray-500'
                      }`}>
                        {card.detected ? 'Detected' : 'Not Detected'}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        card.detected 
                          ? severityColor 
                          : 'bg-gray-500/20 text-gray-500'
                      }`}>
                        {card.severity} Severity
                      </div>
                    </div>
                  </div>

                  <div className={`p-2 rounded-full ${card.detected ? 'bg-red-500/20' : 'bg-green-500/20'} flex-shrink-0`}>
                    {card.detected ? (
                      <X className="w-4 h-4 text-red-400" />
                    ) : (
                      <Check className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {detectedCount === 0 && (
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-green-400 font-medium">No Risk Factors Detected</p>
                <p className="text-gray-400 text-sm">Transaction passed all security checks</p>
              </div>
            </div>
          </div>
        )}

        {detectedCount > 0 && (
          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-yellow-400 font-medium">
                  {detectedCount} Risk Factor{detectedCount > 1 ? 's' : ''} Detected
                </p>
                <p className="text-gray-400 text-sm">
                  Review the detected factors before proceeding
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

export default RiskExplanationCards
