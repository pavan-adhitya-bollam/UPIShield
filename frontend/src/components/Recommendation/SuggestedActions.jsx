import { motion } from 'framer-motion'
import { Check, Shield, X, AlertTriangle, ArrowRight } from 'lucide-react'
import Button from '../Button'

const SuggestedActions = ({ riskLevel = 'LOW', actions = [], onProceed, onVerifyMpin, onCancel, onReport }) => {
  const getVisibleActions = () => {
    return actions.filter(action => action.visibleFor.includes(riskLevel))
  }

  const handleAction = (action) => {
    switch (action.label) {
      case 'Proceed Payment':
        if (onProceed) onProceed()
        break
      case 'Enter MPIN':
        if (onVerifyMpin) onVerifyMpin()
        break
      case 'Cancel Payment':
        if (onCancel) onCancel()
        break
      case 'Report Suspicious':
        if (onReport) onReport()
        break
      default:
        break
    }
  }

  const getButtonVariant = (variant) => {
    switch (variant) {
      case 'primary':
        return 'default'
      case 'secondary':
        return 'secondary'
      case 'danger':
        return 'danger'
      case 'warning':
        return 'warning'
      default:
        return 'default'
    }
  }

  const visibleActions = getVisibleActions()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-3">
        {visibleActions.map((action, index) => {
          const Icon = action.icon
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                onClick={() => handleAction(action)}
                variant={getButtonVariant(action.variant)}
                className="w-full"
                size="lg"
              >
                <Icon className="w-5 h-5 mr-2" />
                {action.label}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )
        })}

        {/* Risk-specific warning */}
        {riskLevel === 'HIGH' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium mb-1">High Risk Transaction</p>
                <p className="text-gray-400 text-sm">
                  This transaction has been flagged as high risk. We recommend cancelling or reporting this transaction.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {riskLevel === 'CRITICAL' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <p className="text-purple-400 font-medium mb-1">Critical Risk Detected</p>
                <p className="text-gray-400 text-sm">
                  This transaction has been blocked due to critical risk factors. Your account may be under review.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {riskLevel === 'MEDIUM' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-yellow-400 font-medium mb-1">Medium Risk Detected</p>
                <p className="text-gray-400 text-sm">
                  Additional verification is recommended for this transaction to ensure security.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {riskLevel === 'LOW' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-green-400 font-medium mb-1">Safe Transaction</p>
                <p className="text-gray-400 text-sm">
                  This transaction has passed all security checks and is safe to proceed.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default SuggestedActions
