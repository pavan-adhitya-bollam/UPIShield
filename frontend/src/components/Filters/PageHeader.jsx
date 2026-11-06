import { motion } from 'framer-motion'
import { Download, FileSpreadsheet, RefreshCw } from 'lucide-react'
import Button from '../Button'

const PageHeader = ({ onDownloadReport, onExportCSV, onRefresh }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold gradient-text">
            Transaction History
          </h1>
          <p className="text-gray-400 mt-1">
            View, search and analyze all UPI transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={onDownloadReport}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Report
          </Button>
          <Button
            onClick={onExportCSV}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export CSV
          </Button>
          <Button
            onClick={onRefresh}
            variant="primary"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default PageHeader
