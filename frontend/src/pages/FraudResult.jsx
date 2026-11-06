import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { 
  AlertTriangle, Shield, XCircle, CheckCircle, 
  ArrowLeft, TrendingUp, Info, AlertCircle 
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Card from '../components/Card'

const FraudResult = () => {
  const location = useLocation()
  const fraudData = location.state || {}
  const getRiskColor = (level) => {
    const lowerLevel = String(level || '').toLowerCase()
    switch (lowerLevel) {
      case 'high':
      case 'critical': return 'from-red-500 to-red-600'
      case 'medium': return 'from-yellow-500 to-yellow-600'
      case 'low': return 'from-green-500 to-green-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getRiskBadge = (level) => {
    const lowerLevel = String(level || '').toLowerCase()
    switch (lowerLevel) {
      case 'high':
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-dark pt-20">
      <Navbar type="dashboard" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">Fraud Detection Result</h1>
          <p className="text-gray-400">Transaction ID: {fraudData.transactionId || 'N/A'}</p>
        </motion.div>

        {/* Risk Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className={`bg-gradient-to-br ${getRiskColor(fraudData.riskLevel)} border-0`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium mb-2">Risk Level</p>
                <h2 className="text-4xl font-bold text-white mb-2 capitalize">
                  {fraudData.riskLevel || 'UNKNOWN'} Risk
                </h2>
                <p className="text-white/70">
                  Fraud Probability: {((fraudData.fraudProbability || 0) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-right">
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mb-2">
                  <AlertTriangle className="w-12 h-12 text-white" />
                </div>
                <p className="text-white/80 text-sm">
                  Confidence: {((fraudData.predictionConfidence || 0) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Important Features */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
          {/* Important Features */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary-400" />
                <h3 className="text-xl font-semibold">Risk Indicators</h3>
              </div>
              <div className="space-y-4">
                {fraudData.fraudReasons && fraudData.fraudReasons.length > 0 ? (
                  fraudData.fraudReasons.map((reason, index) => (
                    <div key={index} className="p-4 bg-dark-600/30 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{reason || 'Risk Factor'}</span>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-400">
                          Detected
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-dark-600/30 rounded-xl text-gray-400">
                    <p>No specific risk indicators detected</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
          </motion.div>

          {/* Suggested Action */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className={`border-2 ${(String(fraudData.riskLevel || '').toUpperCase() === 'HIGH' || String(fraudData.riskLevel || '').toUpperCase() === 'CRITICAL') ? 'border-red-500/50' : 'border-yellow-500/50'}`}>
              <div className="flex items-center gap-2 mb-6">
                {(String(fraudData.riskLevel || '').toUpperCase() === 'HIGH' || String(fraudData.riskLevel || '').toUpperCase() === 'CRITICAL') ? (
                  <XCircle className="w-5 h-5 text-red-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                )}
                <h3 className="text-xl font-semibold">Recommendation</h3>
              </div>
              
              <div className={`p-4 border rounded-xl mb-6 ${(String(fraudData.riskLevel || '').toUpperCase() === 'HIGH' || String(fraudData.riskLevel || '').toUpperCase() === 'CRITICAL') ? 'bg-red-500/10 border-red-500/20' : 'bg-yellow-500/10 border-yellow-500/20'}`}>
                <p className={`font-medium ${(String(fraudData.riskLevel || '').toUpperCase() === 'HIGH' || String(fraudData.riskLevel || '').toUpperCase() === 'CRITICAL') ? 'text-red-300' : 'text-yellow-300'}`}>
                  {(String(fraudData.riskLevel || '').toUpperCase() === 'HIGH' || String(fraudData.riskLevel || '').toUpperCase() === 'CRITICAL')
                    ? 'This transaction has been flagged and should be blocked. Multiple risk indicators detected.'
                    : 'This transaction shows some risk indicators. Additional verification may be required.'}
                </p>
              </div>

              <div className="space-y-3">
                <Button variant="danger" className="w-full">
                  Block Transaction
                </Button>
                <Button variant="secondary" className="w-full">
                  Request Additional Verification
                </Button>
                {String(fraudData.riskLevel || '').toUpperCase() !== 'CRITICAL' && (
                  <Button variant="ghost" className="w-full">
                    Allow Transaction
                  </Button>
                )}
              </div>

              <div className="mt-6 p-4 bg-dark-600/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-primary-400 mt-0.5" />
                  <div className="text-sm text-gray-400">
                    <p className="font-medium text-gray-300 mb-1">Prediction Status</p>
                    <p>
                      Model: XGBoost | Status: {fraudData.predictionStatus || 'COMPLETED'} | Risk Score: {((fraudData.riskScore || 0) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Transaction Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <h3 className="text-xl font-semibold mb-4">Transaction Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-dark-600/30 rounded-xl">
                <p className="text-gray-400 text-sm mb-1">Transaction ID</p>
                <p className="font-medium">{fraudData.transactionId || 'N/A'}</p>
              </div>
              <div className="p-4 bg-dark-600/30 rounded-xl">
                <p className="text-gray-400 text-sm mb-1">Amount</p>
                <p className="font-medium">₹{fraudData.amount || 0}</p>
              </div>
              <div className="p-4 bg-dark-600/30 rounded-xl">
                <p className="text-gray-400 text-sm mb-1">Receiver UPI</p>
                <p className="font-medium text-sm">{fraudData.receiverUpiId || 'N/A'}</p>
              </div>
              <div className="p-4 bg-dark-600/30 rounded-xl">
                <p className="text-gray-400 text-sm mb-1">Detection Model</p>
                <p className="font-medium">XGBoost v2.0</p>
              </div>
              <div className="p-4 bg-dark-600/30 rounded-xl">
                <p className="text-gray-400 text-sm mb-1">Prediction Status</p>
                <p className="font-medium">{fraudData.predictionStatus || 'COMPLETED'}</p>
              </div>
              <div className="p-4 bg-dark-600/30 rounded-xl">
                <p className="text-gray-400 text-sm mb-1">Risk Level</p>
                <p className="font-medium capitalize">{fraudData.riskLevel || 'UNKNOWN'}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default FraudResult
