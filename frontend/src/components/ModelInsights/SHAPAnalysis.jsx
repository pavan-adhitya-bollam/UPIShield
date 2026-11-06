import { motion } from 'framer-motion'
import { Zap, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import Card from '../Card'
import { shapAnalysis } from '../../data/modelInsightsMockData'

const SHAPAnalysis = ({ analysis = shapAnalysis }) => {
  const { exampleTransaction, positiveContributors, negativeContributors } = analysis

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-bold text-white">SHAP Explainability</h2>
        </div>

        {/* Example Transaction */}
        <div className="p-4 bg-gradient-primary/20 border border-primary-500/30 rounded-xl mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-400 mb-1">Example Transaction</p>
              <p className="text-white font-medium">{exampleTransaction.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">Risk Score</p>
              <p className="text-2xl font-bold text-red-400">{(exampleTransaction.riskScore * 100).toFixed(0)}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                style={{ width: `${exampleTransaction.riskScore * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">Confidence: {(exampleTransaction.confidence * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Waterfall Visualization */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-white mb-4">SHAP Waterfall Visualization</h3>
          
          {/* Base Value */}
          <div className="flex items-center gap-4 mb-4 p-3 bg-white/5 rounded-lg">
            <div className="w-32 text-xs text-gray-400">Base Value</div>
            <div className="flex-1 h-8 bg-white/10 rounded flex items-center justify-center">
              <span className="text-sm text-gray-400">0.50</span>
            </div>
          </div>

          {/* Positive Contributors */}
          <div className="space-y-2 mb-4">
            <p className="text-xs text-gray-400 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-400" />
              Top Positive Contributors
            </p>
            {positiveContributors.map((contributor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-32 text-xs text-gray-400 truncate">{contributor.feature}</div>
                <div className="flex-1 h-8 bg-red-500/20 rounded flex items-center justify-between px-3">
                  <span className="text-xs text-red-400">+{(contributor.contribution * 100).toFixed(0)}%</span>
                  <div className="w-20 h-2 bg-red-500/30 rounded overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${(contributor.contribution / 0.38) * 100}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Negative Contributors */}
          <div className="space-y-2">
            <p className="text-xs text-gray-400 mb-2 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-green-400" />
              Top Negative Contributors
            </p>
            {negativeContributors.map((contributor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (positiveContributors.length + index) * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-32 text-xs text-gray-400 truncate">{contributor.feature}</div>
                <div className="flex-1 h-8 bg-green-500/20 rounded flex items-center justify-between px-3">
                  <span className="text-xs text-green-400">{(contributor.contribution * 100).toFixed(0)}%</span>
                  <div className="w-20 h-2 bg-green-500/30 rounded overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${Math.abs(contributor.contribution / 0.15) * 100}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Final Prediction */}
          <div className="flex items-center gap-4 mt-4 p-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-lg">
            <div className="w-32 text-xs text-white font-medium">Final Prediction</div>
            <div className="flex-1 h-8 bg-red-500/30 rounded flex items-center justify-center">
              <span className="text-lg font-bold text-red-400">{(exampleTransaction.riskScore * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white mb-1">SHAP Analysis Summary</p>
              <p className="text-xs text-gray-400">
                This transaction was flagged as high-risk primarily due to customer behavior deviation (+38%) 
                and new beneficiary (+21%). The model's confidence is high at 94%. 
                Trusted device and known location helped reduce the risk score.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default SHAPAnalysis
