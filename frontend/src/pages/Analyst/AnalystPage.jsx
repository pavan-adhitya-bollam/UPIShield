import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../../components/Dashboard/Sidebar'
import TopNavbar from '../../components/Dashboard/TopNavbar'
import StatCard from '../../widgets/StatCard'
import Card from '../../components/Card'
import Button from '../../components/Button'
import TransactionDetails from '../../components/TransactionDetails/TransactionDetails'
import RiskDistributionChart from '../../components/Analytics/RiskDistributionChart'
import FraudByTypeChart from '../../components/Charts/FraudByTypeChart'
import FraudTrendChart from '../../components/Analytics/FraudTrendChart'
import SuccessVsFailedChart from '../../components/Analytics/SuccessVsFailedChart'
import DailyTransactionsChart from '../../components/Analytics/DailyTransactionsChart'
import transactionService from '../../services/transactionService'
import { deriveTransactionAnalytics, emptyTransactionAnalytics } from '../../utils/transactionAnalytics'

const AnalystPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedCase, setSelectedCase] = useState(null)
  const [notes, setNotes] = useState('')
  const [actionStatus, setActionStatus] = useState('')
  const [analytics, setAnalytics] = useState(emptyTransactionAnalytics)

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

  const handleOpenCase = (caseData) => setSelectedCase(caseData)
  const handleCloseCase = () => setSelectedCase(null)

  const handleAddNote = () => {
    if (notes.trim()) {
      setActionStatus(`Note added for ${selectedCase?.caseId}`)
      setNotes('')
    }
  }

  const handleAction = (label) => {
    setActionStatus(`${label} action applied to ${selectedCase?.caseId || 'selected case'}`)
  }

  const investigationQueue = useMemo(() => analytics.transactions
    .filter((transaction) => transaction.riskLevel === 'HIGH' || transaction.riskLevel === 'CRITICAL' || transaction.fraudProbability >= 50)
    .slice(0, 12)
    .map((transaction) => ({
      caseId: `CASE-${transaction.id}`,
      transactionId: transaction.id,
      customer: transaction.sender,
      amount: transaction.amount,
      riskScore: transaction.riskScore,
      riskLevel: transaction.riskLevel,
      fraudType: transaction.transactionType,
      assignedAnalyst: 'Fraud Operations',
      createdTime: `${transaction.date} ${transaction.time}`,
      status: 'NEW',
      transaction
    })), [analytics.transactions])

  const fraudCasesByType = useMemo(() => {
    const counts = new Map()
    analytics.transactions
      .filter((transaction) => transaction.riskLevel === 'HIGH' || transaction.riskLevel === 'CRITICAL' || transaction.fraudProbability >= 50)
      .forEach((transaction) => {
        const type = transaction.transactionType || 'Other'
        counts.set(type, (counts.get(type) || 0) + 1)
      })
    return [...counts.entries()].map(([type, fraud]) => ({ type, fraud }))
  }, [analytics.transactions])

  const overviewMetrics = [
    { id: 'total', title: 'Total Transactions', value: analytics.totalTransactions.toLocaleString(), trend: null },
    { id: 'fraud', title: 'High-risk Transactions', value: analytics.fraudulentTransactions.toLocaleString(), trend: null },
    { id: 'risk', title: 'Average Risk Score', value: `${analytics.averageRiskScore.toFixed(1)}%`, trend: null }
  ]

  return (
    <div className="min-h-screen bg-dark-900">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="min-w-0 transition-all duration-300">
        <TopNavbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        <main className="p-4 lg:p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-primary-400 mb-2">Analyst Workspace</p>
                <h1 className="text-3xl lg:text-4xl font-bold gradient-text">Fraud Investigation Center</h1>
                <p className="mt-2 text-gray-400 max-w-2xl">
                  Manage fraud cases, review suspicious transactions, and track investigation performance from one secure workspace.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-dark-800/70 p-4 text-sm text-gray-400">
                <span className="font-medium text-gray-200">Source:</span> Authenticated user transaction history and persisted model predictions.
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              {overviewMetrics.map((metric) => (
                <StatCard
                  key={metric.id}
                  title={metric.title}
                  value={metric.value}
                  trend={metric.trend}
                  icon={() => null}
                  color="primary"
                />
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
              <div className="xl:col-span-2">
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-white">Investigation Queue</h2>
                      <p className="text-sm text-gray-400">Open cases awaiting analyst review.</p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-500">{investigationQueue.length} cases</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px]">
                      <thead>
                        <tr className="border-b border-white/10 text-left text-xs text-gray-400 uppercase tracking-wider">
                          <th className="px-3 py-3">Case ID</th>
                          <th className="px-3 py-3">Transaction ID</th>
                          <th className="px-3 py-3">Customer</th>
                          <th className="px-3 py-3">Amount</th>
                          <th className="px-3 py-3">Risk Score</th>
                          <th className="px-3 py-3">Risk Level</th>
                          <th className="px-3 py-3">Fraud Type</th>
                          <th className="px-3 py-3">Analyst</th>
                          <th className="px-3 py-3">Created</th>
                          <th className="px-3 py-3">Status</th>
                          <th className="px-3 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {investigationQueue.map((caseItem) => (
                          <tr key={caseItem.caseId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="px-3 py-3 text-sm text-white font-medium">{caseItem.caseId}</td>
                            <td className="px-3 py-3 text-sm text-gray-300">{caseItem.transactionId}</td>
                            <td className="px-3 py-3 text-sm text-gray-300">{caseItem.customer}</td>
                            <td className="px-3 py-3 text-sm text-white">₹{caseItem.amount.toLocaleString()}</td>
                            <td className="px-3 py-3 text-sm text-white">{caseItem.riskScore}</td>
                            <td className="px-3 py-3 text-sm text-yellow-400">{caseItem.riskLevel}</td>
                            <td className="px-3 py-3 text-sm text-gray-300">{caseItem.fraudType}</td>
                            <td className="px-3 py-3 text-sm text-gray-300">{caseItem.assignedAnalyst}</td>
                            <td className="px-3 py-3 text-sm text-gray-400">{caseItem.createdTime}</td>
                            <td className="px-3 py-3 text-sm text-white">{caseItem.status}</td>
                            <td className="px-3 py-3 text-sm">
                              <button
                                onClick={() => handleOpenCase(caseItem)}
                                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-white transition-colors"
                              >
                                Review
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
              <div className="space-y-6">
                <RiskDistributionChart data={analytics.riskDistribution.map((entry) => ({ name: entry.name, value: entry.value, color: entry.color }))} />
                <SuccessVsFailedChart data={analytics.successVsFailedData} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <FraudByTypeChart data={fraudCasesByType} />
              <DailyTransactionsChart data={analytics.dailyTransactionsData} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
              <FraudTrendChart data={analytics.fraudTrendData} />
            </div>

            <div className="mt-6 p-4 rounded-3xl bg-dark-800/70 border border-white/10">
              <p className="text-sm text-gray-400">Case review actions are local to this analyst session. Transaction and risk data comes from the authenticated history API.</p>
              {actionStatus && <p className="mt-3 text-sm text-primary-400">{actionStatus}</p>}
            </div>
          </motion.div>

          <TransactionDetails
            transaction={selectedCase?.transaction}
            isOpen={Boolean(selectedCase)}
            onClose={handleCloseCase}
          />

          {selectedCase && (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h2 className="text-xl font-semibold text-white mb-4">Case Details</h2>
                <div className="grid gap-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-gray-400">Case ID</div>
                    <div className="text-sm text-white">{selectedCase.caseId}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-gray-400">Transaction ID</div>
                    <div className="text-sm text-white">{selectedCase.transactionId}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-gray-400">Assigned Analyst</div>
                    <div className="text-sm text-white">{selectedCase.assignedAnalyst}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-gray-400">Status</div>
                    <div className="text-sm text-white">{selectedCase.status}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-gray-400">Risk Level</div>
                    <div className="text-sm text-yellow-400">{selectedCase.riskLevel}</div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button variant="danger" onClick={() => handleAction('Confirm Fraud')}>Confirm Fraud</Button>
                  <Button variant="secondary" onClick={() => handleAction('Mark False Positive')}>Mark False Positive</Button>
                  <Button variant="ghost" onClick={() => handleAction('Escalate Case')}>Escalate Case</Button>
                </div>
              </Card>
              <Card>
                <h2 className="text-xl font-semibold text-white mb-4">Investigation Notes</h2>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={8}
                  placeholder="Add investigation notes..."
                  className="w-full bg-dark-700/50 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none"
                />
                <div className="mt-4 flex gap-3 flex-wrap">
                  <Button variant="primary" onClick={handleAddNote}>Add Note</Button>
                  <Button variant="ghost" onClick={() => setNotes('')}>Clear</Button>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default AnalystPage
