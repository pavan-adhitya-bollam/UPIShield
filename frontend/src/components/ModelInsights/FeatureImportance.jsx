import { motion } from 'framer-motion'
import { TrendingUp, Award, Info } from 'lucide-react'
import Card from '../Card'
import { featureImportance } from '../../data/modelInsightsMockData'

const FeatureImportance = ({ features = featureImportance }) => {
  const getBarColor = (importance) => {
    if (importance >= 0.3) return 'bg-gradient-primary'
    if (importance >= 0.2) return 'bg-gradient-to-r from-blue-500 to-cyan-500'
    if (importance >= 0.1) return 'bg-gradient-to-r from-green-500 to-emerald-500'
    return 'bg-gradient-to-r from-orange-500 to-yellow-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-bold text-white">Top Feature Importance</h2>
        </div>

        <div className="space-y-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  index === 0 ? 'bg-gradient-primary' : 'bg-white/10'
                }`}>
                  <span className="text-white font-bold text-sm">{feature.rank}</span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{feature.feature}</h4>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary-400" />
                      <span className="text-primary-400 font-bold">{(feature.importance * 100).toFixed(0)}%</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-white/10 rounded-full mb-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${feature.importance * 100}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className={`h-full rounded-full ${getBarColor(feature.importance)}`}
                    />
                  </div>

                  {/* Explanation */}
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-400">{feature.explanation}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-gradient-primary/20 border border-primary-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white mb-1">Feature Importance Summary</p>
              <p className="text-xs text-gray-400">
                The top 3 features (Customer Behaviour Deviation, Device Changed, New Beneficiary) 
                account for {(features.slice(0, 3).reduce((sum, f) => sum + f.importance, 0) * 100).toFixed(0)}% 
                of the model's decision-making process.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default FeatureImportance
