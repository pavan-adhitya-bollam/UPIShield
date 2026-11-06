import { motion } from 'framer-motion'
import { Info, Cpu, Database, Calendar, Code, Users, Globe, Shield, Zap } from 'lucide-react'
import Card from '../Card'
import { aboutSystemData } from '../../data/settingsMockData'

const AboutSystem = ({ data = aboutSystemData }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Info className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-bold text-white">About System</h2>
        </div>

        {/* Project Name */}
        <div className="p-6 bg-gradient-primary/20 border border-primary-500/30 rounded-xl mb-6">
          <h3 className="text-lg font-bold text-white mb-2">{data.projectName}</h3>
          <p className="text-sm text-gray-300">{data.description}</p>
        </div>

        {/* Version Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Cpu className="w-5 h-5 text-primary-400" />
              <p className="text-xs text-gray-400">Application Version</p>
            </div>
            <p className="text-lg font-bold text-white">{data.applicationVersion}</p>
          </div>

          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Code className="w-5 h-5 text-accent-400" />
              <p className="text-xs text-gray-400">Frontend Version</p>
            </div>
            <p className="text-lg font-bold text-white">{data.frontendVersion}</p>
          </div>

          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-5 h-5 text-green-400" />
              <p className="text-xs text-gray-400">ML Model</p>
            </div>
            <p className="text-lg font-bold text-white">{data.machineLearningModel}</p>
          </div>

          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-5 h-5 text-purple-400" />
              <p className="text-xs text-gray-400">Dataset Version</p>
            </div>
            <p className="text-lg font-bold text-white">{data.datasetVersion}</p>
          </div>

          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-orange-400" />
              <p className="text-xs text-gray-400">Last Training Date</p>
            </div>
            <p className="text-lg font-bold text-white">{data.lastModelTrainingDate}</p>
          </div>

          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <p className="text-xs text-gray-400">Prediction Threshold</p>
            </div>
            <p className="text-lg font-bold text-white">{data.predictionThreshold}</p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white mb-3">Key Features</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {data.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 p-3 bg-white/5 rounded-lg"
              >
                <Shield className="w-4 h-4 text-primary-400" />
                <span className="text-xs text-gray-300">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Developer Information */}
        <div className="p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-5 h-5 text-blue-400" />
            <p className="text-sm font-semibold text-white">Developer Information</p>
          </div>
          <div className="space-y-2 ml-8">
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-400">Team:</p>
              <p className="text-sm text-white">{data.developerInfo.team}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-400">Contact:</p>
              <p className="text-sm text-white">{data.developerInfo.contact}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-400">Website:</p>
              <p className="text-sm text-white">{data.developerInfo.website}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* System Status */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">System Status</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-sm text-gray-300">Fraud Detection Service</span>
            </div>
            <span className="text-xs text-green-400">Operational</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-sm text-gray-300">ML Model</span>
            </div>
            <span className="text-xs text-green-400">Active</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-sm text-gray-300">API Services</span>
            </div>
            <span className="text-xs text-green-400">Running</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="text-sm text-gray-300">Database</span>
            </div>
            <span className="text-xs text-yellow-400">Maintenance</span>
          </div>
        </div>
      </Card>

      {/* Legal Notice */}
      <Card>
        <div className="flex items-start gap-3">
          <Globe className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-white mb-2">Legal Information</p>
            <p className="text-xs text-gray-400">
              This system is protected by intellectual property laws. Unauthorized reproduction, 
              distribution, or use of this software is strictly prohibited. All rights reserved © 2024.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default AboutSystem
