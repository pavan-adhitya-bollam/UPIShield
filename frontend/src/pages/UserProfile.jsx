import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../components/Dashboard/Sidebar'
import TopNavbar from '../components/Dashboard/TopNavbar'
import { authService, getProfileImageUrl } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Phone, Camera, Save, X } from 'lucide-react'

const UserProfile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profileImage: ''
  })
  const [previewImage, setPreviewImage] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const { user, updateUser } = useAuth()

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const resetProfileForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      profileImage: ''
    })
    setPreviewImage(null)
    setSelectedImage(null)
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await authService.getProfile()
      const userData = response.data?.data
      
      if (!userData) {
        throw new Error('No user data in response')
      }
      
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        profileImage: userData.profileImage || ''
      })
      setPreviewImage(userData.profileImage || null)
    } catch (err) {
      resetProfileForm()
      setError(err.response?.data?.message || 'Failed to load your profile.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
        setSelectedImage(file)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setPreviewImage(null)
    setSelectedImage(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const firstName = formData.firstName.trim()
    const lastName = formData.lastName.trim()
    const phone = formData.phone.trim()

    if (!firstName || firstName.length > 50) {
      setError('First name must be between 1 and 50 characters.')
      return
    }
    if (lastName.length > 50) {
      setError('Last name cannot exceed 50 characters.')
      return
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      setError('Please provide a valid 10-digit mobile number.')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // Update profile fields
      const profileData = {
        firstName,
        lastName,
        phone
      }

      const response = await authService.updateProfile(profileData)
      const updatedProfile = response.data?.data?.user

      let finalProfile = updatedProfile
      if (selectedImage) {
        const pictureResponse = await authService.updateProfilePicture(selectedImage)
        finalProfile = pictureResponse.data?.data?.user || finalProfile
      }

      if (!finalProfile) {
        throw new Error('The server did not return the updated profile.')
      }

      updateUser(finalProfile)
      setSelectedImage(null)

      await loadProfile()
      setSuccess('Profile updated successfully')
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err.response?.data?.message || err.message || 'Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-0' : 'lg:ml-72'}`}>
          <TopNavbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <main className="p-4 lg:p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-400">Loading profile...</div>
            </div>
          </main>
        </div>
      </div>
    )
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
            <h1 className="text-2xl lg:text-3xl font-bold gradient-text mb-6">
              User Profile
            </h1>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400">
                {success}
              </div>
            )}

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center overflow-hidden border-2 border-white/20">
                      {previewImage ? (
                        <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white text-2xl font-medium">
                          {(formData.firstName || formData.email || 'U').charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Profile Picture</h3>
                    <p className="text-gray-400 text-sm mb-2">JPG, PNG or GIF. Max 5MB</p>
                    {previewImage && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="text-red-400 text-sm hover:text-red-3 00 flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 cursor-not-allowed focus:outline-none"
                      />
                    </div>
                    <p className="text-gray-500 text-xs mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        pattern="[0-9]{10}"
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={loadProfile}
                    disabled={saving}
                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-gradient-primary rounded-xl text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default UserProfile
