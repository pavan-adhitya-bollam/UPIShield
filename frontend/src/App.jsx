import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import OtpVerificationPage from './pages/Auth/OtpVerificationPage'
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage'
import UserDashboard from './pages/Dashboard/UserDashboard'
import SendMoneyPage from './pages/SendMoney/SendMoneyPage'
import FraudResultPage from './pages/FraudResult/FraudResultPage'
import TransactionHistoryPage from './pages/Transactions/TransactionHistoryPage'
import SettingsPage from './pages/Settings/SettingsPage'
import UserProfile from './pages/UserProfile'
import AdminDashboardPage from './pages/Admin/AdminDashboardPage'
import ModelInsightsPage from './pages/Admin/ModelInsights/ModelInsightsPage'
import MerchantDashboard from './pages/MerchantDashboard'
import FraudDetectionPage from './pages/FraudDetection/FraudDetectionPage'
import AnalystPage from './pages/Analyst/AnalystPage'
import AnalyticsPage from './pages/Analytics/AnalyticsPage'
import NotificationsPage from './pages/Notifications/NotificationsPage'

const ScrollToTop = () => {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return null
}

function App() {
  return (
    <AuthProvider>
      <ThemeAwareApp />
    </AuthProvider>
  )
}

const ThemeAwareApp = () => {
  const { user } = useAuth()

  return (
    <ThemeProvider userId={user?.id || user?._id}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<OtpVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/send-money" element={
            <ProtectedRoute>
              <SendMoneyPage />
            </ProtectedRoute>
          } />
          <Route path="/fraud-detection" element={
            <ProtectedRoute>
              <FraudDetectionPage />
            </ProtectedRoute>
          } />
          <Route path="/analyst" element={
            <ProtectedRoute>
              <AnalystPage />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          } />
          <Route path="/fraud-result" element={
            <ProtectedRoute>
              <FraudResultPage />
            </ProtectedRoute>
          } />
          <Route path="/transactions" element={
            <ProtectedRoute>
              <TransactionHistoryPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/model-insights" element={
            <ProtectedRoute>
              <ModelInsightsPage />
            </ProtectedRoute>
          } />
          <Route path="/merchant" element={
            <ProtectedRoute>
              <MerchantDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
