import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Button from '../../components/Button'
import Card from '../../components/Card'
import { authService } from '../../services/authService'

const RegisterPage = () => {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    upiId: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [verificationMethod, setVerificationMethod] = useState('email')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Please enter your full name')
      return false
    }
    if (formData.fullName.length < 2) {
      setError('Name must be at least 2 characters')
      return false
    }
    
    if (!formData.email.trim()) {
      setError('Please enter your email address')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }
    
    if (!formData.phone.trim()) {
      setError('Please enter your mobile number')
      return false
    }
    const phoneRegex = /^[+]?[0-9]{10,15}$/
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      setError('Please enter a valid mobile number')
      return false
    }
    
    if (!formData.upiId.trim()) {
      setError('Please enter your UPI ID')
      return false
    }
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/
    if (!upiRegex.test(formData.upiId)) {
      setError('Please enter a valid UPI ID (e.g., john@upi)')
      return false
    }
    
    if (!formData.password) {
      setError('Please enter a password')
      return false
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return false
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, and one number')
      return false
    }
    
    if (!formData.confirmPassword) {
      setError('Please confirm your password')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    
    if (!agreeTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
      const response = await authService.register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      })
      
      if (response.data?.success) {
        setSuccess(true)
        setRegisteredEmail(formData.email)
        setVerificationMethod(response.data.data?.verificationMethod || 'email')
      } else {
        setError(response.data?.message || 'Registration failed. Please try again.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleContinueToOtp = () => {
    navigate('/verify-otp', { state: { email: registeredEmail, verificationMethod } })
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4">
        <Navbar type="landing" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md pt-20"
        >
          <Card className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="flex justify-center mb-6"
            >
              <div className="p-4 bg-green-500/20 rounded-full">
                <svg className="w-16 h-16 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </motion.div>
            
            <h2 className="text-3xl font-bold gradient-text mb-2">Registration Successful!</h2>
            <p className="text-gray-400 mb-8">
              We've sent a verification OTP to your {verificationMethod === 'sms' ? 'registered mobile number' : 'email address'}. Please verify to continue.
            </p>
            
            <Button onClick={handleContinueToOtp} className="w-full">
              Continue to OTP Verification <ArrowRight className="inline ml-2 w-5 h-5" />
            </Button>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4 py-20">
      <Navbar type="landing" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
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
            <h2 className="text-3xl font-bold gradient-text mb-2">Create Account</h2>
            <p className="text-gray-400">Start protecting your UPI transactions</p>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 bg-dark-600/50 border border-white/10 rounded-xl 
                           focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 
                           transition-all duration-300 placeholder-gray-500 text-white"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-dark-600/50 border border-white/10 rounded-xl 
                           focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 
                           transition-all duration-300 placeholder-gray-500 text-white"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-3 bg-dark-600/50 border border-white/10 rounded-xl 
                           focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 
                           transition-all duration-300 placeholder-gray-500 text-white"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                UPI ID
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <input
                  type="text"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                  placeholder="john@upi"
                  className="w-full pl-10 pr-4 py-3 bg-dark-600/50 border border-white/10 rounded-xl 
                           focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 
                           transition-all duration-300 placeholder-gray-500 text-white"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
            
            <label className="flex items-start space-x-2 text-sm text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="rounded mt-1 bg-dark-600 border-white/10 text-primary-500 focus:ring-primary-500"
              />
              <span>
                I agree to the{' '}
                <a href="#" className="text-primary-400 hover:text-primary-300">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-400 hover:text-primary-300">
                  Privacy Policy
                </a>
              </span>
            </label>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="analyze-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Create Account <ArrowRight className="ml-2 w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default RegisterPage
