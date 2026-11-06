import { motion } from 'framer-motion'
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown } from 'lucide-react'
import Card from '../components/Card'

const StatCard = ({ title, value, trend, icon: Icon, color = 'primary' }) => {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    accent: 'from-accent-500 to-accent-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    blue: 'from-blue-500 to-blue-600',
  }

  const trendColor = trend?.positive ? 'text-green-400' : 'text-red-400'
  const TrendIcon = trend?.positive ? TrendingUp : TrendingDown

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover>
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <h3 className="text-3xl font-bold text-white">{value}</h3>
            {trend && (
              <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
                <TrendIcon className="w-4 h-4" />
                <span>{trend.positive ? '+' : ''}{trend.value}% from last month</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex-shrink-0`}>
            {Icon && <Icon className="w-6 h-6 text-white" />}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default StatCard
