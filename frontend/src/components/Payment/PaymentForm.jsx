import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, IndianRupee, FileText, Building2, CreditCard, Smartphone, Check, X, Search } from 'lucide-react'
import Card from '../Card'
import Button from '../Button'
import { transactionTypes, merchantCategories, paymentMethods } from '../../data/sendMoneyData'

const PaymentForm = ({ onVerify, onClear, onContinue, onSelectBeneficiary }) => {
  const [formData, setFormData] = useState({
    receiverUpiId: '',
    receiverName: '',
    amount: '',
    purpose: '',
    transactionType: 'person',
    merchantCategory: '',
    paymentNote: '',
    paymentMethod: 'upi'
  })
  const [errors, setErrors] = useState({})
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validate UPI ID
    if (!formData.receiverUpiId.trim()) {
      newErrors.receiverUpiId = 'UPI ID is required'
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(formData.receiverUpiId)) {
      newErrors.receiverUpiId = 'Invalid UPI ID format (e.g., john@upi)'
    }

    // Validate Amount
    if (!formData.amount) {
      newErrors.amount = 'Amount is required'
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    } else if (parseFloat(formData.amount) > 100000) {
      newErrors.amount = 'Maximum amount is ₹1,00,000'
    }

    // Validate Merchant Category for merchant payments
    if (formData.transactionType === 'merchant' && !formData.merchantCategory) {
      newErrors.merchantCategory = 'Merchant category is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleVerify = async () => {
    if (!validateForm()) return

    setIsVerifying(true)
    
    // Call the backend API for real UPI verification and fraud check
    if (onVerify) {
      try {
        await onVerify(formData)
        setIsVerified(true)
      } catch (error) {
        // Error handling is done in the parent component
        setIsVerified(false)
      } finally {
        setIsVerifying(false)
      }
    }
  }

  const handleClear = () => {
    setFormData({
      receiverUpiId: '',
      receiverName: '',
      amount: '',
      purpose: '',
      transactionType: 'person',
      merchantCategory: '',
      paymentNote: '',
      paymentMethod: 'upi'
    })
    setErrors({})
    setIsVerified(false)
    if (onClear) onClear()
  }

  const handleContinue = () => {
    if (isVerified && onContinue) {
      onContinue(formData)
    }
  }

  const handleBeneficiarySelect = (beneficiary) => {
    setFormData(prev => ({
      ...prev,
      receiverUpiId: beneficiary.upiId,
      receiverName: beneficiary.name
    }))
    setIsVerified(true)
    if (onSelectBeneficiary) onSelectBeneficiary(beneficiary)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Payment Details</h2>
          <p className="text-gray-400 text-sm">Fill in the payment information below</p>
        </div>

        <div className="space-y-4">
          {/* Receiver UPI ID */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Receiver UPI ID *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                name="receiverUpiId"
                value={formData.receiverUpiId}
                onChange={handleChange}
                placeholder="e.g., john@upi"
                className={`w-full pl-10 pr-4 py-3 bg-dark-600/50 border rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-primary-500/20 
                         transition-all duration-300 placeholder-gray-500 text-white
                         ${errors.receiverUpiId ? 'border-red-500/50' : 'border-white/10 focus:border-primary-500/50'}`}
              />
              {isVerified && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Check className="w-5 h-5 text-green-400" />
                </div>
              )}
            </div>
            {errors.receiverUpiId && (
              <p className="text-red-400 text-xs mt-1">{errors.receiverUpiId}</p>
            )}
          </div>

          {/* Receiver Name (Auto-filled) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Receiver Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                name="receiverName"
                value={formData.receiverName}
                onChange={handleChange}
                placeholder="Auto-filled after verification"
                disabled
                className="w-full pl-10 pr-4 py-3 bg-dark-600/30 border border-white/10 rounded-xl 
                         text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount (₹) *
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                className={`w-full pl-10 pr-4 py-3 bg-dark-600/50 border rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-primary-500/20 
                         transition-all duration-300 placeholder-gray-500 text-white
                         ${errors.amount ? 'border-red-500/50' : 'border-white/10 focus:border-primary-500/50'}`}
              />
            </div>
            {errors.amount && (
              <p className="text-red-400 text-xs mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Purpose (Optional)
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="e.g., Rent payment, Gift"
                className={`w-full pl-10 pr-4 py-3 bg-dark-600/50 border rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-primary-500/20 
                         transition-all duration-300 placeholder-gray-500 text-white
                         ${errors.purpose ? 'border-red-500/50' : 'border-white/10 focus:border-primary-500/50'}`}
              />
            </div>
            {errors.purpose && (
              <p className="text-red-400 text-xs mt-1">{errors.purpose}</p>
            )}
          </div>

          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Transaction Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {transactionTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleChange({ target: { name: 'transactionType', value: type.value } })}
                  className={`px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium
                    ${formData.transactionType === type.value
                      ? 'bg-gradient-primary text-white border-primary-500/50'
                      : 'bg-dark-600/50 text-gray-400 border-white/10 hover:border-white/20'
                    }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Merchant Category (Conditional) */}
          {formData.transactionType === 'merchant' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Merchant Category *
              </label>
              <select
                name="merchantCategory"
                value={formData.merchantCategory}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-dark-600/50 border rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-primary-500/20 
                         transition-all duration-300 text-white appearance-none cursor-pointer
                         ${errors.merchantCategory ? 'border-red-500/50' : 'border-white/10 focus:border-primary-500/50'}`}
              >
                <option value="">Select category</option>
                {merchantCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              {errors.merchantCategory && (
                <p className="text-red-400 text-xs mt-1">{errors.merchantCategory}</p>
              )}
            </div>
          )}

          {/* Payment Note */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Payment Note (Optional)
            </label>
            <textarea
              name="paymentNote"
              value={formData.paymentNote}
              onChange={handleChange}
              placeholder="Add a note for this transaction"
              rows={2}
              className="w-full px-4 py-3 bg-dark-600/50 border border-white/10 rounded-xl 
                       focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 
                       transition-all duration-300 placeholder-gray-500 text-white resize-none"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon
                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => handleChange({ target: { name: 'paymentMethod', value: method.value } })}
                    className={`flex flex-col items-center gap-1 px-3 py-3 rounded-lg border transition-all duration-200
                      ${formData.paymentMethod === method.value
                        ? 'bg-gradient-primary text-white border-primary-500/50'
                        : 'bg-dark-600/50 text-gray-400 border-white/10 hover:border-white/20'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{method.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={handleClear}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button
              onClick={handleVerify}
              disabled={isVerifying}
              className="flex-1"
            >
              {isVerifying ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center">
                  <Search className="w-4 h-4 mr-2" />
                  Proceed to Payment
                </span>
              )}
            </Button>
          </div>

          {isVerified && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-4"
            >
              <Button
                onClick={handleContinue}
                className="w-full"
              >
                Continue to Review
              </Button>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

export default PaymentForm
