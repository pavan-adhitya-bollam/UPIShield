import { motion } from 'framer-motion'
import { User, Shield, Bell, Palette, CreditCard, Lock, Smartphone, History, HelpCircle, Info, ChevronRight } from 'lucide-react'
import Card from '../Card'
import { sidebarSections } from '../../data/settingsMockData'

const iconMap = {
  User,
  Shield,
  Bell,
  Palette,
  CreditCard,
  Lock,
  Smartphone,
  History,
  HelpCircle,
  Info
}

const SettingsSidebar = ({ activeSection, onSectionChange }) => {
  return (
    <Card className="h-fit">
      <h2 className="text-xl font-bold text-white mb-4">Settings</h2>

      <nav className="space-y-1">
        {sidebarSections.map((section) => {
          const Icon = iconMap[section.icon]
          const isActive = activeSection === section.id

          return (
            <motion.button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-gradient-primary text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span className="text-sm font-medium">{section.label}</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
            </motion.button>
          )
        })}
      </nav>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-xs text-gray-500 mb-3">Quick Actions</p>
        <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
          <Shield className="w-4 h-4" />
          Run Security Check
        </button>
        <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
          <History className="w-4 h-4" />
          View Activity Log
        </button>
      </div>
    </Card>
  )
}

export default SettingsSidebar
