import { motion } from 'framer-motion'
import { Lock, Key, Shield, Fingerprint, User, LogOut, Eye, EyeOff } from 'lucide-react'
import Card from '../Card'
import { securityData, autoLogoutOptions } from '../../data/settingsMockData'
import { useState } from 'react'

const SecuritySection = ({ securityData: data, onUpdateSecurity }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleToggle = (key, value) => {
    onUpdateSecurity({ ...data, [key]: value })
  }

  const handleBiometricToggle = (key) => {
    onUpdateSecurity({
      ...data,
      biometricLogin: {
        ...data.biometricLogin,
        [key]: !data.biometricLogin[key]
      }
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card>
        <h2 className="text-xl font-bold text-white mb-6">Security Settings</h2>

        {/* Change Password */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-white mb-4">Change Password</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="Enter current password"
                  className="w-full bg-dark-700/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500"
                />
                <button
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-2 block">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  className="w-full bg-dark-700/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500"
                />
                <button
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  className="w-full bg-dark-700/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500"
                />
                <button
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button className="px-6 py-2 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity">
              Update Password
            </button>
          </div>
        </div>

        {/* Two Factor Authentication */}
        <div className="mb-6 p-4 bg-white/5 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <p className="text-white font-medium">Two-Factor Authentication</p>
                <p className="text-xs text-gray-400">Add an extra layer of security</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('twoFactorEnabled', !data.twoFactorEnabled)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                data.twoFactorEnabled ? 'bg-primary-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  data.twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Transaction PIN */}
        <div className="mb-6 p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-accent-500/20 rounded-lg">
              <Key className="w-5 h-5 text-accent-400" />
            </div>
            <div>
              <p className="text-white font-medium">Transaction PIN</p>
              <p className="text-xs text-gray-400">Set a 4-digit PIN for transactions</p>
            </div>
          </div>
          <input
            type="password"
            placeholder="••••"
            maxLength={4}
            className="w-full bg-dark-700/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 text-center tracking-widest"
          />
        </div>

        {/* Biometric Login */}
        <div className="mb-6 p-4 bg-white/5 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Fingerprint className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white font-medium">Biometric Login</p>
                <p className="text-xs text-gray-400">Use fingerprint or face for quick login</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('biometricLogin', { ...data.biometricLogin, enabled: !data.biometricLogin.enabled })}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                data.biometricLogin.enabled ? 'bg-primary-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  data.biometricLogin.enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {data.biometricLogin.enabled && (
            <div className="space-y-3 ml-11">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Face ID</span>
                </div>
                <button
                  onClick={() => handleBiometricToggle('faceId')}
                  className={`w-10 h-5 rounded-full p-1 transition-colors ${
                    data.biometricLogin.faceId ? 'bg-primary-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-white transition-transform ${
                      data.biometricLogin.faceId ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Fingerprint</span>
                </div>
                <button
                  onClick={() => handleBiometricToggle('fingerprint')}
                  className={`w-10 h-5 rounded-full p-1 transition-colors ${
                    data.biometricLogin.fingerprint ? 'bg-primary-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-white transition-transform ${
                      data.biometricLogin.fingerprint ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Auto Logout */}
        <div className="p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <LogOut className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-white font-medium">Auto Logout Time</p>
              <p className="text-xs text-gray-400">Automatically logout after inactivity</p>
            </div>
          </div>
          <select
            value={data.autoLogoutTime}
            onChange={(e) => handleToggle('autoLogoutTime', e.target.value)}
            className="w-full bg-dark-700/50 border border-white/10 rounded-lg px-4 py-3 text-white cursor-pointer"
          >
            {autoLogoutOptions.map(option => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </select>
        </div>
      </Card>
    </motion.div>
  )
}

export default SecuritySection
