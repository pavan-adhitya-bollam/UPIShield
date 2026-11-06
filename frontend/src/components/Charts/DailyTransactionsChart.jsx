import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'
import Card from '../Card'

const DailyTransactionsChart = ({ data = [] }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-800 border border-white/10 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium mb-1">{payload[0].payload.day}</p>
          <p className="text-gray-400 text-sm">Transactions: {payload[0].value}</p>
          <p className="text-gray-400 text-sm">Amount: ₹{(payload[1].value / 1000).toFixed(0)}K</p>
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">Daily Transactions</h3>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="day"
                stroke="#9ca3af"
                strokeWidth={1}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <YAxis
                yAxisId="left"
                stroke="#9ca3af"
                strokeWidth={1}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#9ca3af"
                strokeWidth={1}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="transactions"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                name="Transactions"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="amount"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                name="Amount (₹)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  )
}

export default DailyTransactionsChart
