import { motion } from 'framer-motion'
import { User, Mail, Phone, CreditCard, Building2, Calendar, ShieldCheck, Edit2, Camera } from 'lucide-react'
import Card from '../Card'
import { useAuth } from '../../context/AuthContext'
import { getProfileImageUrl } from '../../services/authService'
import { Link } from 'react-router-dom'

const ProfileSection = ({ onEditProfile }) => {
  const { user } = useAuth()

  const getKycStatusColor = (status) => {
    return status === 'Verified'
      ? 'text-green-400 bg-green-500/20'
      : 'text-yellow-400 bg-yellow-500/20'
  }

  const fullName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'
  const profilePicture = user?.profileImage ? getProfileImageUrl(user.profileImage) : 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user?.email || 'user')
  const phoneNumber = user?.phone || 'Not set'
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not available'
  const kycStatus = user?.isVerified ? 'Verified' : 'Not Verified'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Profile</h2>
          <Link
            to="/profile"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </Link>
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-primary p-1">
              <img
                src={profilePicture}
                alt="Profile"
                className="w-full h-full rounded-full bg-dark-800 object-cover"
                onError={(e) => {
                  e.target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user?.email || 'user')
                }}
              />
            </div>
          </div>
          <p className="text-white font-semibold mt-4">{fullName}</p>
          <p className="text-gray-400 text-sm">{user?.email || 'Not set'}</p>
        </div>

        {/* Profile Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
            <div className="p-3 bg-primary-500/20 rounded-lg">
              <User className="w-5 h-5 text-primary-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">Full Name</p>
              <p className="text-white font-medium">{fullName}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
            <div className="p-3 bg-accent-500/20 rounded-lg">
              <Mail className="w-5 h-5 text-accent-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">Email</p>
              <p className="text-white font-medium">{user?.email || 'Not set'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Phone className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">Phone Number</p>
              <p className="text-white font-medium">{phoneNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
            <div className="p-3 bg-pink-500/20 rounded-lg">
              <Calendar className="w-5 h-5 text-pink-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">Member Since</p>
              <p className="text-white font-medium">{memberSince}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">Account Status</p>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getKycStatusColor(kycStatus)}`}>
                {user?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default ProfileSection
