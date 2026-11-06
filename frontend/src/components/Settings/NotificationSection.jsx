import { motion } from 'framer-motion'
import { Bell, Mail, MessageSquare, Smartphone, FileText, Calendar } from 'lucide-react'
import Card from '../Card'
import { notificationSettings } from '../../data/settingsMockData'

const NotificationSection = ({ settings = notificationSettings, onUpdateSettings }) => {
  const handleToggle = (category, type) => {
    onUpdateSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [type]: !settings[category][type]
      }
    })
  }

  const handleCategoryToggle = (category) => {
    onUpdateSettings({
      ...settings,
      [category]: {
        ...settings[category],
        enabled: !settings[category].enabled
      }
    })
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

  const NotificationCategory = ({ title, icon: Icon, data, category }) => (
    <div className="p-4 bg-white/5 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-500/20 rounded-lg">
            <Icon className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <p className="text-white font-medium">{title}</p>
            <p className="text-xs text-gray-400">Configure {title.toLowerCase()}</p>
          </div>
        </div>
        <ToggleSwitch
          enabled={data.enabled}
          onToggle={() => handleCategoryToggle(category)}
        />
      </div>

      {data.enabled && (
        <div className="space-y-3 ml-11">
          {data.email !== undefined && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Email</span>
              </div>
              <ToggleSwitch
                enabled={data.email}
                onToggle={() => handleToggle(category, 'email')}
              />
            </div>
          )}
          {data.sms !== undefined && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">SMS</span>
              </div>
              <ToggleSwitch
                enabled={data.sms}
                onToggle={() => handleToggle(category, 'sms')}
              />
            </div>
          )}
          {data.push !== undefined && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Push</span>
              </div>
              <ToggleSwitch
                enabled={data.push}
                onToggle={() => handleToggle(category, 'push')}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-bold text-white">Notification Settings</h2>
        </div>

        <div className="space-y-4">
          <NotificationCategory
            title="Transaction Alerts"
            icon={FileText}
            data={settings.transactionAlerts}
            category="transactionAlerts"
          />
          <NotificationCategory
            title="Fraud Alerts"
            icon={Bell}
            data={settings.fraudAlerts}
            category="fraudAlerts"
          />
          <NotificationCategory
            title="Login Alerts"
            icon={Smartphone}
            data={settings.loginAlerts}
            category="loginAlerts"
          />
          <NotificationCategory
            title="Weekly Reports"
            icon={Calendar}
            data={settings.weeklyReports}
            category="weeklyReports"
          />
          <NotificationCategory
            title="Monthly Reports"
            icon={FileText}
            data={settings.monthlyReports}
            category="monthlyReports"
          />
        </div>

        {/* Info Notice */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-400 mb-1">Notification Preferences</p>
              <p className="text-xs text-gray-400">
                Customize how you receive notifications for important events. 
                Enable fraud alerts for enhanced security monitoring.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default NotificationSection
