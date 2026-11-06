import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Card from '../components/Card'

const MonthlyTransactionChart = ({ data = [] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Monthly Transaction Trend</h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="month" 
              stroke="#9ca3af"
              fontSize={12}
            />
            <YAxis 
              yAxisId="left"
              stroke="#9ca3af"
              fontSize={12}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#9ca3af"
              fontSize={12}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="transactions" 
              stroke="#0ea5e9" 
              strokeWidth={2}
              name="Transactions"
              dot={{ fill: '#0ea5e9' }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="amount" 
              stroke="#a855f7" 
              strokeWidth={2}
              name="Amount (₹)"
              dot={{ fill: '#a855f7' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  )
}

export default MonthlyTransactionChart
