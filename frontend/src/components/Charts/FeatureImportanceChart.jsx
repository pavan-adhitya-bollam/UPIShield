import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { BarChart3 } from 'lucide-react'
import Card from '../Card'

const FeatureImportanceChart = ({ features = [] }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-800 border border-white/10 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium mb-1">{payload[0].payload.feature}</p>
          <p className="text-gray-400 text-sm">Importance: {(payload[0].value * 100).toFixed(1)}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-accent-400" />
          <h3 className="text-lg font-semibold text-white">Feature Importance</h3>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={features}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              />
              <YAxis
                type="category"
                dataKey="feature"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                width={140}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
              <Bar
                dataKey="importance"
                radius={[0, 4, 4, 0]}
                animationDuration={1000}
              >
                {features.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-400 mb-2">Top Risk Factors:</p>
          {features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: feature.color }}
                />
                <span className="text-gray-300">{feature.feature}</span>
              </div>
              <span className="text-white font-medium">{(feature.importance * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

export default FeatureImportanceChart
