import { motion } from 'framer-motion'
import { Activity, AlertTriangle, Clock, TrendingUp, CheckCircle } from 'lucide-react'
import Card from '../Card'
import { predictionMonitor } from '../../data/modelInsightsMockData'

const ModelPredictionMonitor = ({ monitor = predictionMonitor }) => {
  const metrics = [
    { label: "Today's Predictions", value: monitor.todayPredictions.toLocaleString(), icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { label: 'Fraud Detected', value: monitor.fraudDetected.toLocaleString(), icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/20' },
    { label: 'False Positives', value: monitor.falsePositives.toLocaleString(), icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/20' },
    { label: 'False Negatives', value: monitor.falseNegatives.toLocaleString(), icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    { label: 'Avg Prediction Time', value: `${monitor.averagePredictionTime}ms`, icon: Clock, color: 'text-green-400', bg: 'bg-green-500/20' },
    { label: 'Avg Confidence', value: `${(monitor.averageConfidence * 100).toFixed(0)}%`, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/20' }
  ]

  const falsePositiveRate = ((monitor.falsePositives / monitor.todayPredictions) * 100).toFixed(2)
  const falseNegativeRate = ((monitor.falseNegatives / monitor.fraudDetected) * 100).toFixed(2)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-bold text-white">Model Prediction Monitor</h2>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-white/5 rounded-xl"
              >
                <div className={`w-10 h-10 ${metric.bg} rounded-lg flex items-center justify-center mb-2`}>
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <p className="text-xs text-gray-400 mb-1">{metric.label}</p>
                <p className={`text-lg font-bold ${metric.color}`}>{metric.value}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Error Rates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <p className="text-sm font-medium text-orange-400">False Positive Rate</p>
              </div>
              <span className="text-lg font-bold text-orange-400">{falsePositiveRate}%</span>
            </div>
            <p className="text-xs text-gray-400">Genuine transactions incorrectly flagged as fraud</p>
          </div>

          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <p className="text-sm font-medium text-yellow-400">False Negative Rate</p>
              </div>
              <span className="text-lg font-bold text-yellow-400">{falseNegativeRate}%</span>
            </div>
            <p className="text-xs text-gray-400">Fraudulent transactions missed by model</p>
          </div>
        </div>

        {/* Performance Status */}
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-sm font-medium text-green-400">Model Performance Status</p>
              <p className="text-xs text-gray-400">
                The model is performing within acceptable parameters. 
                False positive rate is low at {falsePositiveRate}%. 
                Average prediction time of {monitor.averagePredictionTime}ms meets real-time requirements.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default ModelPredictionMonitor
