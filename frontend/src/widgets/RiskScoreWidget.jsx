import { motion } from 'framer-motion'
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react'
import Card from '../components/Card'

const RiskScoreWidget = ({ score, status = 'LOW' }) => {
  const hasRiskData = Number.isFinite(score)
  const circumference = 2 * Math.PI * 54 // radius = 54
  const offset = hasRiskData ? circumference - (score / 100) * circumference : circumference

  const getStatusColor = (status) => {
    switch (status) {
      case 'LOW':
        return { text: 'text-green-400', bg: 'bg-green-500', icon: CheckCircle }
      case 'MEDIUM':
        return { text: 'text-yellow-400', bg: 'bg-yellow-500', icon: AlertTriangle }
      case 'HIGH':
        return { text: 'text-red-400', bg: 'bg-red-500', icon: AlertTriangle }
      default:
        return { text: 'text-green-400', bg: 'bg-green-500', icon: CheckCircle }
    }
  }

  const statusConfig = getStatusColor(status)
  const StatusIcon = statusConfig.icon

  if (!hasRiskData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <div className="flex flex-col items-center text-center">
            <StatusIcon className="w-10 h-10 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-white">Risk Score</h3>
            <p className="mt-2 text-sm text-gray-400">No transaction risk data yet</p>
          </div>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex flex-col items-center">
          <div className="relative">
            {/* Background Circle */}
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="54"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="12"
                fill="none"
              />
              {/* Progress Circle */}
              <motion.circle
                cx="72"
                cy="72"
                r="54"
                stroke={statusConfig.bg.replace('bg-', '')}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: offset
                }}
                className={statusConfig.bg}
              />
            </svg>
            
            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-white">{score}%</span>
              <span className={`text-sm font-medium ${statusConfig.text}`}>{status}</span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <StatusIcon className={`w-5 h-5 ${statusConfig.text}`} />
              <h3 className="text-lg font-semibold text-white">Risk Score</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Your account security is {status.toLowerCase()}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default RiskScoreWidget
