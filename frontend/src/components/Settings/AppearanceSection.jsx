import { motion } from 'framer-motion'
import { Moon, Sun, Palette, Type, Layout, Zap } from 'lucide-react'
import Card from '../Card'
import { appearanceSettings, themeColors, fontSizes } from '../../data/settingsMockData'
import { useTheme } from '../../context/ThemeContext'

const AppearanceSection = ({ settings = appearanceSettings, onUpdateSettings }) => {
  const { isDark, setTheme } = useTheme()

  const handleToggle = (key) => {
    if (key === 'darkMode') {
      setTheme(isDark ? 'light' : 'dark')
    }
    onUpdateSettings({ ...settings, [key]: !settings[key] })
  }

  const handleSelect = (key, value) => {
    onUpdateSettings({ ...settings, [key]: value })
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
          <Palette className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-bold text-white">Appearance Settings</h2>
        </div>

        <div className="space-y-6">
          {/* Dark Mode */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Moon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-medium">Dark Mode</p>
                <p className="text-xs text-gray-400">Use dark theme</p>
              </div>
            </div>
            <ToggleSwitch
              enabled={isDark}
              onToggle={() => handleToggle('darkMode')}
            />
          </div>

          {/* Theme Color */}
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Palette className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">Theme Color</p>
                <p className="text-xs text-gray-400">Choose your preferred theme color</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 ml-11">
              {themeColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleSelect('themeColor', color.id)}
                  className={`w-10 h-10 rounded-full transition-all ${
                    settings.themeColor === color.id
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-dark-800 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.color }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Accent Color */}
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-pink-500/20 rounded-lg">
                <Palette className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <p className="text-white font-medium">Accent Color</p>
                <p className="text-xs text-gray-400">Choose accent color for highlights</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 ml-11">
              {themeColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleSelect('accentColor', color.id)}
                  className={`w-10 h-10 rounded-full transition-all ${
                    settings.accentColor === color.id
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-dark-800 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.color }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Type className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white font-medium">Font Size</p>
                <p className="text-xs text-gray-400">Adjust text size for readability</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 ml-11">
              {fontSizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => handleSelect('fontSize', size.id)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    settings.fontSize === size.id
                      ? 'bg-gradient-primary text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                  style={{ fontSize: size.size }}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>

          {/* Compact View */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Layout className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-white font-medium">Compact View</p>
                <p className="text-xs text-gray-400">Use compact layout for more content</p>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.compactView}
              onToggle={() => handleToggle('compactView')}
            />
          </div>

          {/* Animations */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-white font-medium">Animations</p>
                <p className="text-xs text-gray-400">Enable smooth animations</p>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.animations}
              onToggle={() => handleToggle('animations')}
            />
          </div>
        </div>

        {/* Preview Notice */}
        <div className="mt-6 p-4 bg-gradient-primary/20 border border-primary-500/30 rounded-xl">
          <p className="text-sm font-medium text-white mb-2">Preview</p>
          <p className="text-xs text-gray-400">
            Changes will be applied immediately. Some settings may require a page refresh to take full effect.
          </p>
        </div>
      </Card>
    </motion.div>
  )
}

export default AppearanceSection
