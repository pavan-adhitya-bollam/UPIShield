import { motion } from 'framer-motion'
import { Cpu, Download, FileText, BarChart3 } from 'lucide-react'
import ModelOverview from '../../../components/ModelInsights/ModelOverview'
import ConfusionMatrix from '../../../components/ModelInsights/ConfusionMatrix'
import PerformanceCharts from '../../../components/ModelInsights/PerformanceCharts'
import FeatureImportance from '../../../components/ModelInsights/FeatureImportance'
import SHAPAnalysis from '../../../components/ModelInsights/SHAPAnalysis'
import ModelPredictionMonitor from '../../../components/ModelInsights/ModelPredictionMonitor'
import ModelHealth from '../../../components/ModelInsights/ModelHealth'
import DatasetInformation from '../../../components/ModelInsights/DatasetInformation'
import ThresholdSimulator from '../../../components/ModelInsights/ThresholdSimulator'
import VersionHistory from '../../../components/ModelInsights/VersionHistory'
import Recommendations from '../../../components/ModelInsights/Recommendations'

const ModelInsightsPage = () => {
  const handleDownloadMetrics = () => {
    console.log('Download metrics')
  }

  const handleDownloadModelReport = () => {
    console.log('Download model report')
  }

  const handleDownloadFeatureImportance = () => {
    console.log('Download feature importance')
  }

  const handleDownloadSHAPReport = () => {
    console.log('Download SHAP report')
  }

  return (
    <div className="min-h-screen bg-dark-900 p-4 lg:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-primary rounded-xl">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">AI Model Insights Center</h1>
              <p className="text-sm text-gray-400">HistGradientBoosting Model Monitoring & Analysis</p>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleDownloadMetrics}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              Metrics
            </button>
            <button
              onClick={handleDownloadModelReport}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
            >
              <FileText className="w-4 h-4" />
              Model Report
            </button>
            <button
              onClick={handleDownloadFeatureImportance}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              Feature Importance
            </button>
            <button
              onClick={handleDownloadSHAPReport}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
            >
              <FileText className="w-4 h-4" />
              SHAP Report
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Row 1 */}
          <div className="lg:col-span-2">
            <ModelOverview />
          </div>

          {/* Row 2 */}
          <div>
            <ConfusionMatrix />
          </div>
          <div>
            <ModelPredictionMonitor />
          </div>

          {/* Row 3 */}
          <div>
            <ModelHealth />
          </div>
          <div>
            <DatasetInformation />
          </div>

          {/* Row 4 */}
          <div className="lg:col-span-2">
            <PerformanceCharts />
          </div>

          {/* Row 5 */}
          <div>
            <FeatureImportance />
          </div>
          <div>
            <SHAPAnalysis />
          </div>

          {/* Row 6 */}
          <div>
            <ThresholdSimulator />
          </div>
          <div>
            <VersionHistory />
          </div>

          {/* Row 7 */}
          <div className="lg:col-span-2">
            <Recommendations />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ModelInsightsPage
