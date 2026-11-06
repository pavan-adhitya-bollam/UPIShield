import { motion } from 'framer-motion'
import { Activity, Cpu, Server, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import Card from '../Card'
import { modelHealth } from '../../data/modelInsightsMockData'

const ModelHealth = ({ health = modelHealth }) => {
  const metrics = [
    { label: 'Latency', value: `${health.latency}ms`, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { label: 'Memory Usage', value: `${health.memoryUsage}MB`, icon: Server, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { label: 'CPU Usage', value: `${health.cpuUsage}%`, icon: Cpu, color: 'text-green-400', bg: 'bg-green-500/20' },
    { label: 'Inference Time', value: `${health.inferenceTime}ms`, icon: Activity, color: 'text-orange-400', bg: 'bg-orange-500/20' }
  ]

  const getStatusColor = (status) => {
    return status === 'Healthy'
      ? 'text-green-400 bg-green-500/20'
      : 'text-red-400 bg-red-500/20'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-bold text-white">Model Health</h2>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between p-4 bg-gradient-primary/20 border border-primary-500/30 rounded-xl mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${getStatusColor(health.status)} flex items-center justify-center`}>
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Model Status</p>
              <p className="text-xl font-bold text-white">{health.status}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Availability</p>
            <p className="text-2xl font-bold text-green-400">{health.modelAvailability}%</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white/5 rounded-lg"
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

        {/* Last Prediction */}
        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
          <Clock className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-400">Last Prediction</p>
            <p className="text-sm font-medium text-white">{health.lastPrediction}</p>
          </div>
        </div>

        {/* Health Status */}
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-400 mb-1">System Healthy</p>
              <p className="text-xs text-gray-400">
                All model health metrics are within normal operating range. 
                CPU usage at {health.cpuUsage}%, memory at {health.memoryUsage}MB, 
                and inference time of {health.inferenceTime}ms are optimal for real-time predictions.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default ModelHealth
