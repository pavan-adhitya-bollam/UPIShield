import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Download, Filter, Calendar, SlidersHorizontal } from 'lucide-react'
import Card from '../../components/Card'
import DailyTransactionsChart from '../../components/Analytics/DailyTransactionsChart'
import MonthlySpendingChart from '../../components/Analytics/MonthlySpendingChart'
import TransactionCategoriesChart from '../../components/Analytics/TransactionCategoriesChart'
import SuccessVsFailedChart from '../../components/Analytics/SuccessVsFailedChart'
import FraudTrendChart from '../../components/Analytics/FraudTrendChart'
import RiskDistributionChart from '../../components/Analytics/RiskDistributionChart'
import transactionService from '../../services/transactionService'
import { deriveTransactionAnalytics, emptyTransactionAnalytics, normalizeTransaction } from '../../utils/transactionAnalytics'

const AnalyticsPage = () => {
  const [filters, setFilters] = useState({
    dateRange: { from: '', to: '' },
    transactionType: 'All',
    riskLevel: 'All',
    fraudStatus: 'All',
    merchantCategory: 'All',
    location: 'All',
    amountRange: { min: '', max: '' },
    query: ''
  })
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    let active = true
    transactionService.getAllTransactionHistory()
      .then((items) => {
        if (active) setTransactions(items.map(normalizeTransaction))
      })
      .catch(() => {
        if (active) setTransactions([])
      })
    return () => { active = false }
  }, [])

  const filteredTransactions = useMemo(() => {
    let data = [...transactions]

    if (filters.query) {
      const search = filters.query.toLowerCase()
      data = data.filter((tx) =>
        tx.id.toLowerCase().includes(search) ||
        tx.sender.toLowerCase().includes(search) ||
        tx.receiver.toLowerCase().includes(search) ||
        (tx.merchantCategory || '').toLowerCase().includes(search) ||
        (tx.location || '').toLowerCase().includes(search)
      )
    }

    if (filters.dateRange.from) {
      data = data.filter((tx) => tx.date >= filters.dateRange.from)
    }
    if (filters.dateRange.to) {
      data = data.filter((tx) => tx.date <= filters.dateRange.to)
    }
    if (filters.transactionType !== 'All') {
      data = data.filter((tx) => tx.transactionType === filters.transactionType)
    }
    if (filters.riskLevel !== 'All') {
      data = data.filter((tx) => tx.riskLevel === filters.riskLevel)
    }
    if (filters.fraudStatus !== 'All') {
      data = data.filter((tx) =>
        filters.fraudStatus === 'Fraudulent' ? tx.fraudProbability >= 50 : tx.fraudProbability < 50
      )
    }
    if (filters.merchantCategory !== 'All') {
      data = data.filter((tx) => tx.merchantCategory === filters.merchantCategory)
    }
    if (filters.location !== 'All') {
      data = data.filter((tx) => tx.location === filters.location)
    }
    if (filters.amountRange.min) {
      data = data.filter((tx) => tx.amount >= Number(filters.amountRange.min))
    }
    if (filters.amountRange.max) {
      data = data.filter((tx) => tx.amount <= Number(filters.amountRange.max))
    }

    return data
  }, [filters, transactions])

  const analytics = useMemo(
    () => filteredTransactions.length ? deriveTransactionAnalytics(filteredTransactions) : emptyTransactionAnalytics,
    [filteredTransactions]
  )

  const overviewCards = useMemo(() => {
    const totalTransactions = filteredTransactions.length
    const totalAmount = filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0)
    const successfulTransactions = filteredTransactions.filter((tx) => tx.status === 'Completed').length
    const failedTransactions = filteredTransactions.filter((tx) => tx.status === 'Failed' || tx.status === 'Blocked').length
    const fraudulentTransactions = filteredTransactions.filter((tx) => tx.fraudProbability >= 50).length
    const fraudRate = totalTransactions ? ((fraudulentTransactions / totalTransactions) * 100).toFixed(1) : 0
    const averageAmount = totalTransactions ? Math.round(totalAmount / totalTransactions) : 0
    const averageRiskScore = totalTransactions
      ? (filteredTransactions.reduce((sum, tx) => sum + tx.fraudProbability, 0) / totalTransactions).toFixed(1)
      : 0

    return [
      { label: 'Total Transactions', value: totalTransactions.toLocaleString() },
      { label: 'Total Transaction Amount', value: `₹${totalAmount.toLocaleString()}` },
      { label: 'Successful Transactions', value: successfulTransactions.toLocaleString() },
      { label: 'Failed Transactions', value: failedTransactions.toLocaleString() },
      { label: 'Fraudulent Transactions', value: fraudulentTransactions.toLocaleString() },
      { label: 'Fraud Rate', value: `${fraudRate}%` },
      { label: 'Average Transaction Amount', value: `₹${averageAmount.toLocaleString()}` },
      { label: 'Average Risk Score', value: `${averageRiskScore}%` }
    ]
  }, [filteredTransactions])

  const filterOptions = {
    transactionTypes: ['All', 'P2P Transfer', 'Merchant Payment', 'Bill Payment', 'Subscription', 'Recharge'],
    riskLevels: ['All', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    fraudStatus: ['All', 'Fraudulent', 'Genuine'],
    merchantCategories: ['All', 'E-commerce', 'Food Delivery', 'Utilities', 'Entertainment', 'Travel', 'Healthcare'],
    locations: ['All', 'Mumbai', 'Bengaluru', 'Delhi', 'Chennai', 'Pune', 'Hyderabad']
  }

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleRangeChange = (field, key, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [key]: value
      }
    }))
  }

  const handleReset = () => {
    setFilters({
      dateRange: { from: '', to: '' },
      transactionType: 'All',
      riskLevel: 'All',
      fraudStatus: 'All',
      merchantCategory: 'All',
      location: 'All',
      amountRange: { min: '', max: '' },
      query: ''
    })
  }

  return (
    <div className="min-h-screen bg-dark-900 p-4 lg:p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[.3em] text-primary-400 mb-2">Analytics</p>
            <h1 className="text-3xl lg:text-4xl font-bold text-white">Transaction & Fraud Analytics</h1>
            <p className="mt-2 text-gray-400 max-w-2xl">Focused transaction behavior, UPI activity, fraud risk, and operational analytics for the fraud detection platform.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="inline-flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white hover:bg-white/10 transition-colors"
              onClick={handleReset}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Reset Filters
            </button>
            <button
              className="inline-flex items-center gap-2 px-4 py-3 bg-gradient-primary text-white rounded-xl text-sm shadow-lg shadow-primary-500/20 hover:opacity-95"
            >
              <Download className="w-4 h-4" />
              Download Report
            </button>
          </div>
        </div>

        <Card className="mb-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            {['Transaction Analytics', 'Fraud Analytics', 'Behavioral Analytics', 'Time Analysis'].map((title, index) => (
              <div key={title} className="p-4 bg-dark-800/70 rounded-3xl border border-white/10">
                <p className="text-sm text-gray-400 uppercase tracking-[.2em] mb-2">{title}</p>
                <p className="text-white text-lg font-semibold">{index === 0 ? 'Insights' : index === 1 ? 'Detection' : index === 2 ? 'Behavior' : 'Timing'}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mb-6">
          {overviewCards.map((card) => (
            <Card key={card.label} className="p-5 border border-white/10">
              <p className="text-sm text-gray-400 uppercase tracking-[.25em] mb-3">{card.label}</p>
              <p className="text-2xl font-semibold text-white">{card.value}</p>
            </Card>
          ))}
        </div>

        <Card className="mb-6">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
            <div className="xl:col-span-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-dark-900/70 p-4 rounded-3xl border border-white/10">
                  <p className="text-sm text-gray-400 uppercase tracking-[.25em] mb-2">Search</p>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      value={filters.query}
                      onChange={(e) => handleFilterChange('query', e.target.value)}
                      placeholder="Search by ID, merchant, location..."
                      className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white text-sm outline-none"
                    />
                  </div>
                </div>
                <div className="bg-dark-900/70 p-4 rounded-3xl border border-white/10">
                  <p className="text-sm text-gray-400 uppercase tracking-[.25em] mb-2">Date Range</p>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={filters.dateRange.from}
                      onChange={(e) => handleRangeChange('dateRange', 'from', e.target.value)}
                      className="w-full bg-dark-800 border border-white/10 rounded-xl px-3 py-3 text-white text-sm outline-none"
                    />
                    <input
                      type="date"
                      value={filters.dateRange.to}
                      onChange={(e) => handleRangeChange('dateRange', 'to', e.target.value)}
                      className="w-full bg-dark-800 border border-white/10 rounded-xl px-3 py-3 text-white text-sm outline-none"
                    />
                  </div>
                </div>
                <div className="bg-dark-900/70 p-4 rounded-3xl border border-white/10">
                  <p className="text-sm text-gray-400 uppercase tracking-[.25em] mb-2">Amount Range</p>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.amountRange.min}
                      onChange={(e) => handleRangeChange('amountRange', 'min', e.target.value)}
                      className="w-full bg-dark-800 border border-white/10 rounded-xl px-3 py-3 text-white text-sm outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.amountRange.max}
                      onChange={(e) => handleRangeChange('amountRange', 'max', e.target.value)}
                      className="w-full bg-dark-800 border border-white/10 rounded-xl px-3 py-3 text-white text-sm outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {['transactionType', 'riskLevel', 'fraudStatus', 'merchantCategory', 'location'].map((field, index) => (
                  <div key={field} className="bg-dark-900/70 p-4 rounded-3xl border border-white/10">
                    <p className="text-sm text-gray-400 uppercase tracking-[.25em] mb-2">
                      {field === 'transactionType'
                        ? 'Transaction Type'
                        : field === 'riskLevel'
                        ? 'Risk Level'
                        : field === 'fraudStatus'
                        ? 'Fraud/Genuine'
                        : field === 'merchantCategory'
                        ? 'Merchant Category'
                        : 'Location'}
                    </p>
                    <select
                      value={filters[field]}
                      onChange={(e) => handleFilterChange(field, e.target.value)}
                      className="w-full bg-dark-800 border border-white/10 rounded-xl px-3 py-3 text-white text-sm outline-none cursor-pointer"
                    >
                      {(
                        field === 'transactionType' ? filterOptions.transactionTypes
                          : field === 'riskLevel' ? filterOptions.riskLevels
                          : field === 'fraudStatus' ? filterOptions.fraudStatus
                          : field === 'merchantCategory' ? filterOptions.merchantCategories
                          : filterOptions.locations
                      ).map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
            <div className="xl:col-span-1 bg-dark-900/70 p-4 rounded-3xl border border-white/10">
              <p className="text-sm text-gray-400 uppercase tracking-[.25em] mb-4">Analytics Notes</p>
              <ul className="space-y-3 text-sm text-gray-300">
                <li>Analytics use the authenticated user transaction history.</li>
                <li>Charts refresh dynamically based on filters.</li>
                <li>Risk indicators reflect persisted model predictions.</li>
              </ul>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <DailyTransactionsChart data={analytics.dailyTransactionsData} />
          <MonthlySpendingChart data={analytics.monthlyTransactionData} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          <SuccessVsFailedChart data={analytics.successVsFailedData} />
          <TransactionCategoriesChart data={analytics.transactionCategoriesData.map((item) => ({ name: item.category, value: item.count, color: '#8b5cf6' }))} />
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <p className="text-lg font-semibold text-white">Merchant Category Distribution</p>
            </div>
            <div className="space-y-3">
              {analytics.transactionCategoriesData.map((item) => (
                <div key={item.category} className="flex items-center justify-between gap-3 p-4 bg-dark-800/70 rounded-3xl border border-white/10">
                  <div>
                    <p className="text-sm text-gray-400">{item.category}</p>
                    <p className="text-white font-semibold">{((item.amount / 1000000) * 100).toFixed(1)}K</p>
                  </div>
                  <div className="text-sm text-gray-400">{item.count} txns</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <FraudTrendChart data={analytics.fraudTrendData} />
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <p className="text-lg font-semibold text-white">Fraud Rate Trend</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {analytics.fraudTrendData.map((month) => (
                <div key={month.month} className="flex items-center justify-between gap-3 p-4 bg-dark-800/70 rounded-3xl border border-white/10">
                  <span className="text-gray-300">{month.month}</span>
                  <span className="text-white font-semibold">{month.genuine + month.fraud ? ((month.fraud / (month.genuine + month.fraud)) * 100).toFixed(1) : '0.0'}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          <RiskDistributionChart data={analytics.riskDistribution} />
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <p className="text-lg font-semibold text-white">Fraud by Transaction Type</p>
            </div>
            <div className="space-y-3">
              {analytics.typeRiskIndicators.slice(0, 4).map((item) => (
                <div key={item.id} className="bg-dark-800/70 p-4 rounded-3xl border border-white/10">
                  <p className="text-sm text-gray-400">{item.title}</p>
                  <p className="text-white font-semibold">{item.detail}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <p className="text-lg font-semibold text-white">Fraud by Time of Day</p>
            </div>
            <div className="space-y-3">
              {analytics.fraudByHour.map((item) => (
                <div key={item.period} className="bg-dark-800/70 p-4 rounded-3xl border border-white/10">
                  <div className="flex justify-between gap-3 text-gray-400 text-sm mb-2">
                    <span>{item.period}</span>
                    <span>{((item.fraud / item.transactions) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-500 to-pink-500" style={{ width: `${Math.min(100, (item.fraud / item.transactions) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <p className="text-lg font-semibold text-white">Behavioural Analytics</p>
            </div>
            <div className="space-y-4">
              {analytics.behavioralAnalytics.map((item) => (
                <div key={item.id} className="bg-dark-800/70 p-4 rounded-3xl border border-white/10">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <p className="text-white font-semibold">{item.title}</p>
                    <span className="text-primary-400 text-sm">{item.value}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                  <p className="text-gray-500 text-xs italic">{item.note}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <p className="text-lg font-semibold text-white">Top Risk Indicators</p>
            </div>
            <div className="space-y-3">
              {analytics.typeRiskIndicators.map((indicator) => (
                <div key={indicator.id} className="bg-dark-800/70 p-4 rounded-3xl border border-white/10">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <p className="text-white font-semibold">#{indicator.rank} {indicator.title}</p>
                  </div>
                  <p className="text-gray-400 text-sm">{indicator.detail}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <p className="text-lg font-semibold text-white">Top Transaction Locations</p>
            </div>
            <div className="space-y-3">
              {analytics.locationAnalytics.topLocations.map((item) => (
                <div key={item.name} className="bg-dark-800/70 p-4 rounded-3xl border border-white/10 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-white font-semibold">{item.name}</p>
                    <p className="text-gray-400 text-sm">{item.transactions.toLocaleString()} txns</p>
                  </div>
                  <span className="text-primary-400">{item.fraudRate}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <p className="text-lg font-semibold text-white">Top Fraud Locations</p>
            </div>
            <div className="space-y-3">
              {analytics.locationAnalytics.topFraudLocations.map((item) => (
                <div key={item.name} className="bg-dark-800/70 p-4 rounded-3xl border border-white/10 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-white font-semibold">{item.name}</p>
                    <p className="text-gray-400 text-sm">{item.fraudTransactions} fraud txns</p>
                  </div>
                  <span className="text-primary-400">{item.fraudRate}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}

export default AnalyticsPage
