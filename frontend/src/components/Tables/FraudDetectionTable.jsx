import { motion } from 'framer-motion'
import { Search, Filter, Eye, XCircle, CheckCircle, Clock } from 'lucide-react'
import Card from '../Card'

const FraudDetectionTable = ({ data = [], filters, onFiltersChange, onViewDetails }) => {
  const handleSearch = (value) => {
    onFiltersChange({ ...filters, search: value })
  }

  const handleSelect = (key, value) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.senderUpi.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.receiverUpi.toLowerCase().includes(filters.search.toLowerCase())

    const matchesDate =
      (!filters.dateFrom || item.date >= filters.dateFrom) &&
      (!filters.dateTo || item.date <= filters.dateTo)

    const matchesAmount =
      (!filters.amountMin || item.amount >= Number(filters.amountMin)) &&
      (!filters.amountMax || item.amount <= Number(filters.amountMax))

    const matchesRisk = filters.riskLevel === 'All' || item.riskLevel === filters.riskLevel
    const matchesPrediction = filters.predictionStatus === 'All' || item.predictionStatus === filters.predictionStatus

    return matchesSearch && matchesDate && matchesAmount && matchesRisk && matchesPrediction
  })

  const getRiskColor = (level) => {
    switch (level) {
      case 'LOW': return 'text-green-400'
      case 'MEDIUM': return 'text-yellow-400'
      case 'HIGH': return 'text-orange-400'
      case 'CRITICAL': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getPredictionColor = (status) => {
    switch (status) {
      case 'Fraud': return 'text-red-400'
      case 'Genuine': return 'text-green-400'
      case 'Review Required': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            <div className="flex items-center gap-2 bg-dark-700/50 border border-white/10 rounded-xl px-3 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search Transaction ID or UPI ID"
                className="bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm w-full"
              />
            </div>
            <div className="flex items-center gap-2 bg-dark-700/50 border border-white/10 rounded-xl px-3 py-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filters.riskLevel}
                onChange={(e) => handleSelect('riskLevel', e.target.value)}
                className="bg-transparent border-none outline-none text-white text-sm w-full cursor-pointer"
              >
                {['All', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 bg-dark-700/50 border border-white/10 rounded-xl px-3 py-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filters.predictionStatus}
                onChange={(e) => handleSelect('predictionStatus', e.target.value)}
                className="bg-transparent border-none outline-none text-white text-sm w-full cursor-pointer"
              >
                {['All', 'Fraud', 'Genuine', 'Review Required'].map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleSelect('dateFrom', e.target.value)}
                className="bg-dark-700/50 border border-white/10 rounded-xl px-3 py-2 text-white text-sm"
              />
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleSelect('dateTo', e.target.value)}
                className="bg-dark-700/50 border border-white/10 rounded-xl px-3 py-2 text-white text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <input
              type="number"
              placeholder="Min Amount"
              value={filters.amountMin}
              onChange={(e) => handleSelect('amountMin', e.target.value)}
              className="bg-dark-700/50 border border-white/10 rounded-xl px-3 py-2 text-white text-sm"
            />
            <input
              type="number"
              placeholder="Max Amount"
              value={filters.amountMax}
              onChange={(e) => handleSelect('amountMax', e.target.value)}
              className="bg-dark-700/50 border border-white/10 rounded-xl px-3 py-2 text-white text-sm"
            />
            <div className="flex items-center justify-end">
              <button
                onClick={() => onFiltersChange({ search: '', dateFrom: '', dateTo: '', amountMin: '', amountMax: '', riskLevel: 'All', predictionStatus: 'All' })}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-white transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs text-gray-400 uppercase tracking-wider">
                <th className="px-3 py-3">Transaction ID</th>
                <th className="px-3 py-3">Amount</th>
                <th className="px-3 py-3">Type</th>
                <th className="px-3 py-3">Time</th>
                <th className="px-3 py-3">Location</th>
                <th className="px-3 py-3">Device Status</th>
                <th className="px-3 py-3">Risk Score</th>
                <th className="px-3 py-3">Fraud %</th>
                <th className="px-3 py-3">Risk Level</th>
                <th className="px-3 py-3">Prediction</th>
                <th className="px-3 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-3 py-3 text-sm text-white font-medium">{item.id}</td>
                  <td className="px-3 py-3 text-sm text-gray-300">₹{item.amount.toLocaleString()}</td>
                  <td className="px-3 py-3 text-sm text-gray-300">{item.transactionType}</td>
                  <td className="px-3 py-3 text-sm text-gray-300">{item.date} {item.time}</td>
                  <td className="px-3 py-3 text-sm text-gray-300">{item.location}</td>
                  <td className="px-3 py-3 text-sm text-gray-300">{item.deviceStatus}</td>
                  <td className="px-3 py-3 text-sm font-semibold text-white">{item.riskScore}</td>
                  <td className="px-3 py-3 text-sm font-semibold text-red-400">{item.fraudProbability}%</td>
                  <td className={`px-3 py-3 text-sm font-semibold ${getRiskColor(item.riskLevel)}`}>{item.riskLevel}</td>
                  <td className={`px-3 py-3 text-sm font-semibold ${getPredictionColor(item.predictionStatus)}`}>{item.predictionStatus}</td>
                  <td className="px-3 py-3 text-sm">
                    <button
                      onClick={() => onViewDetails(item)}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-white transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  )
}

export default FraudDetectionTable
