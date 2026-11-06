import { motion } from 'framer-motion'
import { Database, Table, AlertTriangle, Layers, FileText } from 'lucide-react'
import Card from '../Card'
import { datasetInfo } from '../../data/modelInsightsMockData'

const DatasetInformation = ({ dataset = datasetInfo }) => {
  const metrics = [
    { label: 'Total Rows', value: dataset.rows.toLocaleString(), icon: Table, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { label: 'Columns', value: dataset.columns, icon: Layers, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { label: 'Fraud Ratio', value: `${(dataset.fraudRatio * 100).toFixed(1)}%`, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/20' },
    { label: 'Training Features', value: dataset.trainingFeatures, icon: Layers, color: 'text-green-400', bg: 'bg-green-500/20' },
    { label: 'Test Set', value: dataset.testSetRows.toLocaleString(), icon: Table, color: 'text-cyan-400', bg: 'bg-cyan-500/20' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Database className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-bold text-white">Dataset Information</h2>
        </div>

        {/* Dataset Name */}
        <div className="p-4 bg-gradient-primary/20 border border-primary-500/30 rounded-xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">Dataset Name</p>
              <p className="text-lg font-bold text-white">{dataset.datasetName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">Version</p>
              <p className="text-lg font-bold text-white">{dataset.datasetVersion}</p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
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

        {/* Missing Values */}
        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg mb-6">
          <FileText className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-400">Missing Values</p>
            <p className="text-sm font-medium text-white">{(dataset.missingValues * 100).toFixed(1)}%</p>
          </div>
        </div>

        {/* Dataset Quality */}
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-400 mb-1">Dataset Quality</p>
              <p className="text-xs text-gray-400">
                The dataset contains {dataset.rows.toLocaleString()} rows with {dataset.columns} columns. 
                Fraud ratio of {(dataset.fraudRatio * 100).toFixed(1)}% is realistic for production environments. 
                Missing values at {(dataset.missingValues * 100).toFixed(1)}% are minimal and handled during preprocessing.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default DatasetInformation
