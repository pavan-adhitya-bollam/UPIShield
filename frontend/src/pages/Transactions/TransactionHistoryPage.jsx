import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../../components/Filters/PageHeader'
import TransactionStats from '../../components/Filters/TransactionStats'
import TransactionFilters from '../../components/Filters/TransactionFilters'
import TransactionTable from '../../components/TransactionTable/TransactionTable'
import TransactionDetails from '../../components/TransactionDetails/TransactionDetails'
import AIFraudAnalysis from '../../components/TransactionDetails/AIFraudAnalysis'
import TransactionHistoryTimeline from '../../components/Timeline/TransactionHistoryTimeline'
import ReceiptPreview from '../../components/Receipt/ReceiptPreview'
import TablePagination from '../../components/Pagination/TablePagination'
import EmptyState from '../../components/Filters/EmptyState'
import LoadingState from '../../components/Filters/LoadingState'
import DailyTransactionsChart from '../../components/Analytics/DailyTransactionsChart'
import MonthlySpendingChart from '../../components/Analytics/MonthlySpendingChart'
import TransactionCategoriesChart from '../../components/Analytics/TransactionCategoriesChart'
import RiskDistributionChart from '../../components/Analytics/RiskDistributionChart'
import FraudTrendChart from '../../components/Analytics/FraudTrendChart'
import SuccessVsFailedChart from '../../components/Analytics/SuccessVsFailedChart'
import transactionService from '../../services/transactionService'
import { deriveTransactionAnalytics, normalizeTransaction } from '../../utils/transactionAnalytics'

const TransactionHistoryPage = () => {
  const [loading, setLoading] = useState(true)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [filters, setFilters] = useState({
    globalSearch: '',
    dateRange: { from: '', to: '' },
    amountRange: { min: '', max: '' },
    transactionType: 'All',
    status: 'All',
    riskLevel: 'All',
    merchantCategory: 'All',
    paymentMethod: 'All',
    sortBy: 'newest'
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10
  })

  const loadTransactions = async () => {
    setLoading(true)
    try {
      const historyItems = await transactionService.getAllTransactionHistory()
      const normalizedTransactions = historyItems.map(normalizeTransaction)
      setTransactions(normalizedTransactions)
      setFilteredTransactions(normalizedTransactions)
    } catch (error) {
      setTransactions([])
      setFilteredTransactions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  useEffect(() => {
    if (!loading) {
      applyFilters()
    }
  }, [filters, transactions])

  const applyFilters = () => {
    let filtered = [...transactions]

    // Global search
    if (filters.globalSearch) {
      const search = filters.globalSearch.toLowerCase()
      filtered = filtered.filter(t =>
        t.id.toLowerCase().includes(search) ||
        t.receiver.toLowerCase().includes(search) ||
        t.receiverUpi.toLowerCase().includes(search) ||
        t.referenceNumber.toLowerCase().includes(search)
      )
    }

    // Date range
    if (filters.dateRange.from) {
      filtered = filtered.filter(t => t.date >= filters.dateRange.from)
    }
    if (filters.dateRange.to) {
      filtered = filtered.filter(t => t.date <= filters.dateRange.to)
    }

    // Amount range
    if (filters.amountRange.min) {
      filtered = filtered.filter(t => t.amount >= Number(filters.amountRange.min))
    }
    if (filters.amountRange.max) {
      filtered = filtered.filter(t => t.amount <= Number(filters.amountRange.max))
    }

    // Transaction type
    if (filters.transactionType !== 'All') {
      filtered = filtered.filter(t => t.transactionType === filters.transactionType)
    }

    // Status
    if (filters.status !== 'All') {
      filtered = filtered.filter(t => t.status === filters.status)
    }

    // Risk level
    if (filters.riskLevel !== 'All') {
      filtered = filtered.filter(t => t.riskLevel === filters.riskLevel)
    }

    // Merchant category
    if (filters.merchantCategory !== 'All') {
      filtered = filtered.filter(t => t.merchantCategory === filters.merchantCategory)
    }

    // Payment method
    if (filters.paymentMethod !== 'All') {
      filtered = filtered.filter(t => t.paymentMethod === filters.paymentMethod)
    }

    // Sort
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
        break
      case 'highestAmount':
        filtered.sort((a, b) => b.amount - a.amount)
        break
      case 'lowestAmount':
        filtered.sort((a, b) => a.amount - b.amount)
        break
      case 'highestRisk':
        filtered.sort((a, b) => b.fraudProbability - a.fraudProbability)
        break
      default:
        break
    }

    setFilteredTransactions(filtered)
    setPagination({ ...pagination, currentPage: 1 })
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleResetFilters = () => {
    setFilters({
      globalSearch: '',
      dateRange: { from: '', to: '' },
      amountRange: { min: '', max: '' },
      transactionType: 'All',
      status: 'All',
      riskLevel: 'All',
      merchantCategory: 'All',
      paymentMethod: 'All',
      sortBy: 'newest'
    })
  }

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction)
    setShowDetails(true)
    setShowReceipt(false)
  }

  const handleDownloadReceipt = (transaction) => {
    setSelectedTransaction(transaction)
    setShowReceipt(true)
    setShowDetails(false)
  }

  const handleShareReceipt = (transaction) => {
    console.log('Sharing receipt for:', transaction.id)
  }

  const handleCopyReference = (referenceNumber) => {
    navigator.clipboard.writeText(referenceNumber)
  }

  const handleReport = (transaction) => {
    console.log('Reporting transaction:', transaction.id)
  }

  const handleDownloadPDF = () => {
    console.log('Downloading PDF for:', selectedTransaction?.id)
  }

  const handlePrint = () => {
    window.print()
  }

  const handlePageChange = (page) => {
    setPagination({ ...pagination, currentPage: page })
  }

  const handleItemsPerPageChange = (items) => {
    setPagination({ ...pagination, itemsPerPage: items, currentPage: 1 })
  }

  const handleRefresh = () => {
    loadTransactions()
  }

  const handleDownloadReport = () => {
    console.log('Downloading report')
  }

  const handleExportCSV = () => {
    console.log('Exporting CSV')
  }

  const totalPages = Math.ceil(filteredTransactions.length / pagination.itemsPerPage)
  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage
  const endIndex = startIndex + pagination.itemsPerPage
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex)
  const analytics = deriveTransactionAnalytics(filteredTransactions)
  const transactionStats = {
    totalTransactions: { label: 'Total Transactions', value: analytics.totalTransactions.toLocaleString(), trend: '', icon: 'ArrowUpRight' },
    successfulPayments: { label: 'Successful Payments', value: analytics.successfulTransactions.toLocaleString(), trend: '', icon: 'CheckCircle' },
    failedPayments: { label: 'Failed Payments', value: analytics.failedTransactions.toLocaleString(), trend: '', icon: 'XCircle' },
    averageRisk: { label: 'Average Risk Score', value: `${analytics.averageRiskScore.toFixed(1)}%`, trend: '', icon: 'AlertTriangle' }
  }

  if (loading) {
    return <LoadingState />
  }

  return (
    <div className="min-h-screen bg-dark-900 p-4 lg:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Page Header */}
        <PageHeader
          onDownloadReport={handleDownloadReport}
          onExportCSV={handleExportCSV}
          onRefresh={handleRefresh}
        />

        {/* Statistics */}
        <TransactionStats stats={transactionStats} />

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DailyTransactionsChart data={analytics.dailyTransactionsData} />
          <MonthlySpendingChart data={analytics.monthlyTransactionData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <TransactionCategoriesChart data={analytics.transactionCategoriesData} />
          <RiskDistributionChart data={analytics.riskDistribution} />
          <SuccessVsFailedChart data={analytics.successVsFailedData} />
        </div>

        <div className="mb-6">
          <FraudTrendChart data={analytics.fraudTrendData} />
        </div>

        {/* Filters */}
        <TransactionFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Transaction Table */}
        {currentTransactions.length === 0 ? (
          <EmptyState onRefresh={handleRefresh} />
        ) : (
          <>
            <TransactionTable
              transactions={currentTransactions}
              onViewDetails={handleViewDetails}
              onDownloadReceipt={handleDownloadReceipt}
              onShareReceipt={handleShareReceipt}
              onCopyReference={handleCopyReference}
              onReport={handleReport}
            />

            {/* Pagination */}
            <TablePagination
              currentPage={pagination.currentPage}
              totalPages={totalPages}
              itemsPerPage={pagination.itemsPerPage}
              totalItems={filteredTransactions.length}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </>
        )}
      </motion.div>

      {/* Transaction Details Drawer */}
      <TransactionDetails
        transaction={selectedTransaction}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />

      {/* Receipt Preview Modal */}
      {showReceipt && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-dark-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Receipt</h3>
                <button
                  onClick={() => setShowReceipt(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <ReceiptPreview
                transaction={selectedTransaction}
                onDownloadPDF={handleDownloadPDF}
                onPrint={handlePrint}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default TransactionHistoryPage
