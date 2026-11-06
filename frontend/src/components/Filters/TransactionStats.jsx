import { motion } from 'framer-motion'
import { ArrowUpRight, Calendar, CheckCircle, XCircle, AlertTriangle, ArrowUp, ArrowDown, TrendingUp } from 'lucide-react'
import Card from '../Card'

const iconMap = {
  ArrowUpRight,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  TrendingUp
}

const TransactionStats = ({ stats = {} }) => {
  const statEntries = Object.entries(stats)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statEntries.map(([key, stat], index) => {
        const Icon = iconMap[stat.icon]
        const isPositive = stat.trend?.startsWith('+')
        const colorClasses = {
          primary: 'bg-primary-500/20 text-primary-400',
          accent: 'bg-accent-500/20 text-accent-400',
          green: 'bg-green-500/20 text-green-400',
          red: 'bg-red-500/20 text-red-400',
          yellow: 'bg-yellow-500/20 text-yellow-400',
          blue: 'bg-blue-500/20 text-blue-400',
          purple: 'bg-purple-500/20 text-purple-400'
        }

        const getColor = () => {
          if (key.includes('fraudulent') || key.includes('failed')) return 'red'
          if (key.includes('successful') || key.includes('received')) return 'green'
          if (key.includes('total') || key.includes('average')) return 'primary'
          return 'accent'
        }

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-white mb-2">{stat.value}</h3>
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.trend}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[getColor()]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

export default TransactionStats
