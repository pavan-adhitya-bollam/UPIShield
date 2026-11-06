import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Wallet, ArrowUpRight, Shield, TrendingUp, 
  AlertTriangle, Search, Filter, ArrowRight 
} from 'lucide-react'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Navbar from '../components/Navbar'
import StatCard from '../components/StatCard'
import Card from '../components/Card'
import Button from '../components/Button'
import { userStats, recentTransactions, fraudTrendData, categoryData } from '../data/dummyData'

const UserDashboard = () => {
  const COLORS = ['#a855f7', '#0ea5e9', '#10b981', '#f59e0b', '#6b7280']

  return (
    <div className="min-h-screen bg-gradient-dark pt-20">
      <Navbar type="dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's your account overview.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Balance"
            value={`₹${userStats.totalBalance.toLocaleString()}`}
            icon={Wallet}
            color="primary"
            trend={{ value: 12, positive: true }}
          />
          <StatCard
            title="Monthly Spending"
            value={`₹${userStats.monthlySpending.toLocaleString()}`}
            icon={TrendingUp}
            color="accent"
            trend={{ value: 8, positive: false }}
          />
          <StatCard
            title="Fraud Blocked"
            value={userStats.fraudAttemptsBlocked}
            icon={Shield}
            color="green"
            trend={{ value: 25, positive: true }}
          />
          <StatCard
            title="Risk Score"
            value={userStats.riskScore}
            icon={AlertTriangle}
            color="red"
          />
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Fraud Trend Chart */}
          <Card>
            <h3 className="text-xl font-semibold mb-4">Fraud Detection Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={fraudTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="fraud" stroke="#ef4444" strokeWidth={2} name="Fraud Attempts" />
                <Line type="monotone" dataKey="blocked" stroke="#10b981" strokeWidth={2} name="Blocked" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Category Distribution */}
          <Card>
            <h3 className="text-xl font-semibold mb-4">Spending by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Recent Transactions</h3>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="pl-10 pr-4 py-2 bg-dark-600/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500/50 text-sm"
                />
              </div>
              <button className="p-2 bg-dark-600/50 border border-white/10 rounded-lg hover:bg-dark-500 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
              <Link to="/transactions">
                <Button variant="secondary" size="sm">View All</Button>
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-white/10">
                  <th className="pb-3">Transaction</th>
                  <th className="pb-3">Date & Time</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Risk</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((txn, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${txn.type === 'credit' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {txn.type === 'credit' ? <ArrowUpRight className="w-4 h-4 rotate-45" /> : <ArrowUpRight className="w-4 h-4 -rotate-45" />}
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
                        txn.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Link to="/send-money">
            <Card hover className="cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Send Money</h3>
                  <p className="text-gray-400">Quick and secure UPI transfers</p>
                </div>
                <div className="p-3 bg-gradient-primary rounded-xl group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </Link>
          <Link to="/transactions">
            <Card hover className="cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">View History</h3>
                  <p className="text-gray-400">Check all your transactions</p>
                </div>
                <div className="p-3 bg-gradient-secondary rounded-xl group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
