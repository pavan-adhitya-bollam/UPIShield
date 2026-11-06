import { motion } from 'framer-motion'
import { Grid3x3, CheckCircle, XCircle } from 'lucide-react'
import Card from '../Card'
import { confusionMatrix } from '../../data/modelInsightsMockData'

const ConfusionMatrix = ({ matrix = confusionMatrix }) => {
  const total = matrix.truePositive + matrix.falsePositive + matrix.trueNegative + matrix.falseNegative
  const getHeatmapColor = (value, isPositive) => {
    const intensity = value / total
    if (isPositive) {
      return `rgba(16, 185, 129, ${0.1 + intensity * 0.5})`
    }
    return `rgba(239, 68, 68, ${0.1 + intensity * 0.5})`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Grid3x3 className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-bold text-white">Confusion Matrix</h2>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* True Positive */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-green-500/20 border border-green-500/30 rounded-xl"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-sm font-medium text-green-400">True Positive</p>
            </div>
            <p className="text-3xl font-bold text-white">{matrix.truePositive.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">Correctly identified fraud</p>
          </motion.div>

          {/* False Positive */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-red-500/20 border border-red-500/30 rounded-xl"
          >
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <p className="text-sm font-medium text-red-400">False Positive</p>
            </div>
            <p className="text-3xl font-bold text-white">{matrix.falsePositive.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">Genuine flagged as fraud</p>
          </motion.div>

          {/* False Negative */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="p-6 bg-orange-500/20 border border-orange-500/30 rounded-xl"
          >
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-orange-400" />
              <p className="text-sm font-medium text-orange-400">False Negative</p>
            </div>
            <p className="text-3xl font-bold text-white">{matrix.falseNegative.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">Fraud missed by model</p>
          </motion.div>

          {/* True Negative */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="p-6 bg-blue-500/20 border border-blue-500/30 rounded-xl"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-blue-400" />
              <p className="text-sm font-medium text-blue-400">True Negative</p>
            </div>
            <p className="text-3xl font-bold text-white">{matrix.trueNegative.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">Correctly identified genuine</p>
          </motion.div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-white/5 rounded-lg text-center">
            <p className="text-xs text-gray-400 mb-1">Total Predictions</p>
            <p className="text-lg font-bold text-white">{total.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg text-center">
            <p className="text-xs text-gray-400 mb-1">Accuracy</p>
            <p className="text-lg font-bold text-green-400">
              {(((matrix.truePositive + matrix.trueNegative) / total) * 100).toFixed(1)}%
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg text-center">
            <p className="text-xs text-gray-400 mb-1">Precision</p>
            <p className="text-lg font-bold text-blue-400">
              {((matrix.truePositive / (matrix.truePositive + matrix.falsePositive)) * 100).toFixed(1)}%
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg text-center">
            <p className="text-xs text-gray-400 mb-1">Recall</p>
            <p className="text-lg font-bold text-purple-400">
              {((matrix.truePositive / (matrix.truePositive + matrix.falseNegative)) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default ConfusionMatrix
