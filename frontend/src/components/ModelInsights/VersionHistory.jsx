import { motion } from 'framer-motion'
import { GitBranch, Calendar, Database, Award, CheckCircle, XCircle } from 'lucide-react'
import Card from '../Card'
import { versionHistory } from '../../data/modelInsightsMockData'

const VersionHistory = ({ history = versionHistory }) => {
  const getStatusConfig = (status) => {
    return status === 'Active'
      ? { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' }
      : { icon: XCircle, color: 'text-gray-400', bg: 'bg-gray-500/20' }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <GitBranch className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-bold text-white">Model Version History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Version</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Accuracy</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Training Date</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Dataset</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((version, index) => {
                const statusConfig = getStatusConfig(version.status)
                const StatusIcon = statusConfig.icon

                return (
                  <motion.tr
                    key={version.version}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                      version.status === 'Active' ? 'bg-primary-500/5' : ''
                    }`}
                  >
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-primary-400" />
                        <span className="text-white font-medium">{version.version}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-green-400" />
                        <span className="text-white">{(version.accuracy * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{version.trainingDate}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{version.dataset}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {version.status}
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-gradient-primary/20 border border-primary-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <GitBranch className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white mb-1">Version Summary</p>
              <p className="text-xs text-gray-400">
                Current active version is {history[0].version} with {(history[0].accuracy * 100).toFixed(1)}% accuracy. 
                Model has improved by {((history[0].accuracy - history[history.length - 1].accuracy) * 100).toFixed(1)}% 
                since initial release v{history[history.length - 1].version}.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default VersionHistory
