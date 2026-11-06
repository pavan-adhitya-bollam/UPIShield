import { motion } from 'framer-motion'
import { Grid3x3 } from 'lucide-react'
import Card from '../Card'

const FraudHeatmap = ({ data = [] }) => {
  const getColor = (value) => {
    if (value < 5) return 'bg-green-500/20 border-green-500/30'
    if (value < 10) return 'bg-yellow-500/20 border-yellow-500/30'
    if (value < 20) return 'bg-orange-500/20 border-orange-500/30'
    return 'bg-red-500/20 border-red-500/30'
  }

  const getTextColor = (value) => {
    if (value < 5) return 'text-green-400'
    if (value < 10) return 'text-yellow-400'
    if (value < 20) return 'text-orange-400'
    return 'text-red-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Grid3x3 className="w-5 h-5 text-accent-400" />
          <h3 className="text-lg font-semibold text-white">Fraud Heatmap</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-xs text-gray-400 font-medium py-2 px-2">Hour</th>
                <th className="text-xs text-gray-400 font-medium py-2 px-2">Mon</th>
                <th className="text-xs text-gray-400 font-medium py-2 px-2">Tue</th>
                <th className="text-xs text-gray-400 font-medium py-2 px-2">Wed</th>
                <th className="text-xs text-gray-400 font-medium py-2 px-2">Thu</th>
                <th className="text-xs text-gray-400 font-medium py-2 px-2">Fri</th>
                <th className="text-xs text-gray-400 font-medium py-2 px-2">Sat</th>
                <th className="text-xs text-gray-400 font-medium py-2 px-2">Sun</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="text-xs text-gray-400 py-2 px-2">{row.hour}</td>
                  {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => (
                    <td key={day} className="py-2 px-2">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: rowIndex * 0.05 }}
                        className={`w-10 h-10 rounded-lg border flex items-center justify-center ${getColor(row[day])}`}
                      >
                        <span className={`text-xs font-medium ${getTextColor(row[day])}`}>{row[day]}</span>
                      </motion.div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500/30" />
            <span className="text-xs text-gray-400">Low (&lt;5)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500/20 border border-yellow-500/30" />
            <span className="text-xs text-gray-400">Medium (5-10)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500/20 border border-orange-500/30" />
            <span className="text-xs text-gray-400">High (10-20)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/30" />
            <span className="text-xs text-gray-400">Critical (&gt;20)</span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default FraudHeatmap
