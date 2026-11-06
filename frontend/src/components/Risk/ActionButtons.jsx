import { motion } from 'framer-motion'
import { Check, Shield, X, ArrowRight, Lock } from 'lucide-react'
import Button from '../Button'

const ActionButtons = ({ riskLevel = 'LOW', onProceed, onVerifyMpin, onBlock }) => {
  const getButtonConfig = (level) => {
    switch (level) {
      case 'LOW':
        return {
          primaryAction: {
            label: 'Proceed Payment',
            icon: Check,
            color: 'bg-gradient-primary',
            onClick: onProceed
          },
          secondaryAction: null
        }
      case 'MEDIUM':
        return {
          primaryAction: {
            label: 'Enter MPIN',
            icon: Shield,
            color: 'bg-gradient-secondary',
            onClick: onVerifyMpin
          },
          secondaryAction: {
            label: 'Cancel',
            icon: X,
            onClick: () => {}
          }
        }
      case 'HIGH':
        return {
          primaryAction: {
            label: 'Block Transaction',
            icon: Lock,
            color: 'bg-red-500',
            onClick: onBlock
          },
          secondaryAction: {
            label: 'Review Details',
            icon: ArrowRight,
            onClick: () => {}
          }
        }
      default:
        return {
          primaryAction: {
            label: 'Proceed Payment',
            icon: Check,
            color: 'bg-gradient-primary',
            onClick: onProceed
          },
          secondaryAction: null
        }
    }
  }

  const config = getButtonConfig(riskLevel)
  const PrimaryIcon = config.primaryAction.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-3">
        {/* Primary Action */}
        <Button
          onClick={config.primaryAction.onClick}
          className={`w-full ${config.primaryAction.color}`}
          size="lg"
        >
          <PrimaryIcon className="w-5 h-5 mr-2" />
          {config.primaryAction.label}
        </Button>

        {/* Secondary Action */}
        {config.secondaryAction && (
          <Button
            onClick={config.secondaryAction.onClick}
            variant="secondary"
            className="w-full"
            size="lg"
          >
            {(() => {
              const SecondaryIcon = config.secondaryAction.icon
              return <SecondaryIcon className="w-5 h-5 mr-2" />
            })()}
            {config.secondaryAction.label}
          </Button>
        )}

        {/* Risk Warning for HIGH risk */}
        {riskLevel === 'HIGH' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-red-400 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium mb-1">High Risk Transaction Detected</p>
                <p className="text-gray-400 text-sm">
                  This transaction has been flagged as high risk. We recommend blocking this transaction to protect your account.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Caution Warning for MEDIUM risk */}
        {riskLevel === 'MEDIUM' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-yellow-400 font-medium mb-1">Additional Verification Required</p>
                <p className="text-gray-400 text-sm">
                  This transaction requires a 6-digit MPIN to proceed. This is a security measure to protect your account.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Safe message for LOW risk */}
        {riskLevel === 'LOW' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-green-400 font-medium mb-1">Safe to Proceed</p>
                <p className="text-gray-400 text-sm">
                  This transaction has passed all security checks. You can proceed with the payment.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default ActionButtons
