import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Shield, ArrowRight, RefreshCw } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Button from '../../components/Button'
import Card from '../../components/Card'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/authService'

const OtpVerificationPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  
  const email = location.state?.email || ''
  const verificationMethod = location.state?.verificationMethod || 'email'
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!email) {
      navigate('/register')
    }
  }, [email, navigate])

  useEffect(() => {
    let timer
    if (countdown > 0 && !canResend) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    } else if (countdown === 0) {
      setCanResend(true)
    }
    return () => clearInterval(timer)
  }, [countdown, canResend])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
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

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) {
        prevInput.focus()
      }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    const digits = pastedData.split('').filter(char => /^\d$/.test(char))
    
    if (digits.length === 6) {
      setOtp(digits)
      setError('')
    }
  }

  const validateOtp = () => {
    const otpValue = otp.join('')
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits')
      return false
    }
    if (!/^\d{6}$/.test(otpValue)) {
      setError('OTP must contain only numbers')
      return false
    }
    return true
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    
    if (!validateOtp()) return

    setLoading(true)
    setError('')

    try {
      const otpValue = otp.join('')
      const response = await authService.verifyOtp(email, otpValue)
      
      if (response.data?.success) {
        const token = response.data?.data?.accessToken
        const user = response.data?.data?.user

        if (!token) {
          setError('Email verification response missing access token.')
          return
        }

        login(user, token)
        navigate('/dashboard')
      } else {
        setError(response.data?.message || 'Invalid OTP. Please try again.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await authService.resendOtp(email)
      
      if (response.data.success) {
        setCountdown(60)
        setCanResend(false)
        setOtp(['', '', '', '', '', ''])
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.')
    } finally {
      setLoading(false)
    }
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
            <h2 className="text-3xl font-bold gradient-text mb-2">Verify OTP</h2>
            <p className="text-gray-400">
              Enter the 6-digit code sent to{' '}
              <span className="text-primary-400 font-medium">
                {verificationMethod === 'sms' ? 'your registered mobile number' : email}
              </span>
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

          <form onSubmit={handleVerify} className="space-y-6">
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
                    onPaste={handlePaste}
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
                  onClick={handleResend}
                  disabled={loading}
                  className="text-primary-400 hover:text-primary-300 font-medium text-sm transition-colors flex items-center justify-center gap-2 mx-auto"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Resend OTP
                </button>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Verify OTP <ArrowRight className="ml-2 w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Didn't receive the code?{' '}
              <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Change email
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default OtpVerificationPage
