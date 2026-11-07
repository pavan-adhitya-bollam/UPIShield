import { motion } from 'framer-motion'
import { Brain, Shield, AlertTriangle } from 'lucide-react'
import Card from '../Card'

const PredictionGauge = ({
  finalRiskScore = 0,
  mlFraudProbability = null,
  riskLevel = 'LOW',
  confidence = 96,
  prediction = 'SAFE'
}) => {
  const circumference = 2 * Math.PI * 80
  const safeRiskScore = Math.min(100, Math.max(0, Math.round(Number(finalRiskScore) || 0)))
  const offset = circumference - (safeRiskScore / 100) * circumference
  const formattedProbability = Number.isFinite(Number(mlFraudProbability))
    ? `${Number(mlFraudProbability).toFixed(2)}%`
    : '0.00%'
  const displayRiskLevel = riskLevel === 'NO_HISTORY' ? 'LOW' : riskLevel

  const getRiskConfig = (level) => {
    switch (level) {
      case 'LOW':
        return {
          color: '#10b981',
          bgColor: 'bg-green-500',
          textColor: 'text-green-400',
          icon: Shield,
          gradient: 'from-green-500 to-green-600'
        }
      case 'MEDIUM':
        return {
          color: '#f59e0b',
          bgColor: 'bg-yellow-500',
          textColor: 'text-yellow-400',
          icon: AlertTriangle,
          gradient: 'from-yellow-500 to-yellow-600'
        }
      case 'HIGH':
        return {
          color: '#ef4444',
          bgColor: 'bg-red-500',
          textColor: 'text-red-400',
          icon: AlertTriangle,
          gradient: 'from-red-500 to-red-600'
        }
      case 'CRITICAL':
        return {
          color: '#8b5cf6',
          bgColor: 'bg-purple-500',
          textColor: 'text-purple-400',
          icon: AlertTriangle,
          gradient: 'from-purple-500 to-purple-600'
        }
      case 'NO_HISTORY':
        return {
          color: '#60a5fa',
          bgColor: 'bg-blue-500',
          textColor: 'text-blue-300',
          icon: Shield,
          gradient: 'from-blue-500 to-blue-600'
        }
      default:
        return {
          color: '#10b981',
          bgColor: 'bg-green-500',
          textColor: 'text-green-400',
          icon: Shield,
          gradient: 'from-green-500 to-green-600'
        }
    }
  }

  const riskConfig = getRiskConfig(displayRiskLevel)
  const RiskIcon = riskConfig.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Brain className="w-6 h-6 text-primary-400" />
          <h2 className="text-xl font-semibold text-white">AI Fraud Prediction</h2>
        </div>

        {/* Circular Gauge */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            {/* Background Circle */}
            <svg className="w-56 h-56 transform -rotate-90">
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
              <circle
                cx="112"
                cy="112"
                r="80"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="16"
                fill="none"
              />
              {/* Progress Circle */}
              <motion.circle
                cx="112"
                cy="112"
                r="80"
                stroke="url(#gaugeGradient)"
                strokeWidth="16"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: offset
                }}
              />
            </svg>
            
            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-white">{safeRiskScore}/100</span>
              <span className={`text-sm font-medium ${riskConfig.textColor} mt-1`}>{displayRiskLevel} RISK</span>
            </div>
          </div>

          {/* Labels */}
          <div className="flex justify-between w-full mt-4 px-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">0%</p>
              <p className="text-sm text-green-400 font-medium">Safe</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">50%</p>
              <p className="text-sm text-yellow-400 font-medium">Caution</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">100%</p>
              <p className="text-sm text-red-400 font-medium">Fraud</p>
            </div>
          </div>
        </div>

        {/* Prediction Result */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gradient-primary/20 border border-primary-500/30 rounded-xl">
            <div className="flex items-center gap-3">
              <RiskIcon className={`w-6 h-6 ${riskConfig.textColor}`} />
              <div>
                <p className="text-sm text-gray-400">Prediction</p>
                <p className={`text-2xl font-bold ${riskConfig.textColor}`}>{prediction}</p>
              </div>
              <div className="flex items-center justify-between px-1 text-sm">
                <span className="text-gray-400">ML Fraud Probability</span>
                <span className="font-semibold text-white">{formattedProbability}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Confidence</p>
              <p className="text-xl font-bold text-white">{confidence}%</p>
            </div>
          </div>

          {/* Risk Level Badge */}
          <div className={`flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r ${riskConfig.gradient}`}>
            <RiskIcon className="w-5 h-5 text-white" />
            <span className="text-white font-semibold text-lg">{displayRiskLevel} RISK LEVEL</span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default PredictionGauge
