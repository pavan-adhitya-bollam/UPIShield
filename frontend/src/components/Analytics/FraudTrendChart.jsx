import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { AlertTriangle } from 'lucide-react'
import Card from '../Card'

const FraudTrendChart = ({ data = [] }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-800 border border-white/10 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium mb-1">{payload[0].payload.month}</p>
          <p className="text-red-400 text-sm">Fraud: {payload[0].value}</p>
          <p className="text-green-400 text-sm">Genuine: {payload[1].value}</p>
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
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h3 className="text-lg font-semibold text-white">Fraud Trend</h3>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorGenuine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="month"
                stroke="#9ca3af"
                strokeWidth={1}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <YAxis
                stroke="#9ca3af"
                strokeWidth={1}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
              <Legend />
              <Area
                type="monotone"
                dataKey="fraud"
                stroke="#ef4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorFraud)"
                name="Fraud"
              />
              <Area
                type="monotone"
                dataKey="genuine"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorGenuine)"
                name="Genuine"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  )
}

export default FraudTrendChart
