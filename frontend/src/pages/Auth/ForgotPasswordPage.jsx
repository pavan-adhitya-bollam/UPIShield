import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Mail, Smartphone, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Button from '../../components/Button'
import Card from '../../components/Card'
import { authService } from '../../services/authService'

const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  
  // Step 1: Enter email
  // Step 2: Verify OTP
  // Step 3: Reset password
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState('email')
  const [maskedPhone, setMaskedPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (step !== 2 || countdown <= 0) {
      if (step === 2 && countdown <= 0) setCanResend(true)
      return undefined
    }

    const timer = window.setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          setCanResend(true)
          return 0
        }
        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [step, countdown])

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await authService.forgotPassword(email, deliveryMethod)
      
      if (response.data.success) {
        setStep(2)
        setMaskedPhone(response.data.data?.maskedPhone || '')
        setCountdown(60)
        setCanResend(false)
        setSuccess(deliveryMethod === 'sms'
          ? `OTP accepted for delivery to ${response.data.data?.maskedPhone || 'your registered mobile number'}.`
          : 'If an account exists for that email, a password reset OTP has been sent.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(0, 1)
    }

    if (!/^\d*$/.test(value)) {
      return
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) {
        prevInput.focus()
      }
    }
  }

  const handleOtpVerify = async (e) => {
    e.preventDefault()
    
    const otpValue = otp.join('')
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await authService.verifyResetOtp(email, otpValue)

      if (response.data.success) {
        setResetToken(response.data.data.resetToken)
        setStep(3)
        setSuccess('OTP verified. Create your new password.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await authService.forgotPassword(email, deliveryMethod)
      
      if (response.data.success) {
        setCountdown(60)
        setCanResend(false)
        setOtp(['', '', '', '', '', ''])
        setSuccess(deliveryMethod === 'sms'
          ? 'A new OTP was accepted for delivery by the SMS provider.'
          : 'A new password reset OTP has been sent.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    
    if (!newPassword) {
      setError('Please enter a new password')
      return
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, and one number')
      return
    }
    if (!confirmPassword) {
      setError('Please confirm your new password')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await authService.resetPassword(resetToken, newPassword)
      
      if (response.data.success) {
        navigate('/login', { state: { message: 'Password reset successful. Please login with your new password.' } })
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4">
      <Navbar type="landing" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md pt-20"
      >
        <Card>
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="flex justify-center mb-4"
            >
              <div className="p-3 bg-gradient-primary rounded-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h2 className="text-3xl font-bold gradient-text mb-2">
              {step === 1 ? 'Forgot Password' : step === 2 ? 'Verify OTP' : 'Reset Password'}
            </h2>
            <p className="text-gray-400">
              {step === 1 
                ? 'Choose where to receive your verification code'
                : step === 2
                ? `Enter the 6-digit code sent to ${deliveryMethod === 'sms' ? maskedPhone : 'your email'}`
                : 'Create a new secure password'
              }
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
            >
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl"
            >
              <p className="text-green-400 text-sm">{success}</p>
            </motion.div>
          )}

          {/* Step 1: Choose delivery and enter email */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError('')
                    }}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-dark-600/50 border border-white/10 rounded-xl 
                             focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 
                             transition-all duration-300 placeholder-gray-500 text-white"
                  />
                </div>
              </div>

              <div>
                <p className="block text-sm font-medium text-gray-300 mb-2">Receive OTP by</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'email', label: 'Email OTP', icon: Mail },
                    { value: 'sms', label: 'SMS OTP', icon: Smartphone },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setDeliveryMethod(value)
                        setError('')
                      }}
                      className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm transition-all ${
                        deliveryMethod === value
                          ? 'border-primary-500 bg-primary-500/10 text-primary-300'
                          : 'border-white/10 text-gray-400 hover:border-white/30'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
                {deliveryMethod === 'sms' && (
                  <p className="mt-2 text-xs text-gray-500">
                    The OTP will be sent only to the mobile number registered with this account.
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Send OTP <ArrowRight className="ml-2 w-5 h-5" />
                  </span>
                )}
              </Button>
            </form>
          )}

          {/* Step 2: Verify OTP */}
          {step === 2 && (
            <form onSubmit={handleOtpVerify} className="space-y-6">
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <input
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      maxLength={1}
                      className="w-12 h-14 text-center text-2xl font-bold bg-dark-600/50 border border-white/10 rounded-xl 
                               focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 
                               transition-all duration-300 text-white"
                    />
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                {!canResend ? (
                  <p className="text-gray-400 text-sm">
                    Resend OTP in{' '}
                    <span className="text-primary-400 font-mono font-medium">
                      {formatTime(countdown)}
                    </span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-primary-400 hover:text-primary-300 font-medium text-sm transition-colors flex items-center justify-center gap-2 mx-auto"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Resend OTP
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify'}
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value)
                      setError('')
                    }}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 bg-dark-600/50 border border-white/10 rounded-xl 
                             focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 
                             transition-all duration-300 placeholder-gray-500 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      setError('')
                    }}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 bg-dark-600/50 border border-white/10 rounded-xl 
                             focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 
                             transition-all duration-300 placeholder-gray-500 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Resetting...
                    </span>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium text-sm transition-colors">
              Back to Login
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default ForgotPasswordPage
