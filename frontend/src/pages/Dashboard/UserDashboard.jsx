import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../../components/Dashboard/Sidebar'
import TopNavbar from '../../components/Dashboard/TopNavbar'
import StatCard from '../../widgets/StatCard'
import RiskScoreWidget from '../../widgets/RiskScoreWidget'
import FraudAlertWidget from '../../widgets/FraudAlertWidget'
import QuickActionsWidget from '../../widgets/QuickActionsWidget'
import NotificationsPanel from '../../widgets/NotificationsPanel'
import MonthlyTransactionChart from '../../charts/MonthlyTransactionChart'
import FraudVsGenuineChart from '../../charts/FraudVsGenuineChart'
import SpendingCategoriesChart from '../../charts/SpendingCategoriesChart'
import RecentTransactionsTable from '../../tables/RecentTransactionsTable'
import {
  ArrowUpRight,
  Calendar,
  IndianRupee,
  AlertTriangle,
  Shield,
  CheckCircle
} from 'lucide-react'
import transactionService from '../../services/transactionService'
import { deriveTransactionAnalytics, emptyTransactionAnalytics } from '../../utils/transactionAnalytics'
import { quickActions, notifications } from '../../data/dashboardData'

const UserDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [analytics, setAnalytics] = useState(emptyTransactionAnalytics)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  useEffect(() => {
    let active = true

    transactionService.getAllTransactionHistory()
      .then((transactions) => {
        if (active) {
          setAnalytics(deriveTransactionAnalytics(transactions))
        }
      })
      .catch(() => {
        if (active) setAnalytics(emptyTransactionAnalytics)
      })

    return () => { active = false }
  }, [])

  const stats = [
    ['Total Transactions', analytics.totalTransactions.toLocaleString(), ArrowUpRight, 'primary'],
    ["Today's Transactions", analytics.todayTransactions.toLocaleString(), Calendar, 'accent'],
    ['Total Amount Sent', `₹${analytics.totalAmount.toLocaleString()}`, IndianRupee, 'green'],
    ['Model-predicted Fraud', analytics.fraudulentTransactions.toLocaleString(), AlertTriangle, 'red'],
    ['Safe Transactions', Math.max(analytics.totalTransactions - analytics.fraudulentTransactions, 0).toLocaleString(), CheckCircle, 'blue']
  ]
  const riskStatus = analytics.averageRiskScore >= 75 ? 'CRITICAL' : analytics.averageRiskScore >= 50 ? 'HIGH' : analytics.averageRiskScore >= 25 ? 'MEDIUM' : 'LOW'
  const fraudAlerts = analytics.recentTransactions
    .filter((transaction) => ['HIGH', 'CRITICAL'].includes(transaction.riskLevel))
    .map((transaction) => ({
      id: transaction.id,
      riskLevel: transaction.riskLevel,
      probability: transaction.fraudProbability,
      transactionId: transaction.id,
      suggestedAction: 'Review transaction',
      time: transaction.time
    }))

  return (
    <div className="min-h-screen bg-dark-900">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="min-w-0 transition-all duration-300">
        <TopNavbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl lg:text-3xl font-bold gradient-text mb-6">
              Dashboard Overview
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
              {stats.map(([title, value, icon, color]) => (
                <StatCard key={title} title={title} value={value} icon={icon} color={color} />
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Left Column - Charts */}
              <div className="lg:col-span-2 space-y-6">
                <MonthlyTransactionChart data={analytics.monthlyTransactionData} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FraudVsGenuineChart data={analytics.fraudVsGenuine} />
                  <SpendingCategoriesChart data={analytics.spendingCategoriesData} />
                </div>

                <RecentTransactionsTable transactions={analytics.recentTransactions} />
              </div>

              {/* Right Column - Widgets */}
              <div className="space-y-6">
                <RiskScoreWidget
                  score={analytics.totalTransactions > 0 ? Math.round(analytics.averageRiskScore) : undefined}
                  status={riskStatus}
                />
                
                <QuickActionsWidget actions={quickActions} />
                
                <FraudAlertWidget alerts={fraudAlerts} />
                
                <NotificationsPanel notifications={notifications} />
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default UserDashboard
