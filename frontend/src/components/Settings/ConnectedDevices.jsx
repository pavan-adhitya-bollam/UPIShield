import { motion } from 'framer-motion'
import { Smartphone, Monitor, Laptop, MapPin, Clock, CheckCircle, XCircle, LogOut, Trash2 } from 'lucide-react'
import Card from '../Card'
import { connectedDevices } from '../../data/settingsMockData'

const ConnectedDevices = ({ devices = connectedDevices, onRemoveDevice, onLogoutDevice }) => {
  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'Mobile':
        return Smartphone
      case 'Laptop':
        return Laptop
      case 'Desktop':
        return Monitor
      default:
        return Smartphone
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Current Device':
        return 'text-green-400 bg-green-500/20'
      case 'Active':
        return 'text-blue-400 bg-blue-500/20'
      case 'Inactive':
        return 'text-gray-400 bg-gray-500/20'
      default:
        return 'text-gray-400 bg-gray-500/20'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Connected Devices</h2>
          <span className="text-sm text-gray-400">{devices.length} devices</span>
        </div>

        <div className="space-y-4">
          {devices.map((device, index) => {
            const DeviceIcon = getDeviceIcon(device.deviceType)
            const isCurrent = device.isCurrent

            return (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border ${isCurrent ? 'bg-primary-500/10 border-primary-500/30' : 'bg-white/5 border-white/10'}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${isCurrent ? 'bg-primary-500/20' : 'bg-white/10'}`}>
                      <DeviceIcon className={`w-5 h-5 ${isCurrent ? 'text-primary-400' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <p className="text-white font-medium">{device.deviceName}</p>
                      <p className="text-xs text-gray-400">{device.deviceType}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
                    {device.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-400">{device.browser}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-400">{device.operatingSystem}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-400">{device.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-400">{device.lastActive}</span>
                  </div>
                </div>

                {!isCurrent && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onLogoutDevice(device.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                    <button
                      onClick={() => onRemoveDevice(device.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-sm text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                )}

                {isCurrent && (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>This is your current device</span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-400 mb-1">Security Notice</p>
              <p className="text-xs text-gray-400">
                If you don't recognize a device, immediately remove it and change your password.
                Regularly review your connected devices to maintain account security.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default ConnectedDevices
