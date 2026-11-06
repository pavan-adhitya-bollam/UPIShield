import { motion } from 'framer-motion'
import { Brain, Target, Activity, TrendingUp, Zap, Clock, Cpu } from 'lucide-react'
import Card from '../Card'

const MLPerformancePanel = ({ performance = {} }) => {
  const metrics = [
    { label: 'Accuracy', value: performance.accuracy, icon: Target, color: 'text-green-400', bg: 'bg-green-500/20' },
    { label: 'Precision', value: performance.precision, icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { label: 'Recall', value: performance.recall, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { label: 'F1 Score', value: performance.f1Score, icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    { label: 'ROC-AUC', value: performance.rocAuc, icon: Cpu, color: 'text-pink-400', bg: 'bg-pink-500/20' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-semibold text-white">ML Performance</h3>
        </div>

        {/* Model Info */}
        <div className="p-4 bg-gradient-primary/20 border border-primary-500/30 rounded-xl mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Current Model</p>
              <p className="text-white font-semibold">{performance.currentModel}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Version</p>
              <p className="text-white font-semibold">{performance.modelVersion}</p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded-lg ${metric.bg} border ${metric.bg.replace('/20', '/30')}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${metric.color}`} />
                  <span className="text-xs text-gray-400">{metric.label}</span>
                </div>
                <p className={`text-xl font-bold ${metric.color}`}>{metric.value}%</p>
              </motion.div>
            )
          })}
        </div>

        {/* Additional Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Total Predictions</span>
            </div>
            <span className="text-white font-medium">{performance.predictionCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Today's Predictions</span>
            </div>
            <span className="text-white font-medium">{performance.todayPredictions.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Avg Prediction Time</span>
            </div>
            <span className="text-white font-medium">{performance.avgPredictionTime}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default MLPerformancePanel
