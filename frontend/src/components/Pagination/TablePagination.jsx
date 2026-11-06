import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const TablePagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange
}) => {
  const rowsPerPageOptions = [10, 25, 50, 100]

  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems)

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-white/10"
    >
      {/* Rows per page */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Rows per page:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="bg-dark-700/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm cursor-pointer"
        >
          {rowsPerPageOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Page info */}
      <div className="text-sm text-gray-400">
        Showing {startIndex} to {endIndex} of {totalItems} transactions
      </div>

      {/* Pagination buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 text-gray-400" />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-gradient-primary text-white'
                  : page === '...'
                  ? 'text-gray-500 cursor-default'
                  : 'text-gray-400 hover:bg-white/10'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </motion.div>
  )
}

export default TablePagination
