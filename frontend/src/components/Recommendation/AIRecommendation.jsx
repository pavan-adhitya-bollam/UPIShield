import { motion } from 'framer-motion'
import { CheckCircle, Shield, XCircle, AlertTriangle, Brain } from 'lucide-react'
import Card from '../Card'

const AIRecommendation = ({ riskLevel = 'LOW', recommendation = {} }) => {
  const getRecommendationConfig = (level) => {
    switch (level) {
      case 'LOW':
        return {
          title: 'Proceed Normally',
          description: 'Transaction is safe to proceed without additional verification',
          color: 'green',
          gradient: 'from-green-500 to-green-600',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30',
          textColor: 'text-green-400',
          icon: CheckCircle
        }
      case 'NO_HISTORY':
        return {
          title: 'Proceed Normally',
          description: 'Transaction is safe to proceed without additional verification',
          color: 'blue',
          gradient: 'from-blue-500 to-blue-600',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500/30',
          textColor: 'text-blue-300',
          icon: Shield
        }
      case 'MEDIUM':
        return {
          title: 'Require OTP Verification',
          description: 'Additional verification recommended for security',
          color: 'yellow',
          gradient: 'from-yellow-500 to-yellow-600',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/30',
          textColor: 'text-yellow-400',
          icon: Shield
        }
      case 'HIGH':
        return {
          title: 'Block Transaction',
          description: 'Transaction blocked due to high fraud risk',
          color: 'red',
          gradient: 'from-red-500 to-red-600',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/30',
          textColor: 'text-red-400',
          icon: XCircle
        }
      case 'CRITICAL':
        return {
          title: 'Freeze Transaction',
          description: 'Account frozen pending manual review',
          color: 'purple',
          gradient: 'from-purple-500 to-purple-600',
          bgColor: 'bg-purple-500/20',
          borderColor: 'border-purple-500/30',
          textColor: 'text-purple-400',
          icon: AlertTriangle
        }
      default:
        return {
          title: 'Proceed Normally',
          description: 'Transaction is safe to proceed without additional verification',
          color: 'green',
          gradient: 'from-green-500 to-green-600',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30',
          textColor: 'text-green-400',
          icon: CheckCircle
        }
    }
  }

  const config = getRecommendationConfig(riskLevel)
  const RecommendationIcon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-semibold text-white">AI Recommendation</h3>
        </div>

        <div className={`p-6 rounded-xl bg-gradient-to-r ${config.gradient} border ${config.borderColor} mb-4`}>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-xl flex-shrink-0">
              <RecommendationIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-white mb-2">{config.title}</h4>
              <p className="text-white/90">{config.description}</p>
            </div>
          </div>
        </div>

        {/* Risk Level Badge */}
        <div className={`flex items-center justify-center gap-2 p-4 rounded-xl ${config.bgColor} border ${config.borderColor}`}>
          <RecommendationIcon className={`w-5 h-5 ${config.textColor}`} />
          <span className={`text-lg font-semibold ${config.textColor}`}>
            {riskLevel} RISK LEVEL
          </span>
        </div>

        {/* AI Analysis Info */}
        <div className="mt-4 p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary-400" />
            <p className="text-sm text-gray-300">
              This recommendation is based on ML model analysis of transaction patterns, user behavior, and historical data
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default AIRecommendation
