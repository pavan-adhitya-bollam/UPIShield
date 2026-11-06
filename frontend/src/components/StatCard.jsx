import { motion } from 'framer-motion'
import Card from './Card'

const StatCard = ({ title, value, icon: Icon, trend, color = 'primary' }) => {
  const colors = {
    primary: 'from-primary-500 to-primary-600',
    accent: 'from-accent-500 to-accent-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
  }

  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
          {trend && (
            <p className={`text-sm ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  )
}

export default StatCard
