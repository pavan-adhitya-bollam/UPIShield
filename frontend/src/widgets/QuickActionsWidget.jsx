import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Send, QrCode, History, Shield, Download, User } from 'lucide-react'
import Card from '../components/Card'

const QuickActionsWidget = ({ actions = [] }) => {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Send': return Send
      case 'QrCode': return QrCode
      case 'History': return History
      case 'Shield': return Shield
      case 'Download': return Download
      case 'User': return User
      default: return Send
    }
  }

  const getColorClass = (color) => {
    switch (color) {
      case 'primary': return 'from-primary-500 to-primary-600'
      case 'accent': return 'from-accent-500 to-accent-600'
      case 'green': return 'from-green-500 to-green-600'
      case 'red': return 'from-red-500 to-red-600'
      case 'blue': return 'from-blue-500 to-blue-600'
      default: return 'from-primary-500 to-primary-600'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = getIcon(action.icon)
            const colorClass = getColorClass(action.color)
            
            return (
              <Link key={action.id} to={action.route}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-medium text-white">{action.title}</p>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </Card>
    </motion.div>
  )
}

export default QuickActionsWidget
