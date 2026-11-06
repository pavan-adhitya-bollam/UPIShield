import { motion } from 'framer-motion'
import { RefreshCw, FileText } from 'lucide-react'
import Card from '../Card'

const EmptyState = ({ onRefresh }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex flex-col items-center justify-center py-16">
          {/* Illustration */}
          <div className="w-32 h-32 mb-6 relative">
            <div className="absolute inset-0 bg-gradient-primary/20 rounded-full animate-pulse" />
            <div className="absolute inset-4 bg-gradient-primary/30 rounded-full animate-pulse delay-100" />
            <div className="absolute inset-8 bg-gradient-primary/40 rounded-full animate-pulse delay-200" />
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText className="w-16 h-16 text-gray-600" />
            </div>
          </div>

          {/* Message */}
          <h3 className="text-xl font-semibold text-white mb-2">
            No Transactions Found
          </h3>
          <p className="text-gray-400 text-center max-w-md mb-6">
            We couldn't find any transactions matching your search criteria.
            Try adjusting your filters or search terms.
          </p>

          {/* Action Button */}
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

          {/* Suggestions */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-2">Suggestions:</p>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Clear all filters and try again</li>
              <li>• Check your search terms for typos</li>
              <li>• Try a different date range</li>
            </ul>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default EmptyState
