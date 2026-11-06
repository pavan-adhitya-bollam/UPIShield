import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Card from '../components/Card'

const SpendingCategoriesChart = ({ data = [] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Spending by Category</h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="category" 
              stroke="#9ca3af"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
            />
            <Bar 
              dataKey="amount" 
              fill="url(#gradient)"
              radius={[4, 4, 0, 0]}
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={1}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={1}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  )
}

export default SpendingCategoriesChart
