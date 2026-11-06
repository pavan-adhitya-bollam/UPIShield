import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'
import Card from '../Card'

const MonthlySpendingChart = ({ data = [] }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-800 border border-white/10 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium mb-1">{payload[0].payload.month}</p>
          <p className="text-gray-400 text-sm">Spending: ₹{(payload[0].value / 1000).toFixed(0)}K</p>
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
          <TrendingUp className="w-5 h-5 text-accent-400" />
          <h3 className="text-lg font-semibold text-white">Monthly Spending</h3>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <defs>
                <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.3} />
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
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
              <Bar dataKey="amount" fill="url(#colorSpending)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  )
}

export default MonthlySpendingChart
