import { motion } from 'framer-motion'
import { User, IndianRupee, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import Card from '../Card'

const TransactionSummary = ({ transactionData, riskLevel }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Safe':
        return 'text-green-400 bg-green-500/20'
      case 'Pending':
        return 'text-yellow-400 bg-yellow-500/20'
      case 'Blocked':
        return 'text-red-400 bg-red-500/20'
      default:
        return 'text-gray-400 bg-gray-500/20'
    }
  }

  const estimatedCharges = '0.00'
  const receiverName = transactionData?.receiverName || transactionData?.receiver?.name || 'Not verified'
  const receiverUpi = transactionData?.receiverUpiId || transactionData?.receiverUpi || transactionData?.receiver?.upiId || '-'
  const amount = Number(transactionData?.amount || 0)
  const transactionDate = transactionData?.transactionTime || transactionData?.createdAt

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Transaction Summary</h2>
          <p className="text-gray-400 text-sm">Review your payment details</p>
        </div>

        <div className="space-y-4">
          {/* Receiver */}
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-500/20 rounded-lg">
                <User className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Receiver</p>
                <p className="text-white font-medium">{receiverName}</p>
                <p className="text-xs text-gray-500">{receiverUpi}</p>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-500/20 rounded-lg">
                <IndianRupee className="w-5 h-5 text-accent-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Amount</p>
                <p className="text-white font-semibold text-lg">
                  ₹{amount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Purpose */}
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <FileText className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Purpose</p>
                <p className="text-white font-medium">{transactionData?.purpose || '-'}</p>
              </div>
            </div>
          </div>

          {/* Estimated Charges */}
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <IndianRupee className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Estimated Charges</p>
                <p className="text-white font-medium">₹{estimatedCharges}</p>
              </div>
            </div>
          </div>

          {/* Transaction Time */}
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Transaction Time</p>
                <p className="text-white font-medium">
                  {transactionDate ? new Date(transactionDate).toLocaleString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  }) : 'Not started'}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${riskLevel === 'LOW' ? 'bg-green-500/20' : riskLevel === 'MEDIUM' ? 'bg-yellow-500/20' : 'bg-red-500/20'}`}>
                {riskLevel === 'LOW' ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-400">Payment Status</p>
                <p className={`font-medium ${getStatusColor(riskLevel || 'Pending')} px-2 py-1 rounded-full text-xs inline-block`}>
                  {riskLevel === 'LOW' ? 'Safe to Proceed' : riskLevel === 'MEDIUM' ? 'Requires Verification' : 'High Risk'}
                </p>
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className="mt-6 p-4 bg-gradient-primary/20 border border-primary-500/30 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Total Amount</span>
              <span className="text-2xl font-bold text-white">
                ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default TransactionSummary
