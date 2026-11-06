import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../../components/Dashboard/Sidebar'
import TopNavbar from '../../components/Dashboard/TopNavbar'
import StatCard from '../../widgets/StatCard'
import Card from '../../components/Card'
import Button from '../../components/Button'
import TransactionDetails from '../../components/TransactionDetails/TransactionDetails'
import FraudDetectionTable from '../../components/Tables/FraudDetectionTable'
import RiskDistributionChart from '../../components/Analytics/RiskDistributionChart'
import FraudTrendChart from '../../components/Analytics/FraudTrendChart'
import FraudVsGenuineChart from '../../components/Charts/FraudVsGenuineChart'
import transactionService from '../../services/transactionService'
import { deriveTransactionAnalytics, emptyTransactionAnalytics } from '../../utils/transactionAnalytics'

const FraudDetectionPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
    riskLevel: 'All',
    predictionStatus: 'All'
  })
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [reviewNote, setReviewNote] = useState('')
  const [analytics, setAnalytics] = useState(emptyTransactionAnalytics)
  const [actionMessage, setActionMessage] = useState('Live user transaction data.')

  useEffect(() => {
    let active = true
    transactionService.getAllTransactionHistory()
      .then((transactions) => {
        if (active) setAnalytics(deriveTransactionAnalytics(transactions))
      })
      .catch(() => {
        if (active) setAnalytics(emptyTransactionAnalytics)
      })
    return () => { active = false }
  }, [])

  const handleFiltersChange = (nextFilters) => setFilters(nextFilters)
  const handleViewDetails = (transaction) => setSelectedTransaction(transaction)
  const handleCloseDetails = () => setSelectedTransaction(null)

  const handleAction = (label) => {
    setActionMessage(`${label} action recorded for ${selectedTransaction?.id}.`) 
  }

  const topRisks = [...analytics.transactions]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-dark-900">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="min-w-0 transition-all duration-300">
        <TopNavbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        <main className="p-4 lg:p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-primary-400 mb-2">Fraud Detection</p>
                <h1 className="text-3xl lg:text-4xl font-bold gradient-text">Transaction Risk Monitoring</h1>
                <p className="mt-2 text-gray-400 max-w-2xl">
                  Monitor recent transaction risk, investigate suspicious activity, and review fraud predictions with a secure analyst-ready interface.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-dark-800/70 p-4 text-sm text-gray-400">
                <span className="font-medium text-gray-200">Source:</span> Authenticated user transaction history and persisted model predictions.
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              {[
                { id: 'total', title: 'Total Transactions', value: analytics.totalTransactions.toLocaleString(), trend: null, label: 'count' },
                { id: 'fraud', title: 'Model-predicted Fraud', value: analytics.fraudulentTransactions.toLocaleString(), trend: null, label: 'count' },
                { id: 'rate', title: 'Average Risk Score', value: `${analytics.averageRiskScore.toFixed(1)}%`, trend: null, label: 'rate' }
              ].map((metric) => (
                <StatCard
                  key={metric.id}
                  title={metric.title}
                  value={metric.value}
                  trend={metric.trend}
                  icon={() => null}
                  color={metric.label === 'rate' ? 'red' : metric.label === 'count' ? 'accent' : 'primary'}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
              <div className="xl:col-span-3">
                <FraudDetectionTable
                  data={analytics.transactions}
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onViewDetails={handleViewDetails}
                />
              </div>
              <div className="space-y-6">
                <RiskDistributionChart data={analytics.riskDistribution} />
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">Top Fraud Indicators</h2>
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Contribution</span>
                  </div>
                  <div className="space-y-4">
                    {analytics.typeRiskIndicators.map((indicator) => (
                      <div key={indicator.title} className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-gray-200">
                          <span>{indicator.title}</span>
                          <span>{indicator.detail}</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full bg-gradient-primary" style={{ width: '100%' }} />
                        </div>
                        <p className="text-xs text-gray-500">Derived from authenticated transactions.</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
              <div className="xl:col-span-2">
                <FraudVsGenuineChart data={analytics.fraudVsGenuine} />
              </div>
              <div className="space-y-6">
                <FraudTrendChart data={analytics.fraudTrendData} />
              </div>
            </div>

            <Card>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Suspicious Transactions</h2>
                  <p className="text-sm text-gray-400">Highest-risk items prioritized for review.</p>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Live feed</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topRisks.map((transaction) => (
                  <div key={transaction.id} className="rounded-3xl border border-white/10 bg-dark-800/80 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-400">{transaction.transactionType}</p>
                        <h3 className="text-lg font-semibold text-white">{transaction.id}</h3>
                        <p className="text-sm text-gray-400 mt-1">{transaction.senderUpi} → {transaction.receiverUpi}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-white">₹{transaction.amount.toLocaleString()}</p>
                        <span className="text-xs uppercase tracking-[0.2em] text-red-400">{transaction.riskLevel}</span>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-400">
                      <div>
                        <p className="font-medium text-white">Score</p>
                        <p>{transaction.riskScore}</p>
                      </div>
                      <div>
                        <p className="font-medium text-white">Fraud %</p>
                        <p>{transaction.fraudProbability}%</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(transaction)}>
                        View Details
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handleAction('Analyze')}>
                        Analyze
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="mt-6 p-4 rounded-3xl bg-dark-800/70 border border-white/10">
              <p className="text-xs uppercase tracking-[0.25em] text-primary-400 mb-2">Action Log</p>
              <p className="text-sm text-gray-400">{actionMessage}</p>
            </div>
          </motion.div>

          <TransactionDetails
            transaction={selectedTransaction}
            isOpen={Boolean(selectedTransaction)}
            onClose={handleCloseDetails}
          />
        </main>
      </div>
    </div>
  )
}

export default FraudDetectionPage
