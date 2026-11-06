import { motion } from 'framer-motion'
import { CheckCircle, Clock, AlertCircle, Circle } from 'lucide-react'
import Card from '../Card'
import { transactionTimelineData } from '../../data/transactionHistoryData'

const TransactionHistoryTimeline = ({ timeline = transactionTimelineData }) => {
  const getStepIcon = (status) => {
    switch (status) {
      case 'completed':
        return CheckCircle
      case 'pending':
        return Clock
      case 'failed':
        return AlertCircle
      default:
        return Circle
    }
  }

  const getStepColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-400'
      case 'pending':
        return 'text-yellow-400'
      case 'failed':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Transaction Timeline</h3>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-accent-500" />

          {/* Timeline Steps */}
          <div className="space-y-6">
            {timeline.map((step, index) => {
              const Icon = getStepIcon(step.status)
              const color = getStepColor(step.status)

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-16"
                >
                  {/* Icon */}
                  <div className={`absolute left-4 top-0 p-2 rounded-full bg-dark-800 border-2 ${step.status === 'completed' ? 'border-green-500' : step.status === 'pending' ? 'border-yellow-500' : 'border-gray-500'}`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>

                  {/* Content */}
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-white">{step.step}</h4>
                      <span className="text-xs text-gray-500">{step.time}</span>
                    </div>
                    <p className="text-xs text-gray-400">{step.description}</p>
                    {step.status === 'completed' && (
                      <div className="mt-2 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        <span className="text-xs text-green-400">Completed</span>
                      </div>
                    )}
                    {step.status === 'pending' && (
                      <div className="mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs text-yellow-400">In Progress</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Transaction Progress</span>
            <span className="text-xs text-white font-medium">
              {timeline.filter(t => t.status === 'completed').length} / {timeline.length}
            </span>
          </div>
          <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(timeline.filter(t => t.status === 'completed').length / timeline.length) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
            />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default TransactionHistoryTimeline
