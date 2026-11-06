import { motion } from 'framer-motion'
import { Download, Printer, CheckCircle, XCircle, AlertTriangle, Building2 } from 'lucide-react'
import Card from '../Card'

const ReceiptPreview = ({ transaction, onDownloadPDF, onPrint }) => {
  const getPaymentStatusConfig = (status) => {
    switch (status) {
      case 'Success':
        return { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' }
      case 'Pending':
        return { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/20' }
      case 'Failed':
        return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20' }
      default:
        return { icon: CheckCircle, color: 'text-gray-400', bg: 'bg-gray-500/20' }
    }
  }

  if (!transaction) return null

  const paymentStatusConfig = getPaymentStatusConfig(transaction.paymentStatus)
  const PaymentStatusIcon = paymentStatusConfig.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Receipt Preview</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onPrint}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={onDownloadPDF}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Download PDF"
            >
              <Download className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="bg-white rounded-lg p-6 text-gray-900">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-lg">UPI Payment Receipt</h4>
                <p className="text-sm text-gray-500">Intelligent UPI Fraud Detection</p>
              </div>
            </div>
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${paymentStatusConfig.bg} ${paymentStatusConfig.color}`}>
              <PaymentStatusIcon className="w-3 h-3" />
              {transaction.paymentStatus}
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Transaction ID</span>
              <span className="text-sm font-medium">{transaction.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Reference Number</span>
              <span className="text-sm font-medium font-mono">{transaction.referenceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Date</span>
              <span className="text-sm font-medium">{transaction.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Time</span>
              <span className="text-sm font-medium">{transaction.time}</span>
            </div>
          </div>

          {/* Amount */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Transaction Amount</p>
            <p className="text-3xl font-bold text-gray-900">₹{transaction.amount.toLocaleString()}</p>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">From</p>
              <p className="text-sm font-medium">{transaction.sender}</p>
              <p className="text-xs text-gray-400 font-mono">{transaction.senderUpi}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">To</p>
              <p className="text-sm font-medium">{transaction.receiver}</p>
              <p className="text-xs text-gray-400 font-mono">{transaction.receiverUpi}</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Transaction Type</span>
              <span className="text-sm font-medium">{transaction.transactionType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Purpose</span>
              <span className="text-sm font-medium">{transaction.purpose}</span>
            </div>
            {transaction.merchantCategory && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Merchant Category</span>
                <span className="text-sm font-medium">{transaction.merchantCategory}</span>
              </div>
            )}
          </div>

          {/* Fraud Status */}
          <div className={`p-4 rounded-lg ${transaction.riskLevel === 'HIGH' || transaction.riskLevel === 'CRITICAL' ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-4 h-4 ${transaction.riskLevel === 'HIGH' || transaction.riskLevel === 'CRITICAL' ? 'text-red-500' : 'text-green-500'}`} />
                <span className="text-sm font-medium">Fraud Status</span>
              </div>
              <span className={`text-sm font-medium ${transaction.riskLevel === 'HIGH' || transaction.riskLevel === 'CRITICAL' ? 'text-red-500' : 'text-green-500'}`}>
                {transaction.riskLevel} Risk ({transaction.fraudProbability}%)
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-400">
              This receipt is generated by Intelligent UPI Fraud Detection System
            </p>
            <p className="text-xs text-gray-400 mt-1">
              For any queries, contact support@upifraud.com
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={onDownloadPDF}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button
            onClick={onPrint}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Receipt
          </button>
        </div>
      </Card>
    </motion.div>
  )
}

export default ReceiptPreview
