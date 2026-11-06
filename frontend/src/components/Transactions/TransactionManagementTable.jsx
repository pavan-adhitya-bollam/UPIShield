import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Eye, CheckCircle, XCircle, Clock } from 'lucide-react'
import Card from '../Card'

const TransactionManagementTable = ({ transactions = [] }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [fraudFilter, setFraudFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Completed':
        return { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' }
      case 'Blocked':
        return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20' }
      case 'Pending':
        return { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20' }
      default:
        return { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-500/20' }
    }
  }

  const filteredData = transactions.filter(txn => {
    const matchesSearch = 
      txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.receiver.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || txn.status === statusFilter
    const matchesFraud = fraudFilter === 'all' || 
      (fraudFilter === 'fraud' && txn.fraud) ||
      (fraudFilter === 'genuine' && !txn.fraud)
    return matchesSearch && matchesStatus && matchesFraud
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
        <h3 className="text-lg font-semibold text-white mb-4">Transaction Management</h3>

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
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-dark-700/50 border border-white/10 rounded-lg px-3 py-2">
            <select
              value={fraudFilter}
              onChange={(e) => setFraudFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-white text-sm cursor-pointer"
            >
              <option value="all">All</option>
              <option value="fraud">Fraud</option>
              <option value="genuine">Genuine</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Transaction ID</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Sender</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Receiver</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Amount</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Status</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Fraud</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Date</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((txn, index) => {
                const statusConfig = getStatusConfig(txn.status)
                const StatusIcon = statusConfig.icon

                return (
                  <motion.tr
                    key={txn.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-2 text-sm text-white font-medium">{txn.id}</td>
                    <td className="py-3 px-2 text-sm text-gray-300">{txn.sender}</td>
                    <td className="py-3 px-2 text-sm text-gray-300">{txn.receiver}</td>
                    <td className="py-3 px-2 text-sm text-white">₹{txn.amount.toLocaleString()}</td>
                    <td className="py-3 px-2">
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {txn.status}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${txn.fraud ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {txn.fraud ? 'Fraud' : 'Genuine'}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-400">{txn.date}</td>
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

export default TransactionManagementTable
