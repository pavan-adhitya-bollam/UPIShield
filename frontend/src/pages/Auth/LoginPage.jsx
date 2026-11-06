import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Card from '../../components/Card'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/authService'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const validateForm = () => {
    if (!formData.email) {
      setError('Please enter your email or mobile number')
      return false
    }
    if (!formData.password) {
      setError('Please enter your password')
      return false
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
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
      const response = await authService.login(formData.email, formData.password)
      
      if (response.data?.success) {
        const token = response.data?.data?.accessToken
        const user = response.data?.data?.user

        if (!token) {
          setError('Login response missing access token.')
          return
        }

        login(user, token)
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
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
            <h2 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h2>
            <p className="text-gray-400">Sign in to your account</p>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email or Mobile Number
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com or +91 98765 43210"
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
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-dark-600 border-white/10 text-primary-500 focus:ring-primary-500"
                />
                <span>Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-primary-400 hover:text-primary-300 transition-colors"
              >
                Forgot password?
              </Link>
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
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Sign In <ArrowRight className="ml-2 w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default LoginPage
