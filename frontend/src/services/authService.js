import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '')

export const getProfileImageUrl = (profileImage) => {
  if (!profileImage) return ''
  if (profileImage.startsWith('http://') || profileImage.startsWith('https://')) return profileImage
  return `${API_ORIGIN}${profileImage.startsWith('/') ? profileImage : `/${profileImage}`}`
}

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const publicAuthPaths = [
    '/auth/login',
    '/auth/register',
    '/auth/resend-verification-otp',
    '/auth/verify-email',
    '/auth/forgot-password',
    '/auth/verify-reset-otp',
    '/auth/reset-password',
    '/auth/refresh',
  ]
  const isPublicAuthRequest = publicAuthPaths.some((path) => config.url?.endsWith(path))
  const token = localStorage.getItem('token')
  if (token && !isPublicAuthRequest) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth Service
export const authService = {
  // Login
  login: async (email, password) => {
    return await api.post('/auth/login', { email, password })
  },

  // Register
  register: async (userData) => {
    const fullName = (userData?.fullName || '').trim()
    const nameParts = fullName ? fullName.split(/\s+/) : []
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    const payload = {
      firstName,
      lastName,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      profileImage: userData.profileImage || null,
      role: userData.role || 'USER',
    }

    return await api.post('/auth/register', payload)
  },

  // Verify OTP
  verifyOtp: async (email, otp) => {
    return await api.post('/auth/verify-email', { email, otp })
  },

  // Resend OTP
  resendOtp: async (email) => {
    return await api.post('/auth/resend-verification-otp', { email })
  },

  // Forgot Password - Request OTP
  forgotPassword: async (email, deliveryMethod = 'email') => {
    return await api.post('/auth/forgot-password', { email, deliveryMethod })
  },

  verifyResetOtp: async (email, otp) => {
    return await api.post('/auth/verify-reset-otp', { email, otp })
  },

  // Reset Password
  resetPassword: async (resetToken, newPassword) => {
    return await api.post('/auth/reset-password', {
      resetToken,
      password: newPassword,
    })
  },

  // Logout
  logout: async () => {
    return await api.post('/auth/logout')
  },

  // Get current user
  getCurrentUser: async () => {
    return await api.get('/auth/profile')
  },

  getProfile: async () => {
    return await api.get('/auth/profile')
  },

  updateProfile: async (profileData) => {
    return await api.put('/auth/profile', profileData)
  },

  updateProfilePicture: async (file) => {
    const formData = new FormData()
    formData.append('profileImage', file)
    return await api.post('/auth/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
}

export default api
