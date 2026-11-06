import { motion } from 'framer-motion'
import { Lock, Download, Trash2, AlertTriangle, Share2, BarChart3, MapPin, Sparkles } from 'lucide-react'
import Card from '../Card'
import { privacySettings } from '../../data/settingsMockData'

const PrivacySection = ({ settings = privacySettings, onUpdateSettings, onDownloadData, onDeleteAccount }) => {
  const handleToggle = (key) => {
    onUpdateSettings({ ...settings, [key]: !settings[key] })
  }

  const ToggleSwitch = ({ enabled, onToggle }) => (
    <button
      onClick={onToggle}
      className={`w-12 h-6 rounded-full p-1 transition-colors ${
        enabled ? 'bg-primary-500' : 'bg-gray-600'
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-bold text-white">Privacy Settings</h2>
        </div>

        <div className="space-y-6">
          {/* Data Sharing */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Share2 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">Data Sharing</p>
                <p className="text-xs text-gray-400">Share data with trusted partners</p>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.dataSharing}
              onToggle={() => handleToggle('dataSharing')}
            />
          </div>

          {/* Analytics Collection */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-medium">Analytics Collection</p>
                <p className="text-xs text-gray-400">Help improve our services</p>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.analyticsCollection}
              onToggle={() => handleToggle('analyticsCollection')}
            />
          </div>

          {/* Location Permission */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <MapPin className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white font-medium">Location Permission</p>
                <p className="text-xs text-gray-400">Allow location access for security</p>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.locationPermission}
              onToggle={() => handleToggle('locationPermission')}
            />
          </div>

          {/* Personalized Recommendations */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-white font-medium">Personalized Recommendations</p>
                <p className="text-xs text-gray-400">Get personalized suggestions</p>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.personalizedRecommendations}
              onToggle={() => handleToggle('personalizedRecommendations')}
            />
          </div>

          {/* Download Personal Data */}
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Download className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-white font-medium">Download Personal Data</p>
                <p className="text-xs text-gray-400">Get a copy of all your data</p>
              </div>
            </div>
            <button
              onClick={onDownloadData}
              className="ml-11 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              Request Data Export
            </button>
          </div>

          {/* Delete Account */}
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-white font-medium">Delete Account</p>
                <p className="text-xs text-gray-400">Permanently delete your account</p>
              </div>
            </div>
            <button
              onClick={onDeleteAccount}
              className="ml-11 flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white text-sm transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-400 mb-1">Privacy Policy</p>
              <p className="text-xs text-gray-400">
                We respect your privacy and are committed to protecting your personal data. 
                Review our privacy policy to understand how we handle your information.
              </p>
            </div>
          </div>
        </div>

        {/* Warning Notice */}
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-400 mb-1">Account Deletion Warning</p>
              <p className="text-xs text-gray-400">
                Deleting your account is permanent and cannot be undone. All your data, 
                transaction history, and linked accounts will be permanently removed.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default PrivacySection
