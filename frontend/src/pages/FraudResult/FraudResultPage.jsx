import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import Sidebar from '../../components/Dashboard/Sidebar'
import TopNavbar from '../../components/Dashboard/TopNavbar'
import PredictionGauge from '../../components/PredictionGauge/PredictionGauge'
import RiskExplanationCards from '../../components/RiskCards/RiskExplanationCards'
import TransactionSummary from '../../components/RiskCards/TransactionSummary'
import AIRecommendation from '../../components/Recommendation/AIRecommendation'
import FraudTimeline from '../../components/Timeline/FraudTimeline'
import FeatureImportance from '../../components/FeatureImportance/FeatureImportanceChart'
import SuggestedActions from '../../components/Recommendation/SuggestedActions'
import SimilarTransactions from '../../components/RiskCards/SimilarTransactions'
import transactionService from '../../services/transactionService'
import TransactionTimeline from '../../components/Timeline/TransactionTimeline'
import {
  riskExplanationCards,
  aiRecommendations,
  fraudTimeline,
  featureImportance,
  similarTransactions,
  suggestedActions
} from '../../data/fraudResultData'
import { createTimelineSteps } from '../../data/sendMoneyData'

const FraudResultPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  
  // Use real prediction data from navigation state, fallback to mock data
  const predictionData = location.state || {
    transactionData: null,
    riskLevel: 'LOW',
    fraudProbability: 0,
    riskScore: 0,
    predictionStatus: 'PENDING',
    assessmentStatus: 'PENDING',
    assessmentMessage: '',
    predictionConfidence: 0,
    fraudReasons: []
  }

  const [riskLevel, setRiskLevel] = useState(predictionData.riskLevel)
  const [showPinForm, setShowPinForm] = useState(
    Boolean(predictionData.transactionData?.transactionPayload)
  )
  const [mpin, setMpin] = useState('')
  const [confirmMpin, setConfirmMpin] = useState('')
  const [pinError, setPinError] = useState('')
  const [mpinCreatedMessage, setMpinCreatedMessage] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentFailed, setPaymentFailed] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [paymentResult, setPaymentResult] = useState(null)
  const [authorizing, setAuthorizing] = useState(false)
  const [timelineEvents, setTimelineEvents] = useState(predictionData.timelineEvents || {})
  const needsMpinCreation = predictionData.transactionData?.hasMPIN === false

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const handleProceed = () => {
    setPinError('')
    setMpin('')
    setConfirmMpin('')
    setMpinCreatedMessage('')
    setShowPinForm(true)
  }

  const handleVerifyMpin = () => {
    setPinError('')
    setMpin('')
    setConfirmMpin('')
    setMpinCreatedMessage('')
    setPaymentFailed(false)
    setPaymentError('')
    setTimelineEvents((current) => {
      const { paymentFailedAt, ...activeEvents } = current
      return activeEvents
    })
    setShowPinForm(true)
  }

  const handleConfirmPayment = async (e) => {
    e.preventDefault()

    if (!mpin) {
      setPinError('Please enter your 6-digit MPIN')
      return
    }

    if (!/^\d{6}$/.test(mpin)) {
      setPinError('MPIN must be 6 digits')
      return
    }

    if (needsMpinCreation) {
      if (!confirmMpin) {
        setPinError('Please confirm your 6-digit MPIN')
        return
      }

      if (!/^\d{6}$/.test(confirmMpin)) {
        setPinError('MPIN must be 6 digits')
        return
      }

      if (mpin !== confirmMpin) {
        setPinError('MPINs do not match')
        return
      }
    }

    setAuthorizing(true)
    setPinError('')
    let authorizationToken
    try {
      if (needsMpinCreation) {
        await transactionService.createMpin(mpin)
        setMpinCreatedMessage('MPIN created successfully')
      }

      const authorizationResponse = await transactionService.verifyMpin(mpin)
      authorizationToken = (authorizationResponse.data || authorizationResponse).authorizationToken
      const mpinVerifiedAt = new Date().toISOString()
      setTimelineEvents((current) => ({ ...current, mpinVerifiedAt }))
    } catch (err) {
      setPinError(err.response?.data?.message || 'Incorrect MPIN')
      setAuthorizing(false)
      return
    }

    try {
      const response = await transactionService.sendMoney({
        ...predictionData.transactionData.transactionPayload,
        mpinAuthorization: authorizationToken
      })
      setPaymentResult(response.data || response)
      setTimelineEvents((current) => ({ ...current, paymentCompletedAt: new Date().toISOString() }))
      setShowPinForm(false)
      setPaymentSuccess(true)
      setPaymentFailed(false)
    } catch (err) {
      setPaymentError(err.response?.data?.message || 'Payment failed. Please try again.')
      setTimelineEvents((current) => ({ ...current, paymentFailedAt: new Date().toISOString() }))
      setPaymentFailed(true)
      setShowPinForm(false)
    } finally {
      setAuthorizing(false)
    }
  }

  const paymentAttempted = paymentSuccess || paymentFailed
  const resultTransaction = paymentResult?.transaction || predictionData.transactionData || {}

  const handleCancel = () => {
    setShowPinForm(false)
    navigate('/send-money')
  }

  const handleReport = () => {
    console.log('Reporting suspicious transaction')
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-0' : 'lg:ml-72'}`}>
        <TopNavbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <Link to="/send-money" className="text-gray-400 hover:text-white text-sm mb-2 inline-block">
                  ← Back to Send Money
                </Link>
                <h1 className="text-2xl lg:text-3xl font-bold gradient-text">
                  {paymentAttempted ? 'Payment Result' : 'Payment Authorization'}
                </h1>
              </div>
              {paymentAttempted && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Model Version:</span>
                  <span className="text-sm text-primary-400 font-medium">HistGradientBoosting v1.0</span>
                </div>
              )}
            </div>

            <div className="mt-6">
              <TransactionTimeline steps={createTimelineSteps(timelineEvents)} />
            </div>

            {predictionData.assessmentStatus === 'INSUFFICIENT_TRANSACTION_HISTORY' && (
              <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-200">
                <p className="font-semibold">Behavioural assessment unavailable</p>
                <p className="text-sm mt-1">
                  {predictionData.assessmentMessage || 'New Account – No Previous Transaction History. Behavioural Risk Assessment Not Available.'}
                </p>
              </div>
            )}

            {/* Top Section - Prediction Gauge & AI Recommendation */}
            {paymentAttempted && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <PredictionGauge
                fraudProbability={predictionData.fraudProbability}
                riskLevel={predictionData.riskLevel}
                confidence={predictionData.predictionConfidence}
                prediction={predictionData.predictionStatus === 'FRAUD' ? 'FRAUD' : 'SAFE'}
              />
              <AIRecommendation
                riskLevel={predictionData.riskLevel}
                recommendation={aiRecommendations[predictionData.riskLevel]}
              />
            </div>
            )}

            {/* Main Content Grid */}
            {paymentAttempted && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Left Column - Risk Analysis */}
              <div className="lg:col-span-2 space-y-6">
                <RiskExplanationCards cards={riskExplanationCards} />
                <FeatureImportance features={featureImportance} />
              </div>

              {/* Right Column - Transaction Summary */}
              <div className="space-y-6">
                <TransactionSummary summary={resultTransaction} />
                <FraudTimeline steps={fraudTimeline} />
              </div>
            </div>
            )}

            {/* Bottom Section - Actions & Similar Transactions */}
            {paymentAttempted && !paymentSuccess && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Left Column - Suggested Actions */}
              <div className="lg:col-span-1">
                <SuggestedActions
                  riskLevel={predictionData.riskLevel}
                  actions={suggestedActions}
                  onProceed={handleProceed}
                  onVerifyMpin={handleVerifyMpin}
                  onCancel={handleCancel}
                  onReport={handleReport}
                />
              </div>

              {/* Right Column - Similar Transactions */}
              <div className="lg:col-span-2">
                <SimilarTransactions transactions={similarTransactions} />
              </div>
            </div>
            )}

            {!paymentAttempted && showPinForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-6 bg-dark-800 border border-white/10 rounded-2xl"
              >
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-1">Security Step</p>
                  <h3 className="text-2xl font-bold text-white">
                    {needsMpinCreation ? 'Create your 6-digit MPIN' : 'Enter your 6-digit MPIN'}
                  </h3>
                </div>

                <form onSubmit={handleConfirmPayment} className="space-y-4">
                  <p className="text-sm text-gray-300">
                    {needsMpinCreation
                      ? 'Set a 6-digit security PIN to authorize future payments.'
                      : 'Enter your 6-digit security PIN to authorize this payment.'}
                  </p>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="current-password"
                    value={mpin}
                    onChange={(e) => setMpin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    placeholder="******"
                    aria-label="6-digit MPIN"
                  />

                  {needsMpinCreation && (
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={6}
                      autoComplete="new-password"
                      value={confirmMpin}
                      onChange={(e) => setConfirmMpin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                      placeholder="Confirm your 6-digit MPIN"
                      aria-label="Confirm your 6-digit MPIN"
                    />
                  )}

                  {mpinCreatedMessage && (
                    <p className="text-green-400 text-sm">{mpinCreatedMessage}</p>
                  )}

                  {pinError && (
                    <p className="text-red-400 text-sm">{pinError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-primary text-white font-medium py-3 rounded-xl disabled:opacity-60"
                    disabled={authorizing}
                  >
                    {authorizing ? 'Authorizing...' : needsMpinCreation ? 'Create MPIN' : 'Verify & Pay'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={authorizing}
                    className="w-full bg-dark-700 text-gray-200 font-medium py-3 rounded-xl border border-white/10 hover:bg-dark-600 disabled:opacity-60"
                  >
                    Cancel Payment
                  </button>
                </form>
              </motion.div>
            )}

            {paymentSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-6 bg-green-500/10 border border-green-500/30 rounded-2xl"
              >
                <h3 className="text-2xl font-bold text-green-400 mb-2">Payment Successful</h3>
                <p className="text-gray-300">Your MPIN was accepted. The payment has been completed successfully.</p>
              </motion.div>
            )}

            {paymentFailed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-6 bg-red-500/10 border border-red-500/30 rounded-2xl"
              >
                <h3 className="text-2xl font-bold text-red-400 mb-2">Payment Failed</h3>
                <p className="text-gray-300">{paymentError}</p>
              </motion.div>
            )}

            {/* Analysis Info Footer */}
            {paymentAttempted && (
            <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-500/20 rounded-lg">
                    <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">AI-Powered Fraud Detection</p>
                    <p className="text-gray-400 text-sm">
                      Real-time HistGradientBoosting ML model analysis powered by FastAPI
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Prediction Time</p>
                  <p className="text-white text-sm">
                    {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default FraudResultPage
