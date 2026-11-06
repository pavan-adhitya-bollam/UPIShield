import { motion } from 'framer-motion'
import { Brain, AlertTriangle, Shield, CheckCircle } from 'lucide-react'
import Card from '../Card'
import { fraudAnalysisReasons } from '../../data/transactionHistoryData'

const AIFraudAnalysis = ({ fraudProbability, riskScore, confidence, riskLevel }) => {
  const getRiskColor = (level) => {
    switch (level) {
      case 'LOW': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'HIGH': return 'text-orange-400 bg-orange-500/20 border-orange-500/30'
      case 'CRITICAL': return 'text-red-400 bg-red-500/20 border-red-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getGaugeColor = (probability) => {
    if (probability < 20) return '#10b981'
    if (probability < 50) return '#f59e0b'
    if (probability < 75) return '#f97316'
    return '#ef4444'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-semibold text-white">AI Fraud Analysis</h3>
        </div>

        {/* Risk Score Gauge */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke={getGaugeColor(fraudProbability)}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(fraudProbability / 100) * 352} 352`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">{fraudProbability}%</span>
              <span className="text-xs text-gray-400">Fraud Prob</span>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Risk Score</p>
            <p className="text-lg font-bold text-white">{riskScore}</p>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Confidence</p>
            <p className="text-lg font-bold text-green-400">{confidence}%</p>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Risk Level</p>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(riskLevel)}`}>
              {riskLevel}
            </span>
          </div>
        </div>

        {/* Risk Reasons */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white mb-2">Risk Factors Detected</h4>
          {fraudAnalysisReasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-white">{reason.feature}</span>
                </div>
                <span className="text-xs font-medium text-yellow-400">
                  {(reason.riskWeight * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-gray-400">{reason.explanation}</p>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-4 p-4 bg-gradient-primary/20 border border-primary-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className={`w-5 h-5 ${fraudProbability > 50 ? 'text-red-400' : 'text-green-400'} flex-shrink-0 mt-0.5`} />
            <div>
              <p className={`text-sm font-medium ${fraudProbability > 50 ? 'text-red-400' : 'text-green-400'} mb-1`}>
                {fraudProbability > 50 ? 'High Risk Detected' : 'Transaction Appears Safe'}
              </p>
              <p className="text-xs text-gray-400">
                {fraudProbability > 50 
                  ? 'This transaction exhibits multiple risk factors. Please review carefully before proceeding.'
                  : 'This transaction has passed all fraud detection checks with high confidence.'
                }
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default AIFraudAnalysis
