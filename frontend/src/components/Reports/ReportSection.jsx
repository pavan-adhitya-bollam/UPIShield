import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, FileSpreadsheet, FileJson, BarChart3 } from 'lucide-react'
import Button from '../Button'
import Card from '../Card'
import transactionService from '../../services/transactionService'

const ReportSection = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleExportCSV = async () => {
    setLoading(true)
    setError('')
    try {
      const csv = await transactionService.exportCsv()
      const url = URL.createObjectURL(csv)
      const link = document.createElement('a')
      link.href = url
      link.download = `upi-shield-transactions-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 0)
    } catch (downloadError) {
      setError(downloadError.response?.data?.message || 'Unable to download the transaction report.')
    } finally {
      setLoading(false)
    }
  }

  const reportTypes = [
    {
      id: 1,
      title: 'Fraud Analysis Report',
      description: 'Comprehensive fraud detection analysis with trends and patterns',
      icon: FileText,
      color: 'text-red-400',
      bg: 'bg-red-500/20'
    },
    {
      id: 2,
      title: 'Transaction Summary',
      description: 'Daily, weekly, and monthly transaction summaries',
      icon: BarChart3,
      color: 'text-blue-400',
      bg: 'bg-blue-500/20'
    },
    {
      id: 3,
      title: 'User Activity Report',
      description: 'User behavior and activity patterns analysis',
      icon: FileSpreadsheet,
      color: 'text-green-400',
      bg: 'bg-green-500/20'
    },
    {
      id: 4,
      title: 'ML Performance Report',
      description: 'Machine learning model performance metrics',
      icon: FileJson,
      color: 'text-purple-400',
      bg: 'bg-purple-500/20'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-400" />
          Reports
        </h3>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Button
            onClick={handleExportCSV}
            variant="secondary"
            className="flex items-center justify-center gap-2"
            disabled={loading}
          >
            <Download className="w-4 h-4" />
            {loading ? 'Preparing...' : 'Download CSV'}
          </Button>
          <Button
            onClick={handleExportCSV}
            variant="secondary"
            className="flex items-center justify-center gap-2"
            disabled={loading}
          >
            <FileSpreadsheet className="w-4 h-4" />
            {loading ? 'Preparing...' : 'Export CSV'}
          </Button>
          <div className="flex items-center justify-center text-sm text-gray-400">
            CSV includes authorized transaction history
          </div>
        </div>
        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        {/* Report Types */}
        <div className="space-y-3">
          {reportTypes.map((report, index) => {
            const Icon = report.icon
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border ${report.bg} ${report.bg.replace('/20', '/30')} hover:opacity-80 transition-opacity cursor-pointer`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${report.bg}`}>
                    <Icon className={`w-5 h-5 ${report.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${report.color} mb-1`}>{report.title}</h4>
                    <p className="text-sm text-gray-400">{report.description}</p>
                  </div>
                  <Download className={`w-4 h-4 ${report.color} cursor-pointer hover:opacity-80`} />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Schedule Report */}
        <div className="mt-6 p-4 bg-gradient-primary/20 border border-primary-500/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium mb-1">Schedule Reports</p>
              <p className="text-sm text-gray-400">Automate report generation and delivery</p>
            </div>
            <Button variant="primary" size="sm">
              Configure
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default ReportSection
