import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { PieChart as PieIcon } from 'lucide-react'
import Card from '../Card'

const FraudVsGenuineChart = ({ data = [] }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-800 border border-white/10 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium">{payload[0].name}</p>
          <p className="text-gray-400 text-sm">Count: {payload[0].value}</p>
          <p className="text-gray-400 text-sm">
            Percentage: {((payload[0].value / data.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-400">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <PieIcon className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-semibold text-white">Fraud vs Genuine</h3>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  )
}

export default FraudVsGenuineChart
