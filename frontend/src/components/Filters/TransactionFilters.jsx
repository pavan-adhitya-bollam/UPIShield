import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Calendar, SlidersHorizontal, ChevronDown, X } from 'lucide-react'
import Card from '../Card'
import { filterOptions } from '../../data/transactionHistoryData'

const TransactionFilters = ({ filters, onFilterChange, onReset }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, globalSearch: e.target.value })
  }

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const handleDateChange = (key, value) => {
    onFilterChange({ ...filters, dateRange: { ...filters.dateRange, [key]: value } })
  }

  const handleAmountChange = (key, value) => {
    onFilterChange({ ...filters, amountRange: { ...filters.amountRange, [key]: value } })
  }

  const resetFilters = () => {
    onReset()
    setIsExpanded(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <Card>
        {/* Global Search */}
        <div className="flex items-center gap-2 bg-dark-700/50 border border-white/10 rounded-xl px-4 py-3 mb-4">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by Transaction ID, Receiver Name, UPI ID, or Reference Number..."
            value={filters.globalSearch || ''}
            onChange={handleSearchChange}
            className="bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm w-full"
          />
          {filters.globalSearch && (
            <button
              onClick={() => handleFilterChange('globalSearch', '')}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors mb-4"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {isExpanded ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {/* Advanced Filters */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Date Range */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Date Range</label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 bg-dark-700/50 border border-white/10 rounded-lg px-3 py-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <input
                      type="date"
                      value={filters.dateRange?.from || ''}
                      onChange={(e) => handleDateChange('from', e.target.value)}
                      className="bg-transparent border-none outline-none text-white text-sm w-full"
                    />
                  </div>
                </div>
                <span className="text-gray-500">to</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 bg-dark-700/50 border border-white/10 rounded-lg px-3 py-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <input
                      type="date"
                      value={filters.dateRange?.to || ''}
                      onChange={(e) => handleDateChange('to', e.target.value)}
                      className="bg-transparent border-none outline-none text-white text-sm w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Amount Range */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Amount Range (₹)</label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.amountRange?.min || ''}
                    onChange={(e) => handleAmountChange('min', e.target.value)}
                    className="w-full bg-dark-700/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
                <span className="text-gray-500">to</span>
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.amountRange?.max || ''}
                    onChange={(e) => handleAmountChange('max', e.target.value)}
                    className="w-full bg-dark-700/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Filter Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Transaction Type</label>
                <select
                  value={filters.transactionType || 'All'}
                  onChange={(e) => handleFilterChange('transactionType', e.target.value)}
                  className="w-full bg-dark-700/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm cursor-pointer"
                >
                  {filterOptions.transactionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Status</label>
                <select
                  value={filters.status || 'All'}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full bg-dark-700/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm cursor-pointer"
                >
                  {filterOptions.statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Risk Level</label>
                <select
                  value={filters.riskLevel || 'All'}
                  onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
                  className="w-full bg-dark-700/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm cursor-pointer"
                >
                  {filterOptions.riskLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Merchant Category</label>
                <select
                  value={filters.merchantCategory || 'All'}
                  onChange={(e) => handleFilterChange('merchantCategory', e.target.value)}
                  className="w-full bg-dark-700/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm cursor-pointer"
                >
                  {filterOptions.merchantCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Payment Method</label>
                <select
                  value={filters.paymentMethod || 'All'}
                  onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                  className="w-full bg-dark-700/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm cursor-pointer"
                >
                  {filterOptions.paymentMethods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Sort By</label>
                <select
                  value={filters.sortBy || 'newest'}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full bg-dark-700/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm cursor-pointer"
                >
                  {filterOptions.sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex justify-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}

export default TransactionFilters
