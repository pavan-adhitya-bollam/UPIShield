import { motion } from 'framer-motion'
import { 
  Users, Activity, Shield, TrendingUp, Clock, 
  AlertTriangle, Search, Filter, Download, Eye 
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import Navbar from '../components/Navbar'
import StatCard from '../components/StatCard'
import Card from '../components/Card'
import Button from '../components/Button'
import { adminStats, fraudTrendData } from '../data/dummyData'

const AdminDashboard = () => {
  const recentAlerts = [
    { id: 1, type: 'high', message: 'Suspicious transaction detected - User #4521', time: '2 min ago' },
    { id: 2, type: 'medium', message: 'Multiple login attempts - User #3389', time: '15 min ago' },
    { id: 3, type: 'high', message: 'Unusual spending pattern - User #1290', time: '32 min ago' },
    { id: 4, type: 'low', message: 'New device registration - User #5672', time: '1 hour ago' },
  ]

  const systemHealth = [
    { metric: 'API Response Time', value: '0.8s', status: 'good' },
    { metric: 'Database Load', value: '45%', status: 'good' },
    { metric: 'Memory Usage', value: '62%', status: 'warning' },
    { metric: 'Server Uptime', value: '99.9%', status: 'good' },
  ]

  return (
    <div className="min-h-screen bg-gradient-dark pt-20">
      <Navbar type="dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Monitor system performance and fraud detection metrics</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={adminStats.totalUsers.toLocaleString()}
            icon={Users}
            color="primary"
            trend={{ value: 12, positive: true }}
          />
          <StatCard
            title="Active Users"
            value={adminStats.activeUsers.toLocaleString()}
            icon={Activity}
            color="accent"
            trend={{ value: 8, positive: true }}
          />
          <StatCard
            title="Fraud Blocked"
            value={adminStats.fraudBlocked}
            icon={Shield}
            color="green"
            trend={{ value: 15, positive: true }}
          />
          <StatCard
            title="Success Rate"
            value={`${adminStats.successRate}%`}
            icon={TrendingUp}
            color="primary"
          />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="text-xl font-semibold mb-4">Fraud Detection Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={fraudTrendData}>
                <defs>
                  <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Legend />
                <Area type="monotone" dataKey="fraud" stroke="#ef4444" fillOpacity={1} fill="url(#colorFraud)" name="Fraud Attempts" />
                <Area type="monotone" dataKey="blocked" stroke="#10b981" fillOpacity={1} fill="url(#colorBlocked)" name="Blocked" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold mb-4">Transaction Volume</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fraudTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Bar dataKey="fraud" fill="#a855f7" name="Total Transactions" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Alerts */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Recent Alerts</h3>
                <div className="flex gap-2">
                  <button className="p-2 bg-dark-600/50 border border-white/10 rounded-lg hover:bg-dark-500 transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
                  <Button variant="secondary" size="sm">View All</Button>
                </div>
              </div>

              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-xl border ${
                    alert.type === 'high' ? 'bg-red-500/10 border-red-500/20' :
                    alert.type === 'medium' ? 'bg-yellow-500/10 border-yellow-500/20' :
                    'bg-blue-500/10 border-blue-500/20'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                          alert.type === 'high' ? 'text-red-400' :
                          alert.type === 'medium' ? 'text-yellow-400' :
                          'text-blue-400'
                        }`} />
                        <div>
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm text-gray-400 mt-1">{alert.time}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* System Health */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <h3 className="text-xl font-semibold mb-6">System Health</h3>
              <div className="space-y-4">
                {systemHealth.map((item, index) => (
                  <div key={index} className="p-4 bg-dark-600/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{item.metric}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.status === 'good' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.status === 'good' ? 'bg-green-500' : 'bg-yellow-500'}`}
                        style={{ width: item.value.includes('%') ? item.value : '80%' }}
                      />
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-primary-400" />
                  <span className="font-medium text-primary-400">Average Response Time</span>
                </div>
                <p className="text-2xl font-bold">{adminStats.avgResponseTime}</p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card>
            <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <Button variant="secondary" className="flex items-center justify-center gap-2">
                <Users className="w-4 h-4" />
                Manage Users
              </Button>
              <Button variant="secondary" className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                Review Flags
              </Button>
              <Button variant="secondary" className="flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Export Reports
              </Button>
              <Button variant="secondary" className="flex items-center justify-center gap-2">
                <Activity className="w-4 h-4" />
                System Logs
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard
