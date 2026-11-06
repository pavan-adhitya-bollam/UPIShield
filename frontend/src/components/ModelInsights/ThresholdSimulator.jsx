import { motion } from 'framer-motion'
import { Sliders, Target, TrendingUp, Award } from 'lucide-react'
import Card from '../Card'
import { thresholdSimulation } from '../../data/modelInsightsMockData'
import { useState } from 'react'

const ThresholdSimulator = ({ simulation = thresholdSimulation }) => {
  const [threshold, setThreshold] = useState(simulation.threshold)
  const [results, setResults] = useState(simulation.results[threshold.toFixed(2)])

  const handleSliderChange = (e) => {
    const newThreshold = parseFloat(e.target.value)
    setThreshold(newThreshold)
    const thresholdKey = newThreshold.toFixed(2)
    setResults(simulation.results[thresholdKey] || simulation.results['0.65'])
  }

  const thresholds = [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.65, 0.70, 0.80, 0.90]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Sliders className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-bold text-white">Threshold Simulation</h2>
        </div>

        {/* Slider */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-gray-400">Prediction Threshold</span>
            </div>
            <span className="text-2xl font-bold text-primary-400">{threshold.toFixed(2)}</span>
          </div>

          <input
            type="range"
            min="0.10"
            max="0.90"
            step="0.10"
            value={threshold}
            onChange={handleSliderChange}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />

          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>0.10</span>
            <span>0.50</span>
            <span>0.90</span>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-400">Precision</span>
              </div>
              <p className="text-2xl font-bold text-blue-400">{(results.precision * 100).toFixed(1)}%</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-400">Recall</span>
              </div>
              <p className="text-2xl font-bold text-purple-400">{(results.recall * 100).toFixed(1)}%</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-400">F1 Score</span>
              </div>
              <p className="text-2xl font-bold text-green-400">{(results.f1 * 100).toFixed(1)}%</p>
            </motion.div>
          </div>
        )}

        {/* Threshold Comparison */}
        <div className="space-y-2">
          <p className="text-xs text-gray-400 mb-3">Quick Threshold Selection</p>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {thresholds.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setThreshold(t)
                  setResults(simulation.results[t.toFixed(2)])
                }}
                className={`p-2 rounded-lg text-xs font-medium transition-all ${
                  threshold === t
                    ? 'bg-gradient-primary text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {t.toFixed(2)}
              </button>
            ))}
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <Sliders className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white mb-1">Threshold Analysis</p>
              <p className="text-xs text-gray-400">
                Adjusting the prediction threshold affects the trade-off between precision and recall. 
                Lower thresholds increase recall but decrease precision (more false positives). 
                Higher thresholds increase precision but decrease recall (more false negatives).
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default ThresholdSimulator
