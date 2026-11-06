import { useState } from 'react'
import { motion } from 'framer-motion'
import SettingsSidebar from '../../components/Settings/SettingsSidebar'
import ProfileSection from '../../components/Settings/ProfileSection'
import SecuritySection from '../../components/Settings/SecuritySection'
import SecurityScoreCard from '../../components/Settings/SecurityScoreCard'
import ConnectedDevices from '../../components/Settings/ConnectedDevices'
import LoginHistory from '../../components/Settings/LoginHistory'
import NotificationSection from '../../components/Settings/NotificationSection'
import AppearanceSection from '../../components/Settings/AppearanceSection'
import TransactionSettings from '../../components/Settings/TransactionSettings'
import PrivacySection from '../../components/Settings/PrivacySection'
import HelpSupport from '../../components/Settings/HelpSupport'
import AboutSystem from '../../components/Settings/AboutSystem'
import {
  profileData,
  securityData,
  notificationSettings,
  appearanceSettings,
  transactionSettings,
  privacySettings
} from '../../data/settingsMockData'
import { useTheme } from '../../context/ThemeContext'

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('profile')
  const [securitySettings, setSecuritySettings] = useState(securityData)
  const [notificationPrefs, setNotificationPrefs] = useState(notificationSettings)
  const [appearancePrefs, setAppearancePrefs] = useState(appearanceSettings)
  const [transactionPrefs, setTransactionPrefs] = useState(transactionSettings)
  const [privacyPrefs, setPrivacyPrefs] = useState(privacySettings)
  const { isDark } = useTheme()

  const handleEditProfile = () => {
    console.log('Edit profile clicked')
  }

  const handleUpdateSecurity = (newSettings) => {
    setSecuritySettings(newSettings)
  }

  const handleRemoveDevice = (deviceId) => {
    console.log('Remove device:', deviceId)
  }

  const handleLogoutDevice = (deviceId) => {
    console.log('Logout device:', deviceId)
  }

  const handleUpdateNotifications = (newSettings) => {
    setNotificationPrefs(newSettings)
  }

  const handleUpdateAppearance = (newSettings) => {
    setAppearancePrefs({ ...newSettings, darkMode: isDark })
  }

  const handleUpdateTransaction = (newSettings) => {
    setTransactionPrefs(newSettings)
  }

  const handleUpdatePrivacy = (newSettings) => {
    setPrivacyPrefs(newSettings)
  }

  const handleDownloadData = () => {
    console.log('Download personal data')
  }

  const handleDeleteAccount = () => {
    console.log('Delete account')
  }

  const handleReportIssue = () => {
    console.log('Report issue')
  }

  const handleChatSupport = () => {
    console.log('Chat support')
  }

  const handleEmailSupport = () => {
    console.log('Email support')
  }

  const handleCallSupport = () => {
    console.log('Call support')
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection onEditProfile={handleEditProfile} />
      case 'security':
        return (
          <div className="space-y-6">
            <SecuritySection
              securityData={securitySettings}
              onUpdateSecurity={handleUpdateSecurity}
            />
            <SecurityScoreCard
              score={securitySettings.securityScore}
              level={securitySettings.securityLevel}
            />
          </div>
        )
      case 'notifications':
        return (
          <NotificationSection
            settings={notificationPrefs}
            onUpdateSettings={handleUpdateNotifications}
          />
        )
      case 'appearance':
        return (
          <AppearanceSection
            settings={appearancePrefs}
            onUpdateSettings={handleUpdateAppearance}
          />
        )
      case 'transaction':
        return (
          <TransactionSettings
            settings={transactionPrefs}
            onUpdateSettings={handleUpdateTransaction}
          />
        )
      case 'privacy':
        return (
          <PrivacySection
            settings={privacyPrefs}
            onUpdateSettings={handleUpdatePrivacy}
            onDownloadData={handleDownloadData}
            onDeleteAccount={handleDeleteAccount}
          />
        )
      case 'devices':
        return (
          <ConnectedDevices
            onRemoveDevice={handleRemoveDevice}
            onLogoutDevice={handleLogoutDevice}
          />
        )
      case 'loginHistory':
        return <LoginHistory />
      case 'help':
        return (
          <HelpSupport
            onReportIssue={handleReportIssue}
            onChatSupport={handleChatSupport}
            onEmailSupport={handleEmailSupport}
            onCallSupport={handleCallSupport}
          />
        )
      case 'about':
        return <AboutSystem />
      default:
        return <ProfileSection onEditProfile={handleEditProfile} />
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 p-4 lg:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <SettingsSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderSection()}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SettingsPage
