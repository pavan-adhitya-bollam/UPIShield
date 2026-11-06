import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Eye, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react'
import Card from '../Card'

const FraudMonitoringTable = ({ data = [] }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Blocked':
        return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20' }
      case 'OTP Required':
        return { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20' }
      case 'Pending':
        return { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/20' }
      case 'Approved':
        return { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' }
      default:
        return { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-500/20' }
    }
  }

  const getRiskColor = (score) => {
    if (score >= 80) return 'text-red-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-blue-400'
    return 'text-green-400'
  }

  const filteredData = data.filter(item => {
    const matchesSearch = 
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredData.slice(startIndex, endIndex)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Fraud Monitoring
          </h3>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex items-center gap-2 bg-dark-700/50 border border-white/10 rounded-lg px-3 py-2 flex-1">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm w-full"
            />
          </div>
          <div className="flex items-center gap-2 bg-dark-700/50 border border-white/10 rounded-lg px-3 py-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-white text-sm cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="Blocked">Blocked</option>
              <option value="OTP Required">OTP Required</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Transaction ID</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">User</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Amount</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Risk Score</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Fraud %</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Status</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Time</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => {
                const statusConfig = getStatusConfig(item.status)
                const StatusIcon = statusConfig.icon

                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-2 text-sm text-white font-medium">{item.id}</td>
                    <td className="py-3 px-2 text-sm text-gray-300">{item.user}</td>
                    <td className="py-3 px-2 text-sm text-white">₹{item.amount.toLocaleString()}</td>
                    <td className="py-3 px-2 text-sm font-medium">
                      <span className={getRiskColor(item.riskScore)}>{item.riskScore}</span>
                    </td>
                    <td className="py-3 px-2 text-sm font-medium text-red-400">{item.fraudProbability}%</td>
                    <td className="py-3 px-2">
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {item.status}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-400">{item.time}</td>
                    <td className="py-3 px-2">
                      <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <p className="text-sm text-gray-400">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} transactions
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg bg-dark-700/50 border border-white/10 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg bg-dark-700/50 border border-white/10 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default FraudMonitoringTable
