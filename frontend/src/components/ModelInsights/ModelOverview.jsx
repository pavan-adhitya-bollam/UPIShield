import { motion } from 'framer-motion'
import { Cpu, Target, Database, Calendar, Clock, TrendingUp, Award } from 'lucide-react'
import Card from '../Card'
import { modelOverview } from '../../data/modelInsightsMockData'

const ModelOverview = ({ overview = modelOverview }) => {
  const metrics = [
    { label: 'Test Accuracy', value: `~${(overview.accuracy * 100).toFixed(0)}%`, icon: Award, color: 'text-green-400', bg: 'bg-green-500/20' },
    { label: 'Precision', value: (overview.precision * 100).toFixed(1) + '%', icon: Target, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { label: 'Recall', value: (overview.recall * 100).toFixed(1) + '%', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { label: 'F1 Score', value: (overview.f1Score * 100).toFixed(1) + '%', icon: Award, color: 'text-orange-400', bg: 'bg-orange-500/20' },
    { label: 'ROC-AUC', value: (overview.rocAuc * 100).toFixed(1) + '%', icon: TrendingUp, color: 'text-pink-400', bg: 'bg-pink-500/20' },
    { label: 'Brier Score', value: overview.brierScore.toFixed(4), icon: Target, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
    { label: 'Threshold', value: overview.predictionThreshold.toFixed(2), icon: Target, color: 'text-cyan-400', bg: 'bg-cyan-500/20' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Cpu className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-bold text-white">Model Overview</h2>
        </div>

        {/* Model Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gradient-primary/20 border border-primary-500/30 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Model Name</p>
            <p className="text-lg font-bold text-white">{overview.modelName}</p>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Model Version</p>
            <p className="text-lg font-bold text-white">{overview.modelVersion}</p>
          </div>
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

        {/* Training Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Database className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Training Dataset</p>
              <p className="text-sm font-medium text-white">{overview.trainingDataset}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Training Date</p>
              <p className="text-sm font-medium text-white">{overview.trainingDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Last Updated</p>
              <p className="text-sm font-medium text-white">{overview.lastUpdated}</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default ModelOverview
