import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import Card from '../Card'

const SimilarTransactions = ({ transactions = [] }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Completed':
        return {
          icon: CheckCircle,
          color: 'text-green-400',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30'
        }
      case 'Flagged':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/30'
        }
      case 'Blocked':
        return {
          icon: XCircle,
          color: 'text-red-400',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/30'
        }
      default:
        return {
          icon: CheckCircle,
          color: 'text-gray-400',
          bgColor: 'bg-gray-500/20',
          borderColor: 'border-gray-500/30'
        }
    }
  }

  const getRiskColor = (risk) => {
    if (risk < 20) return 'text-green-400'
    if (risk < 40) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-primary-400" />
          Similar Transactions
        </h3>

        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">No similar transactions found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((txn, index) => {
              const statusConfig = getStatusConfig(txn.status)
              const StatusIcon = statusConfig.icon

              return (
                <motion.div
                  key={txn.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border transition-all duration-200 hover:border-primary-500/30 ${statusConfig.borderColor}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white font-medium">{txn.id}</span>
                        <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                          {txn.status}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400">₹{txn.amount.toLocaleString()}</span>
                        <span className={`font-medium ${getRiskColor(txn.risk)}`}>
                          Risk: {txn.risk}%
                        </span>
                        <span className="text-gray-500">{txn.date}</span>
                      </div>
                    </div>
                    <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        <button className="w-full mt-4 text-sm text-primary-400 hover:text-primary-300 transition-colors">
          View All Transactions
        </button>
      </Card>
    </motion.div>
  )
}

export default SimilarTransactions
