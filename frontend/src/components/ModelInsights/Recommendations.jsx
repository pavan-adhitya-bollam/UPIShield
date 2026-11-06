import { motion } from 'framer-motion'
import { Lightbulb, TrendingUp, Cpu, Database, Zap, AlertTriangle } from 'lucide-react'
import Card from '../Card'
import { recommendations } from '../../data/modelInsightsMockData'

const Recommendations = ({ recs = recommendations }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'Optimization':
        return TrendingUp
      case 'Training':
        return Cpu
      case 'Feature':
        return Database
      case 'Performance':
        return Zap
      case 'Data':
        return AlertTriangle
      default:
        return Lightbulb
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Optimization':
        return 'text-blue-400 bg-blue-500/20'
      case 'Training':
        return 'text-purple-400 bg-purple-500/20'
      case 'Feature':
        return 'text-green-400 bg-green-500/20'
      case 'Performance':
        return 'text-orange-400 bg-orange-500/20'
      case 'Data':
        return 'text-red-400 bg-red-500/20'
      default:
        return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-400 bg-red-500/20'
      case 'Medium':
        return 'text-yellow-400 bg-yellow-500/20'
      case 'Low':
        return 'text-green-400 bg-green-500/20'
      default:
        return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High':
        return 'text-green-400 bg-green-500/20'
      case 'Medium':
        return 'text-blue-400 bg-blue-500/20'
      case 'Low':
        return 'text-gray-400 bg-gray-500/20'
      default:
        return 'text-gray-400 bg-gray-500/20'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Lightbulb className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-bold text-white">AI-Generated Recommendations</h2>
        </div>

        <div className="space-y-4">
          {recs.map((rec, index) => {
            const TypeIcon = getTypeIcon(rec.type)
            return (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 ${getTypeColor(rec.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <TypeIcon className={`w-5 h-5 ${getTypeColor(rec.type).split(' ')[0]}`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">{rec.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                          {rec.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(rec.impact)}`}>
                          {rec.impact} Impact
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-400 mb-3">{rec.description}</p>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(rec.type)}`}>
                        {rec.type}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-gradient-primary/20 border border-primary-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white mb-1">Recommendations Summary</p>
              <p className="text-xs text-gray-400">
                Based on current model performance and analysis, {recs.length} recommendations have been generated.
                Prioritize High priority items for immediate improvement. 
                Addressing these could improve model accuracy by 2-5%.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default Recommendations
