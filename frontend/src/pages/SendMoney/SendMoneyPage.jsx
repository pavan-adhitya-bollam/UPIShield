import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Dashboard/Sidebar'
import TopNavbar from '../../components/Dashboard/TopNavbar'
import PaymentForm from '../../components/Payment/PaymentForm'
import SuspiciousIndicators from '../../components/Risk/SuspiciousIndicators'
import TransactionTimeline from '../../components/Timeline/TransactionTimeline'
import RecentBeneficiaries from '../../components/Beneficiary/RecentBeneficiaries'
import QuickTips from '../../widgets/QuickTips'
import transactionService from '../../services/transactionService'
import {
  recentBeneficiaries,
  suspiciousIndicators,
  quickTips,
  createTimelineSteps
} from '../../data/sendMoneyData'

const SendMoneyPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [transactionData, setTransactionData] = useState(null)
  const [timelineEvents, setTimelineEvents] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const handleVerify = async (data) => {
    setLoading(true)
    setError(null)
    const paymentCreatedAt = new Date().toISOString()
    const fraudCheckStartedAt = new Date().toISOString()
    setTimelineEvents({ paymentCreatedAt, fraudCheckStartedAt })
    try {
      // Map frontend form fields to backend API format
      const transactionPayload = {
        amount: data.amount,
        receiverUpi: data.receiverUpiId, // Map receiverUpiId to receiverUpi
        merchantCategory: data.merchantCategory,
        purpose: data.purpose,
        note: data.paymentNote, // Map paymentNote to note
        transactionType: data.transactionType === 'merchant' ? 'P2M' : 'P2P',
        paymentMethod: data.paymentMethod === 'upi' ? 'UPI' : data.paymentMethod
      }
      
      const response = await transactionService.assessTransaction(transactionPayload)
      const assessment = response.data || response
      const fraudCheckCompletedAt = new Date().toISOString()
      const completedTimelineEvents = {
        paymentCreatedAt,
        fraudCheckStartedAt,
        fraudCheckCompletedAt
      }
      setTimelineEvents(completedTimelineEvents)
      
      const assessedTransaction = {
        ...data,
        transactionPayload,
        fraudProbability: assessment.fraudProbability,
        riskScore: assessment.riskScore,
        riskLevel: assessment.riskLevel,
        assessmentStatus: assessment.assessmentStatus,
        assessmentMessage: assessment.assessmentMessage,
        hasMPIN: assessment.hasMPIN,
        predictionStatus: assessment.predictionStatus,
        predictionConfidence: assessment.predictionConfidence,
        fraudReasons: assessment.fraudReasons,
        provider: assessment.provider,
        modelVersion: assessment.modelVersion,
        mlRiskScore: assessment.mlRiskScore,
        mlFraudProbability: assessment.mlFraudProbability,
        behavioralRiskContribution: assessment.behavioralRiskContribution,
        assessmentStrategy: assessment.assessmentStrategy,
        behavioralFeatures: assessment.behavioralFeatures
      }
      setTransactionData(assessedTransaction)
      navigate('/fraud-result', {
        state: {
          transactionData: assessedTransaction,
          riskLevel: assessment.riskLevel,
          fraudProbability: assessment.fraudProbability,
          riskScore: assessment.riskScore,
          predictionStatus: assessment.predictionStatus,
          assessmentStatus: assessment.assessmentStatus,
          assessmentMessage: assessment.assessmentMessage,
          predictionConfidence: assessment.predictionConfidence,
          fraudReasons: assessment.fraudReasons,
          provider: assessment.provider,
          modelVersion: assessment.modelVersion,
          mlRiskScore: assessment.mlRiskScore,
          mlFraudProbability: assessment.mlFraudProbability,
          behavioralRiskContribution: assessment.behavioralRiskContribution,
          assessmentStrategy: assessment.assessmentStrategy,
          behavioralFeatures: assessment.behavioralFeatures,
          timelineEvents: completedTimelineEvents
        }
      })
    } catch (err) {
      console.error('Transaction verification error:', err)
      setError(err.response?.data?.message || 'Failed to verify transaction. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setTransactionData(null)
    setTimelineEvents({})
  }

  const handleBeneficiarySelect = (beneficiary) => {
    // Auto-fill form with beneficiary data
    setTransactionData({
      receiverUpiId: beneficiary.upiId,
      receiverName: beneficiary.name,
      amount: '',
      purpose: '',
      transactionType: 'person'
    })
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
                <Link to="/dashboard" className="text-gray-400 hover:text-white text-sm mb-2 inline-block">
                  ← Back to Dashboard
                </Link>
                <h1 className="text-2xl lg:text-3xl font-bold gradient-text">
                  Send Money
                </h1>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Payment Form */}
              <div className="lg:col-span-2 space-y-6">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                    {error}
                  </div>
                )}
                <PaymentForm
                  onVerify={handleVerify}
                  onClear={handleClear}
                  onSelectBeneficiary={handleBeneficiarySelect}
                  disabled={loading}
                />

                {/* Transaction Timeline */}
                <TransactionTimeline steps={createTimelineSteps(timelineEvents)} />
              </div>

              {/* Right Column - Widgets */}
              <div className="space-y-6">
                <SuspiciousIndicators indicators={suspiciousIndicators} />
                <RecentBeneficiaries
                  beneficiaries={recentBeneficiaries}
                  onSelect={handleBeneficiarySelect}
                />
                <QuickTips tips={quickTips} />
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default SendMoneyPage
