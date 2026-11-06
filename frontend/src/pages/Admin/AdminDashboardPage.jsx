import { useState } from 'react'
import { motion } from 'framer-motion'
import AdminSidebar from '../../components/Admin/AdminSidebar'
import AdminTopNavbar from '../../components/Admin/AdminTopNavbar'
import AdminStatCard from '../../components/Widgets/AdminStatCard'
import DailyTransactionsChart from '../../components/Charts/DailyTransactionsChart'
import FraudTrendChart from '../../components/Charts/FraudTrendChart'
import FraudVsGenuineChart from '../../components/Charts/FraudVsGenuineChart'
import FraudByTypeChart from '../../components/Charts/FraudByTypeChart'
import MonthlyFraudTrendChart from '../../components/Charts/MonthlyFraudTrendChart'
import RiskLevelDistributionChart from '../../components/Charts/RiskLevelDistributionChart'
import FraudMonitoringTable from '../../components/Tables/FraudMonitoringTable'
import RecentFraudAlerts from '../../components/Widgets/RecentFraudAlerts'
import LiveActivityPanel from '../../components/Widgets/LiveActivityPanel'
import UserManagementTable from '../../components/Users/UserManagementTable'
import TransactionManagementTable from '../../components/Transactions/TransactionManagementTable'
import MLPerformancePanel from '../../components/Widgets/MLPerformancePanel'
import FeatureImportanceChart from '../../components/Charts/FeatureImportanceChart'
import FraudHeatmap from '../../components/Charts/FraudHeatmap'
import ReportSection from '../../components/Reports/ReportSection'
import NotificationsPanel from '../../components/Widgets/NotificationsPanel'
import {
  adminStats,
  dailyTransactionsData,
  fraudTrendData,
  fraudVsGenuineData,
  fraudByTypeData,
  monthlyFraudTrendData,
  riskLevelDistributionData,
  fraudMonitoringData,
  recentFraudAlerts,
  liveActivityData,
  usersData,
  transactionsData,
  mlPerformanceData,
  featureImportanceData,
  fraudHeatmapData,
  notificationsData
} from '../../data/adminDashboardData'

const AdminDashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <div className="min-h-screen bg-dark-900">
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-0' : 'lg:ml-72'}`}>
        <AdminTopNavbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold gradient-text">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 mt-1">
                Intelligent UPI Risk Assessment and Fraud Detection System
              </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <AdminStatCard
                label={adminStats.totalUsers.label}
                value={adminStats.totalUsers.value}
                trend={adminStats.totalUsers.trend}
                icon={adminStats.totalUsers.icon}
                color="primary"
              />
              <AdminStatCard
                label={adminStats.totalTransactions.label}
                value={adminStats.totalTransactions.value}
                trend={adminStats.totalTransactions.trend}
                icon={adminStats.totalTransactions.icon}
                color="accent"
              />
              <AdminStatCard
                label={adminStats.fraudDetectedToday.label}
                value={adminStats.fraudDetectedToday.value}
                trend={adminStats.fraudDetectedToday.trend}
                icon={adminStats.fraudDetectedToday.icon}
                color="red"
              />
              <AdminStatCard
                label={adminStats.modelAccuracy.label}
                value={adminStats.modelAccuracy.value}
                trend={adminStats.modelAccuracy.trend}
                icon={adminStats.modelAccuracy.icon}
                color="green"
              />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <DailyTransactionsChart data={dailyTransactionsData} />
              <FraudTrendChart data={fraudTrendData} />
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <FraudVsGenuineChart data={fraudVsGenuineData} />
              <FraudByTypeChart data={fraudByTypeData} />
              <RiskLevelDistributionChart data={riskLevelDistributionData} />
            </div>

            {/* Fraud Monitoring Table & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <FraudMonitoringTable data={fraudMonitoringData} />
              </div>
              <div>
                <RecentFraudAlerts alerts={recentFraudAlerts} />
              </div>
            </div>

            {/* Monthly Fraud Trend & Live Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <MonthlyFraudTrendChart data={monthlyFraudTrendData} />
              <LiveActivityPanel activities={liveActivityData} />
            </div>

            {/* User Management & Transaction Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <UserManagementTable users={usersData} />
              <TransactionManagementTable transactions={transactionsData} />
            </div>

            {/* ML Performance & Feature Importance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <MLPerformancePanel performance={mlPerformanceData} />
              <FeatureImportanceChart features={featureImportanceData} />
            </div>

            {/* Fraud Heatmap & Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <FraudHeatmap data={fraudHeatmapData} />
              <ReportSection />
            </div>

            {/* Notifications */}
            <div className="mb-6">
              <NotificationsPanel notifications={notificationsData} />
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <AdminStatCard
                label={adminStats.todayTransactions.label}
                value={adminStats.todayTransactions.value}
                trend={adminStats.todayTransactions.trend}
                icon={adminStats.todayTransactions.icon}
                color="blue"
              />
              <AdminStatCard
                label={adminStats.fraudPercentage.label}
                value={adminStats.fraudPercentage.value}
                trend={adminStats.fraudPercentage.trend}
                icon={adminStats.fraudPercentage.icon}
                color="yellow"
              />
              <AdminStatCard
                label={adminStats.blockedTransactions.label}
                value={adminStats.blockedTransactions.value}
                trend={adminStats.blockedTransactions.trend}
                icon={adminStats.blockedTransactions.icon}
                color="red"
              />
              <AdminStatCard
                label={adminStats.pendingVerification.label}
                value={adminStats.pendingVerification.value}
                trend={adminStats.pendingVerification.trend}
                icon={adminStats.pendingVerification.icon}
                color="purple"
              />
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboardPage
