import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import Card from '../components/Card'

const RecentTransactionsTable = ({ transactions = [] }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter transactions
  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch = 
      txn.receiver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = 
      filterStatus === 'all' || 
      txn.status.toLowerCase() === filterStatus.toLowerCase()
    
    return matchesSearch && matchesFilter
  })

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex)

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'Flagged':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'Blocked':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getRiskScoreColor = (score) => {
    if (score >= 80) return 'text-red-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-green-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10 pr-4 py-2 bg-dark-600/50 border border-white/10 rounded-lg 
                         focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 
                         transition-all duration-300 placeholder-gray-500 text-sm text-white w-full sm:w-48"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10 pr-4 py-2 bg-dark-600/50 border border-white/10 rounded-lg 
                         focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 
                         transition-all duration-300 text-sm text-white appearance-none cursor-pointer w-full sm:w-40"
              >
                <option value="all">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Flagged">Flagged</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Transaction ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Receiver</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Time</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Risk Score</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    No transactions found
                  </td>
                </tr>
              ) : (
                currentTransactions.map((txn, index) => (
                  <motion.tr
                    key={txn.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-white font-mono">{txn.id}</td>
                    <td className="py-3 px-4 text-sm text-white">{txn.receiver}</td>
                    <td className="py-3 px-4 text-sm text-white font-semibold">₹{txn.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-400">{txn.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-400">{txn.time}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(txn.status)}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-semibold ${getRiskScoreColor(txn.riskScore)}`}>
                        {txn.riskScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-400 hover:text-white" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <p className="text-sm text-gray-400">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              </button>
              <span className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

export default RecentTransactionsTable
