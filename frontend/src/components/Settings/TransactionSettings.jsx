import { motion } from 'framer-motion'
import { CreditCard, Wallet, Shield, Building2, Smartphone, UserPlus } from 'lucide-react'
import Card from '../Card'
import { transactionSettings } from '../../data/settingsMockData'

const TransactionSettings = ({ settings = transactionSettings, onUpdateSettings }) => {
  const handleChange = (key, value) => {
    onUpdateSettings({ ...settings, [key]: value })
  }

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
          <CreditCard className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-bold text-white">Transaction Preferences</h2>
        </div>

        <div className="space-y-6">
          {/* Daily Limit */}
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Wallet className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white font-medium">Daily Transaction Limit</p>
                <p className="text-xs text-gray-400">Maximum amount per day</p>
              </div>
            </div>
            <div className="ml-11">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                <input
                  type="number"
                  value={settings.dailyLimit}
                  onChange={(e) => handleChange('dailyLimit', Number(e.target.value))}
                  className="w-full bg-dark-700/50 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-white"
                />
              </div>
            </div>
          </div>

          {/* Monthly Limit */}
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <CreditCard className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">Monthly Transaction Limit</p>
                <p className="text-xs text-gray-400">Maximum amount per month</p>
              </div>
            </div>
            <div className="ml-11">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                <input
                  type="number"
                  value={settings.monthlyLimit}
                  onChange={(e) => handleChange('monthlyLimit', Number(e.target.value))}
                  className="w-full bg-dark-700/50 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-white"
                />
              </div>
            </div>
          </div>

          {/* UPI Limit */}
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Wallet className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-medium">UPI Transaction Limit</p>
                <p className="text-xs text-gray-400">Per transaction UPI limit</p>
              </div>
            </div>
            <div className="ml-11">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                <input
                  type="number"
                  value={settings.upiLimit}
                  onChange={(e) => handleChange('upiLimit', Number(e.target.value))}
                  className="w-full bg-dark-700/50 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-white"
                />
              </div>
            </div>
          </div>

          {/* Require OTP Above */}
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-white font-medium">Require OTP Above</p>
                <p className="text-xs text-gray-400">OTP required for transactions above this amount</p>
              </div>
            </div>
            <div className="ml-11">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                <input
                  type="number"
                  value={settings.requireOtpAbove}
                  onChange={(e) => handleChange('requireOtpAbove', Number(e.target.value))}
                  className="w-full bg-dark-700/50 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-white"
                />
              </div>
            </div>
          </div>

          {/* Preferred Bank */}
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-pink-500/20 rounded-lg">
                <Building2 className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <p className="text-white font-medium">Preferred Bank</p>
                <p className="text-xs text-gray-400">Default bank for transactions</p>
              </div>
            </div>
            <select
              value={settings.preferredBank}
              onChange={(e) => handleChange('preferredBank', e.target.value)}
              className="w-full ml-11 bg-dark-700/50 border border-white/10 rounded-lg px-4 py-3 text-white cursor-pointer"
            >
              <option value="HDFC Bank">HDFC Bank</option>
              <option value="ICICI Bank">ICICI Bank</option>
              <option value="SBI">State Bank of India</option>
              <option value="Axis Bank">Axis Bank</option>
              <option value="Kotak Bank">Kotak Mahindra Bank</option>
            </select>
          </div>

          {/* Default Payment App */}
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Smartphone className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-white font-medium">Default Payment App</p>
                <p className="text-xs text-gray-400">Preferred payment application</p>
              </div>
            </div>
            <select
              value={settings.defaultPaymentApp}
              onChange={(e) => handleChange('defaultPaymentApp', e.target.value)}
              className="w-full ml-11 bg-dark-700/50 border border-white/10 rounded-lg px-4 py-3 text-white cursor-pointer"
            >
              <option value="UPI">UPI</option>
              <option value="PhonePe">PhonePe</option>
              <option value="Google Pay">Google Pay</option>
              <option value="Paytm">Paytm</option>
              <option value="BHIM">BHIM</option>
            </select>
          </div>

          {/* Auto Save Beneficiary */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <UserPlus className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-white font-medium">Auto Save Beneficiary</p>
                <p className="text-xs text-gray-400">Automatically save new beneficiaries</p>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.autoSaveBeneficiary}
              onToggle={() => handleToggle('autoSaveBeneficiary')}
            />
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-400 mb-1">Transaction Limits</p>
              <p className="text-xs text-gray-400">
                Setting appropriate transaction limits helps protect your account from unauthorized transactions.
                Lower limits provide better security.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default TransactionSettings
