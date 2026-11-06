import { motion } from 'framer-motion'
import { FileText, Download, FileSpreadsheet, FileJson, BarChart3 } from 'lucide-react'
import Button from '../Button'
import Card from '../Card'

const ReportSection = () => {
  const handleExportPDF = () => {
    console.log('Exporting PDF report')
  }

  const handleExportCSV = () => {
    console.log('Exporting CSV report')
  }

  const handleDownloadAnalytics = () => {
    console.log('Downloading analytics')
  }

  const handleGenerateReport = () => {
    console.log('Generating custom report')
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
            onClick={handleExportPDF}
            variant="secondary"
            className="flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
          <Button
            onClick={handleExportCSV}
            variant="secondary"
            className="flex items-center justify-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export CSV
          </Button>
          <Button
            onClick={handleDownloadAnalytics}
            variant="secondary"
            className="flex items-center justify-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Button>
          <Button
            onClick={handleGenerateReport}
            variant="primary"
            className="flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Generate
          </Button>
        </div>

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
