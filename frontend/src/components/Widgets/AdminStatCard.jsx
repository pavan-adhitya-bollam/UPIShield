import { motion } from 'framer-motion'
import { Users, ArrowUpRight, Calendar, AlertTriangle, Percent, XCircle, Clock, Brain, TrendingUp, TrendingDown } from 'lucide-react'
import Card from '../Card'

const iconMap = {
  Users,
  ArrowUpRight,
  Calendar,
  AlertTriangle,
  Percent,
  XCircle,
  Clock,
  Brain
}

const AdminStatCard = ({ label, value, trend, icon, color = 'primary' }) => {
  const Icon = iconMap[icon]
  const isPositive = trend?.startsWith('+')
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  const colorClasses = {
    primary: 'bg-primary-500/20 text-primary-400',
    accent: 'bg-accent-500/20 text-accent-400',
    green: 'bg-green-500/20 text-green-400',
    red: 'bg-red-500/20 text-red-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    blue: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-400 mb-1">{label}</p>
            <h3 className="text-2xl font-bold text-white mb-2">{value}</h3>
            <div className="flex items-center gap-1">
              <TrendIcon className={`w-4 h-4 ${isPositive ? 'text-green-400' : 'text-red-400'}`} />
              <span className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {trend}
              </span>
            </div>
          </div>
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default AdminStatCard
