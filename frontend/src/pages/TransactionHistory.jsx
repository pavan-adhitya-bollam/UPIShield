import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Search, Filter, Download, Calendar, 
  ArrowUpRight, ArrowDownLeft, ChevronDown 
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Card from '../components/Card'
import { recentTransactions } from '../data/dummyData'

const TransactionHistory = () => {
  return (
    <div className="min-h-screen bg-gradient-dark pt-20">
      <Navbar type="dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">Transaction History</h1>
          <p className="text-gray-400">View and manage all your transactions</p>
        </motion.div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="pl-10 pr-4 py-2 w-full bg-dark-600/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500/50"
              />
            </div>
            
            <div className="flex items-center gap-2 bg-dark-600/50 border border-white/10 rounded-lg px-4 py-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select className="bg-transparent focus:outline-none text-sm">
                <option>Last 30 days</option>
                <option>Last 7 days</option>
                <option>Last 90 days</option>
                <option>This year</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-dark-600/50 border border-white/10 rounded-lg px-4 py-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select className="bg-transparent focus:outline-none text-sm">
                <option>All Categories</option>
                <option>Shopping</option>
                <option>Transfer</option>
                <option>Utilities</option>
                <option>Entertainment</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-dark-600/50 border border-white/10 rounded-lg px-4 py-2">
              <select className="bg-transparent focus:outline-none text-sm">
                <option>All Status</option>
                <option>Completed</option>
                <option>Pending</option>
                <option>Flagged</option>
                <option>Failed</option>
              </select>
            </div>

            <Button variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </Card>

        {/* Transactions Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-white/10">
                  <th className="pb-4">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-white">
                      Transaction
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="pb-4">Date & Time</th>
                  <th className="pb-4">Category</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Risk Level</th>
                  <th className="pb-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((txn, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${txn.type === 'credit' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {txn.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-medium">{txn.name}</p>
                          <p className="text-xs text-gray-500">{txn.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-gray-400">
                      <p>{txn.date}</p>
                      <p className="text-xs">{txn.time}</p>
                    </td>
                    <td className="py-4">
                      <span className="px-3 py-1 bg-dark-600 rounded-full text-sm">{txn.category}</span>
                    </td>
                    <td className={`py-4 font-semibold ${txn.type === 'credit' ? 'text-green-400' : 'text-white'}`}>
                      {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        txn.status === 'completed' ? 'bg-green-500/20 text-green-400' : 
                        txn.status === 'flagged' ? 'bg-red-500/20 text-red-400' : 
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        txn.riskLevel === 'low' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {txn.riskLevel}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          <Search className="w-4 h-4 text-gray-400" />
                        </button>
                        {txn.status === 'flagged' && (
                          <Link to="/fraud-result">
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                              <Filter className="w-4 h-4 text-red-400" />
                            </button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
            <p className="text-sm text-gray-400">Showing 1-6 of 45 transactions</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-dark-600/50 border border-white/10 rounded-lg hover:bg-dark-500 transition-colors text-sm">
                Previous
              </button>
              <button className="px-3 py-1 bg-gradient-primary rounded-lg text-sm">1</button>
              <button className="px-3 py-1 bg-dark-600/50 border border-white/10 rounded-lg hover:bg-dark-500 transition-colors text-sm">
                2
              </button>
              <button className="px-3 py-1 bg-dark-600/50 border border-white/10 rounded-lg hover:bg-dark-500 transition-colors text-sm">
                3
              </button>
              <button className="px-3 py-1 bg-dark-600/50 border border-white/10 rounded-lg hover:bg-dark-500 transition-colors text-sm">
                Next
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default TransactionHistory
