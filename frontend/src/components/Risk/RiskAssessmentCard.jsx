import { motion } from 'framer-motion'
import { Shield, AlertTriangle, CheckCircle, Brain } from 'lucide-react'
import Card from '../Card'

const RiskAssessmentCard = ({ riskProbability = 18, riskLevel = 'LOW', confidence = 94 }) => {
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (riskProbability / 100) * circumference

  const getRiskConfig = (level) => {
    switch (level) {
      case 'LOW':
        return {
          color: '#10b981',
          bgColor: 'bg-green-500',
          textColor: 'text-green-400',
          icon: CheckCircle,
          status: 'Safe Transaction'
        }
      case 'MEDIUM':
        return {
          color: '#f59e0b',
          bgColor: 'bg-yellow-500',
          textColor: 'text-yellow-400',
          icon: AlertTriangle,
          status: 'Caution Required'
        }
      case 'HIGH':
        return {
          color: '#ef4444',
          bgColor: 'bg-red-500',
          textColor: 'text-red-400',
          icon: AlertTriangle,
          status: 'High Risk'
        }
      default:
        return {
          color: '#10b981',
          bgColor: 'bg-green-500',
          textColor: 'text-green-400',
          icon: CheckCircle,
          status: 'Safe Transaction'
        }
    }
  }

  const riskConfig = getRiskConfig(riskLevel)
  const RiskIcon = riskConfig.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-semibold text-white">AI Risk Assessment</h3>
        </div>

        {/* Circular Progress */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="54"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="12"
                fill="none"
              />
              <motion.circle
                cx="72"
                cy="72"
                r="54"
                stroke={riskConfig.color}
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
                className={riskConfig.bgColor}
              />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{riskProbability}%</span>
              <span className={`text-sm font-medium ${riskConfig.textColor}`}>{riskLevel}</span>
            </div>
          </div>
        </div>

        {/* Risk Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2">
              <Shield className={`w-4 h-4 ${riskConfig.textColor}`} />
              <span className="text-gray-400 text-sm">Risk Level</span>
            </div>
            <span className={`font-semibold ${riskConfig.textColor}`}>{riskLevel}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary-400" />
              <span className="text-gray-400 text-sm">Confidence</span>
            </div>
            <span className="font-semibold text-white">{confidence}%</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2">
              <RiskIcon className={`w-4 h-4 ${riskConfig.textColor}`} />
              <span className="text-gray-400 text-sm">Status</span>
            </div>
            <span className={`font-semibold ${riskConfig.textColor}`}>{riskConfig.status}</span>
          </div>
        </div>

        {/* AI Analysis Badge */}
        <div className="mt-4 p-3 bg-gradient-primary/20 border border-primary-500/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary-400" />
            <p className="text-xs text-gray-300">
              AI-powered fraud detection using machine learning algorithms
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default RiskAssessmentCard
