import { motion } from 'framer-motion'
import { 
  Store, DollarSign, ShoppingBag, TrendingUp, 
  Star, Shield, Search, Filter, Download, 
  Calendar, ArrowUpRight, ArrowDownLeft 
} from 'lucide-react'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import Navbar from '../components/Navbar'
import StatCard from '../components/StatCard'
import Card from '../components/Card'
import Button from '../components/Button'
import { merchantStats, fraudTrendData, categoryData } from '../data/dummyData'

const MerchantDashboard = () => {
  const COLORS = ['#a855f7', '#0ea5e9', '#10b981', '#f59e0b', '#6b7280']

  const recentOrders = [
    { id: 'ORD001', customer: 'Rahul Sharma', amount: 2450, status: 'completed', time: '10 min ago' },
    { id: 'ORD002', customer: 'Priya Patel', amount: 890, status: 'completed', time: '25 min ago' },
    { id: 'ORD003', customer: 'Amit Kumar', amount: 3200, status: 'flagged', time: '45 min ago' },
    { id: 'ORD004', customer: 'Sneha Reddy', amount: 1560, status: 'completed', time: '1 hour ago' },
    { id: 'ORD005', customer: 'Vijay Singh', amount: 780, status: 'pending', time: '2 hours ago' },
  ]

  const topProducts = [
    { name: 'Premium Plan', sales: 245, revenue: 122500 },
    { name: 'Basic Plan', sales: 189, revenue: 37800 },
    { name: 'Enterprise Plan', sales: 67, revenue: 201000 },
    { name: 'Add-on Services', sales: 156, revenue: 31200 },
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
          <h1 className="text-3xl font-bold gradient-text mb-2">Merchant Dashboard</h1>
          <p className="text-gray-400">Track your business performance and fraud protection metrics</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`₹${(merchantStats.totalRevenue / 100000).toFixed(1)}L`}
            icon={DollarSign}
            color="primary"
            trend={{ value: 18, positive: true }}
          />
          <StatCard
            title="Today's Revenue"
            value={`₹${merchantStats.todayRevenue.toLocaleString()}`}
            icon={TrendingUp}
            color="accent"
            trend={{ value: 12, positive: true }}
          />
          <StatCard
            title="Total Orders"
            value={merchantStats.totalOrders}
            icon={ShoppingBag}
            color="green"
            trend={{ value: 8, positive: true }}
          />
          <StatCard
            title="Fraud Rate"
            value={`${merchantStats.fraudRate}%`}
            icon={Shield}
            color="red"
          />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="text-xl font-semibold mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={fraudTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="fraud" stroke="#a855f7" strokeWidth={2} name="Revenue (₹K)" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold mb-4">Sales by Category</h3>
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Recent Orders</h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      className="pl-10 pr-4 py-2 bg-dark-600/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500/50 text-sm"
                    />
                  </div>
                  <Button variant="secondary" size="sm">View All</Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm border-b border-white/10">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 font-medium">{order.id}</td>
                        <td className="py-4">{order.customer}</td>
                        <td className="py-4 font-semibold">₹{order.amount.toLocaleString()}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            order.status === 'flagged' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 text-gray-400 text-sm">{order.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>

          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <h3 className="text-xl font-semibold mb-6">Top Products</h3>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="p-4 bg-dark-600/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-sm text-gray-400">{product.sales} sales</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-400 font-semibold">₹{product.revenue.toLocaleString()}</span>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm">{4.5 + Math.random() * 0.5}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Customer Satisfaction */}
            <Card className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <h3 className="text-xl font-semibold">Customer Satisfaction</h3>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold gradient-text mb-2">{merchantStats.customerSatisfaction}</p>
                <p className="text-gray-400">out of 5.0</p>
                <div className="flex justify-center gap-1 mt-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
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
                <ShoppingBag className="w-4 h-4" />
                Manage Products
              </Button>
              <Button variant="secondary" className="flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Export Reports
              </Button>
              <Button variant="secondary" className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                Fraud Settings
              </Button>
              <Button variant="secondary" className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule Reports
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default MerchantDashboard
