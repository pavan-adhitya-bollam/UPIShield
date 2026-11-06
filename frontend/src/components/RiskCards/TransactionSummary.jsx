import { motion } from 'framer-motion'
import { User, IndianRupee, FileText, Clock, MapPin, Smartphone, Building2, CreditCard } from 'lucide-react'
import Card from '../Card'

const TransactionSummary = ({ summary = {} }) => {
  const formatTime = (isoString) => {
    if (!isoString) {
      return '-'
    }

    return new Date(isoString).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const amount = Number(summary.amount || 0)
  const charges = 0
  const location = typeof summary.location === 'string'
    ? summary.location
    : summary.location?.city || summary.locationInfo?.city || '-'
  const device = typeof summary.device === 'string'
    ? summary.device
    : summary.device?.deviceName || summary.deviceInfo?.deviceName || '-'
  const ipAddress = summary.ipAddress || summary.device?.ipAddress || '-'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-400" />
          Transaction Summary
        </h3>

        <div className="space-y-3">
          {/* Sender */}
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">SENDER</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-white font-medium">{summary.sender?.name || '-'}</span>
              </div>
              <span className="text-gray-400 text-sm">{summary.sender?.upiId || '-'}</span>
            </div>
          </div>

          {/* Receiver */}
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">RECEIVER</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-white font-medium">{summary.receiver?.name || '-'}</span>
              </div>
              <span className="text-gray-400 text-sm">{summary.receiver?.upiId || '-'}</span>
            </div>
          </div>

          {/* Amount */}
          <div className="p-3 bg-gradient-primary/20 border border-primary-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-primary-400" />
                <span className="text-gray-300">Amount</span>
              </div>
              <span className="text-2xl font-bold text-white">
                ₹{amount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Purpose */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">Purpose</span>
            </div>
            <span className="text-white font-medium">{summary.purpose || 'Optional'}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <span className="text-gray-400 text-sm">Charges</span>
            <span className="text-white font-medium">₹{charges}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-primary/20 border border-primary-500/30 rounded-lg">
            <span className="text-gray-300 font-medium">Total Amount</span>
            <span className="text-2xl font-bold text-white">₹{(amount + charges).toLocaleString('en-IN')}</span>
          </div>

          {/* Transaction Time */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">Time</span>
            </div>
            <span className="text-white text-sm">{formatTime(summary.transactionTime)}</span>
          </div>

          {/* Location */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">Location</span>
            </div>
            <span className="text-white text-sm">{location}</span>
          </div>

          {/* Transaction Type */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">Type</span>
            </div>
            <span className="text-white text-sm">{summary.transactionType || '-'}</span>
          </div>

          {/* Device */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">Device</span>
            </div>
            <span className="text-white text-sm">{device}</span>
          </div>

          {/* IP Address */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">IP Address</span>
            </div>
            <span className="text-white text-sm font-mono">{ipAddress}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default TransactionSummary
