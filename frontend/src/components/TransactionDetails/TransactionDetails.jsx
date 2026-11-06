import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Smartphone, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react'
import Card from '../Card'

const TransactionDetails = ({ transaction, isOpen, onClose }) => {
  const getRiskColor = (level) => {
    switch (level) {
      case 'LOW': return 'text-green-400 bg-green-500/20'
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/20'
      case 'HIGH': return 'text-orange-400 bg-orange-500/20'
      case 'CRITICAL': return 'text-red-400 bg-red-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getPaymentStatusConfig = (status) => {
    switch (status) {
      case 'Success':
        return { icon: CheckCircle, color: 'text-green-400' }
      case 'Pending':
        return { icon: Clock, color: 'text-yellow-400' }
      case 'Failed':
        return { icon: XCircle, color: 'text-red-400' }
      default:
        return { icon: Clock, color: 'text-gray-400' }
    }
  }

  if (!transaction) return null

  const paymentStatusConfig = getPaymentStatusConfig(transaction.paymentStatus)
  const PaymentStatusIcon = paymentStatusConfig.icon

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Side Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-dark-800 z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Transaction Details</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Transaction Info */}
              <Card className="mb-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Transaction ID</span>
                    <span className="text-sm text-white font-medium">{transaction.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Reference Number</span>
                    <span className="text-sm text-white font-mono">{transaction.referenceNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Amount</span>
                    <span className="text-2xl font-bold gradient-text">₹{transaction.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Payment Status</span>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${paymentStatusConfig.color} bg-white/5`}>
                      <PaymentStatusIcon className="w-3 h-3" />
                      {transaction.paymentStatus}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Risk Level</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(transaction.riskLevel)}`}>
                      {transaction.riskLevel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Fraud Probability</span>
                    <span className="text-sm font-medium text-red-400">{transaction.fraudProbability}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Confidence Score</span>
                    <span className="text-sm font-medium text-green-400">{transaction.confidenceScore}%</span>
                  </div>
                </div>
              </Card>

              {/* Sender Details */}
              <Card className="mb-4">
                <h3 className="text-sm font-semibold text-white mb-3">Sender Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Name</span>
                    <span className="text-sm text-white">{transaction.sender}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">UPI ID</span>
                    <span className="text-sm text-white font-mono">{transaction.senderUpi}</span>
                  </div>
                </div>
              </Card>

              {/* Receiver Details */}
              <Card className="mb-4">
                <h3 className="text-sm font-semibold text-white mb-3">Receiver Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Name</span>
                    <span className="text-sm text-white">{transaction.receiver}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">UPI ID</span>
                    <span className="text-sm text-white font-mono">{transaction.receiverUpi}</span>
                  </div>
                </div>
              </Card>

              {/* Transaction Info */}
              <Card className="mb-4">
                <h3 className="text-sm font-semibold text-white mb-3">Transaction Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Transaction Type</span>
                    <span className="text-sm text-white">{transaction.transactionType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Purpose</span>
                    <span className="text-sm text-white">{transaction.purpose}</span>
                  </div>
                  {transaction.merchantCategory && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Merchant Category</span>
                      <span className="text-sm text-white">{transaction.merchantCategory}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Payment Method</span>
                    <span className="text-sm text-white">{transaction.paymentMethod}</span>
                  </div>
                </div>
              </Card>

              {/* Time & Location */}
              <Card className="mb-4">
                <h3 className="text-sm font-semibold text-white mb-3">Time & Location</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Date</span>
                    <span className="text-sm text-white">{transaction.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Time</span>
                    <span className="text-sm text-white">{transaction.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-white">{transaction.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-white">{transaction.device}</span>
                  </div>
                </div>
              </Card>

              {/* Warning for High Risk */}
              {transaction.riskLevel === 'HIGH' || transaction.riskLevel === 'CRITICAL' && (
                <Card className="mb-4 bg-red-500/10 border-red-500/30">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-400 mb-1">High Risk Transaction</p>
                      <p className="text-xs text-gray-400">
                        This transaction was flagged as high risk by our fraud detection system.
                        Please review the details carefully.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default TransactionDetails
