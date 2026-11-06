import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Eye, Ban, CheckCircle } from 'lucide-react'
import Card from '../Card'

const UserManagementTable = ({ users = [] }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Active':
        return { color: 'text-green-400', bg: 'bg-green-500/20' }
      case 'Suspended':
        return { color: 'text-red-400', bg: 'bg-red-500/20' }
      default:
        return { color: 'text-gray-400', bg: 'bg-gray-500/20' }
    }
  }

  const getRiskColor = (score) => {
    if (score >= 70) return 'text-red-400'
    if (score >= 50) return 'text-yellow-400'
    if (score >= 30) return 'text-blue-400'
    return 'text-green-400'
  }

  const filteredData = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.upiId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
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
        <h3 className="text-lg font-semibold text-white mb-4">User Management</h3>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex items-center gap-2 bg-dark-700/50 border border-white/10 rounded-lg px-3 py-2 flex-1">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm w-full"
            />
          </div>
          <div className="flex items-center gap-2 bg-dark-700/50 border border-white/10 rounded-lg px-3 py-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-white text-sm cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Name</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Email</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">UPI ID</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Risk Score</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Status</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((user, index) => {
                const statusConfig = getStatusConfig(user.status)

                return (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-2 text-sm text-white font-medium">{user.name}</td>
                    <td className="py-3 px-2 text-sm text-gray-300">{user.email}</td>
                    <td className="py-3 px-2 text-sm text-gray-400">{user.upiId}</td>
                    <td className="py-3 px-2 text-sm font-medium">
                      <span className={getRiskColor(user.riskScore)}>{user.riskScore}</span>
                    </td>
                    <td className="py-3 px-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                        {user.status}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors" title="View">
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                        {user.status === 'Active' ? (
                          <button className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors" title="Suspend">
                            <Ban className="w-4 h-4 text-red-400" />
                          </button>
                        ) : (
                          <button className="p-1.5 hover:bg-green-500/20 rounded-lg transition-colors" title="Activate">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          </button>
                        )}
                      </div>
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
            Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} users
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

export default UserManagementTable
