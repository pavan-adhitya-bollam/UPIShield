import { motion } from 'framer-motion'
import { Shield, CheckCircle, AlertCircle, Lock, Eye, Smartphone } from 'lucide-react'
import Card from '../Card'

const SecurityScoreCard = ({ score = 92, level = 'Strong Security' }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return { color: '#10b981', bg: 'bg-green-500/20', text: 'text-green-400' }
    if (score >= 60) return { color: '#f59e0b', bg: 'bg-yellow-500/20', text: 'text-yellow-400' }
    if (score >= 40) return { color: '#f97316', bg: 'bg-orange-500/20', text: 'text-orange-400' }
    return { color: '#ef4444', bg: 'bg-red-500/20', text: 'text-red-400' }
  }

  const scoreColor = getScoreColor(score)

  const securityFeatures = [
    { name: 'Two-Factor Authentication', status: true, icon: Lock },
    { name: 'Strong Password', status: true, icon: Lock },
    { name: 'Biometric Login', status: true, icon: Smartphone },
    { name: 'Auto Logout', status: true, icon: Eye },
    { name: 'Transaction PIN', status: true, icon: Lock },
    { name: 'Device Management', status: true, icon: Smartphone }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-bold text-white">Security Score</h2>
        </div>

        {/* Score Display */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={12}
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke={scoreColor.color}
                strokeWidth={12}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(score / 100) * 440} 440`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-white">{score}</span>
              <span className="text-xs text-gray-400">/ 100</span>
            </div>
          </div>
        </div>

        {/* Security Level */}
        <div className={`text-center mb-6 p-4 rounded-xl ${scoreColor.bg}`}>
          <div className="flex items-center justify-center gap-2">
            {score >= 80 ? (
              <CheckCircle className={`w-5 h-5 ${scoreColor.text}`} />
            ) : (
              <AlertCircle className={`w-5 h-5 ${scoreColor.text}`} />
            )}
            <span className={`text-lg font-semibold ${scoreColor.text}`}>{level}</span>
          </div>
        </div>

        {/* Security Features */}
        <div className="space-y-3">
          <p className="text-sm text-gray-400 mb-3">Security Features Status</p>
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${feature.status ? 'text-green-400' : 'text-gray-500'}`} />
                  <span className="text-sm text-gray-300">{feature.name}</span>
                </div>
                {feature.status ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Recommendations */}
        <div className="mt-6 p-4 bg-gradient-primary/20 border border-primary-500/30 rounded-xl">
          <p className="text-sm font-medium text-white mb-2">Recommendations</p>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Enable two-factor authentication for all accounts</li>
            <li>• Use a unique password for this account</li>
            <li>• Review connected devices regularly</li>
            <li>• Keep your transaction PIN confidential</li>
          </ul>
        </div>
      </Card>
    </motion.div>
  )
}

export default SecurityScoreCard
