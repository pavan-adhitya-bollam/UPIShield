import { motion } from 'framer-motion'
import { Shield, AlertTriangle, Lock } from 'lucide-react'
import Card from '../components/Card'

const QuickTips = ({ tips = [] }) => {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Shield': return Shield
      case 'AlertTriangle': return AlertTriangle
      case 'Lock': return Lock
      default: return Shield
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Quick Tips</h3>

        <div className="space-y-3">
          {tips.map((tip, index) => {
            const Icon = getIcon(tip.icon)
            
            return (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 rounded-lg bg-primary-500/10 border border-primary-500/20"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary-500/20 flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm mb-1">{tip.title}</p>
                    <p className="text-gray-400 text-xs">{tip.description}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </Card>
    </motion.div>
  )
}

export default QuickTips
