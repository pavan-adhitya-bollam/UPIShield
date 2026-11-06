import { motion } from 'framer-motion'
import { Search, Smartphone, Monitor, MapPin, Globe, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import Card from '../Card'
import { loginHistory } from '../../data/settingsMockData'
import { useState } from 'react'

const LoginHistory = ({ history = loginHistory }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filteredHistory = history.filter(item =>
    item.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.browser.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ipAddress.includes(searchTerm)
  )

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredHistory.slice(startIndex, endIndex)

  const getStatusConfig = (status) => {
    return status === 'Success'
      ? { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' }
      : { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20' }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Login History</h2>
          <span className="text-sm text-gray-400">{filteredHistory.length} records</span>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-dark-700/50 border border-white/10 rounded-xl px-4 py-3 mb-6">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by device, browser, location, or IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm w-full"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Date</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Time</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Device</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Browser</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Location</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">IP Address</th>
                <th className="text-left text-xs text-gray-400 font-medium py-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => {
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
                    <td className="py-3 px-2 text-sm text-gray-300">{item.date}</td>
                    <td className="py-3 px-2 text-sm text-gray-300">{item.time}</td>
                    <td className="py-3 px-2 text-sm text-white">{item.device}</td>
                    <td className="py-3 px-2 text-sm text-gray-400">{item.browser}</td>
                    <td className="py-3 px-2 text-sm text-gray-400">{item.location}</td>
                    <td className="py-3 px-2 text-sm text-gray-400 font-mono">{item.ipAddress}</td>
                    <td className="py-3 px-2">
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {item.status}
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
          <div className="text-sm text-gray-400">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredHistory.length)} of {filteredHistory.length} records
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-gradient-primary text-white'
                      : 'text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-400 mb-1">Unusual Activity Detected</p>
              <p className="text-xs text-gray-400">
                If you see any failed login attempts from unknown devices or locations, 
                immediately change your password and enable two-factor authentication.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default LoginHistory
