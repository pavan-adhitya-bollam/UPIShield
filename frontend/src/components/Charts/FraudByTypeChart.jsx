import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { BarChart3 } from 'lucide-react'
import Card from '../Card'

const FraudByTypeChart = ({ data = [] }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-800 border border-white/10 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium">{payload[0].payload.type}</p>
          <p className="text-red-400 text-sm">Fraud Count: {payload[0].value}</p>
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
          <h3 className="text-lg font-semibold text-white">Fraud by Transaction Type</h3>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="type"
                stroke="#9ca3af"
                strokeWidth={1}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                stroke="#9ca3af"
                strokeWidth={1}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
              <Bar dataKey="fraud" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  )
}

export default FraudByTypeChart
