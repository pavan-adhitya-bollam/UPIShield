import { motion } from 'framer-motion'
import { CheckCircle, Clock, AlertCircle, Circle } from 'lucide-react'
import Card from '../Card'

const TransactionTimeline = ({ steps = [] }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400 animate-pulse" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      default:
        return <Circle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'border-green-500'
      case 'pending':
        return 'border-yellow-500'
      case 'error':
        return 'border-red-500'
      default:
        return 'border-gray-500'
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

        <div className="space-y-0">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Timeline Line */}
              {index !== steps.length - 1 && (
                <div className={`absolute left-6 top-12 w-0.5 h-full ${
                  step.status === 'completed' ? 'bg-green-500' : 'bg-gray-700'
                }`} />
              )}

              <div className="flex items-start gap-4 pb-6">
                {/* Status Icon */}
                <div className={`relative z-10 p-2 rounded-full bg-dark-800 border-2 ${getStatusColor(step.status)}`}>
                  {getStatusIcon(step.status)}
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${
                      step.status === 'completed' ? 'text-white' : 
                      step.status === 'pending' ? 'text-yellow-400' : 
                      step.status === 'error' ? 'text-red-400' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </h4>
                    <span className={`text-xs ${
                      step.status === 'completed' ? 'text-green-400' : 
                      step.status === 'pending' ? 'text-yellow-400' : 'text-gray-500'
                    }`}>
                      {step.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm text-white font-medium">
              {steps.filter(s => s.status === 'completed').length} / {steps.length}
            </span>
          </div>
          <div className="w-full h-2 bg-dark-600 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ 
                width: `${(steps.filter(s => s.status === 'completed').length / steps.length) * 100}%` 
              }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-primary rounded-full"
            />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default TransactionTimeline
