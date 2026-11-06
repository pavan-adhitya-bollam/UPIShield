import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { LineChart as LineChartIcon, BarChart as BarChartIcon, PieChart as PieChartIcon } from 'lucide-react'
import Card from '../Card'
import { performanceMetrics } from '../../data/modelInsightsMockData'

const PerformanceCharts = ({ metrics = performanceMetrics }) => {
  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-800 border border-white/10 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-gray-400 text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* ROC Curve */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <LineChartIcon className="w-5 h-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">ROC Curve</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.rocCurve}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="fpr"
                  stroke="#9ca3af"
                  strokeWidth={1}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -5, fill: '#9ca3af', fontSize: 10 }}
                />
                <YAxis
                  stroke="#9ca3af"
                  strokeWidth={1}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 10 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                <Line
                  type="monotone"
                  dataKey="tpr"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  name="ROC"
                />
                <Line
                  type="monotone"
                  dataKey="fpr"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                  name="Random"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Precision-Recall Curve */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <LineChartIcon className="w-5 h-5 text-accent-400" />
            <h3 className="text-lg font-semibold text-white">Precision-Recall Curve</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.precisionRecall}>
                <defs>
	              <linearGradient id="colorPrecision" x1="0" y1="0" x2="0" y2="1">
	                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
	                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
	              </linearGradient>
	            </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="recall"
                  stroke="#9ca3af"
                  strokeWidth={1}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  label={{ value: 'Recall', position: 'insideBottom', offset: -5, fill: '#9ca3af', fontSize: 10 }}
                />
                <YAxis
                  stroke="#9ca3af"
                  strokeWidth={1}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  label={{ value: 'Precision', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 10 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                <Area
                  type="monotone"
                  dataKey="precision"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPrecision)"
                  name="Precision"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Prediction Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <BarChartIcon className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Prediction Distribution</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.predictionDistribution}>
                <defs>
                  <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="range"
                  stroke="#9ca3af"
                  strokeWidth={1}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis
                  stroke="#9ca3af"
                  strokeWidth={1}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                <Bar dataKey="count" fill="url(#colorPrediction)" radius={[4, 4, 0, 0]} name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Fraud vs Genuine */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Fraud vs Genuine</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.fraudVsGenuine}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {metrics.fraudVsGenuine.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Confidence Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <BarChartIcon className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">Confidence Distribution</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.confidenceDistribution}>
                <defs>
                  <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="range"
                  stroke="#9ca3af"
                  strokeWidth={1}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis
                  stroke="#9ca3af"
                  strokeWidth={1}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                <Bar dataKey="count" fill="url(#colorConfidence)" radius={[4, 4, 0, 0]} name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default PerformanceCharts
