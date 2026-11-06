import { motion } from 'framer-motion'
import { Eye, Download, Share, Copy, Flag, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'
import Card from '../Card'

const TransactionTable = ({ transactions = [], onViewDetails, onDownloadReceipt, onShareReceipt, onCopyReference, onReport }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Completed':
        return { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' }
      case 'Blocked':
        return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20' }
      case 'Pending':
        return { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20' }
      case 'Failed':
        return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20' }
      default:
        return { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-500/20' }
    }
  }

  const getRiskColor = (level) => {
    switch (level) {
      case 'LOW': return 'text-green-400'
      case 'MEDIUM': return 'text-yellow-400'
      case 'HIGH': return 'text-orange-400'
      case 'CRITICAL': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getFraudColor = (probability) => {
    if (probability < 20) return 'text-green-400'
    if (probability < 50) return 'text-yellow-400'
    if (probability < 75) return 'text-orange-400'
    return 'text-red-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Transaction ID</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Sender</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Receiver</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Receiver UPI</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Amount</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Charges</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Total</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Type</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Date</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Time</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Status</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Risk Level</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Fraud %</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Payment Status</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Reference</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => {
                const statusConfig = getStatusConfig(txn.status)
                const StatusIcon = statusConfig.icon

                return (
                  <motion.tr
                    key={txn.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-2 text-sm text-white font-medium">{txn.id}</td>
                    <td className="py-3 px-2 text-sm text-gray-300">{txn.sender}</td>
                    <td className="py-3 px-2 text-sm text-gray-300">{txn.receiver}</td>
                    <td className="py-3 px-2 text-sm text-gray-400">{txn.receiverUpi}</td>
                    <td className="py-3 px-2 text-sm text-white font-medium">₹{txn.amount.toLocaleString()}</td>
                    <td className="py-3 px-2 text-sm text-gray-400">₹{txn.charges.toLocaleString()}</td>
                    <td className="py-3 px-2 text-sm text-white font-medium">₹{txn.totalAmount.toLocaleString()}</td>
                    <td className="py-3 px-2 text-sm text-gray-400">{txn.transactionType}</td>
                    <td className="py-3 px-2 text-sm text-gray-400">{txn.date}</td>
                    <td className="py-3 px-2 text-sm text-gray-400">{txn.time}</td>
                    <td className="py-3 px-2">
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {txn.status}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-sm font-medium ${getRiskColor(txn.riskLevel)}`}>{txn.riskLevel}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-sm font-medium ${getFraudColor(txn.fraudProbability)}`}>{txn.fraudProbability}%</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-sm font-medium ${txn.paymentStatus === 'Success' ? 'text-green-400' : txn.paymentStatus === 'Pending' ? 'text-yellow-400' : 'text-red-400'}`}>
                        {txn.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-400 font-mono">{txn.referenceNumber}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onViewDetails(txn)}
                          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => onDownloadReceipt(txn)}
                          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                          title="Download Receipt"
                        >
                          <Download className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => onShareReceipt(txn)}
                          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                          title="Share Receipt"
                        >
                          <Share className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => onCopyReference(txn.referenceNumber)}
                          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                          title="Copy Reference"
                        >
                          <Copy className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => onReport(txn)}
                          className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Report Transaction"
                        >
                          <Flag className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  )
}

export default TransactionTable
