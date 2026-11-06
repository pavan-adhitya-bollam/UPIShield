import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, User, Search, QrCode, Clock, ShieldCheck } from 'lucide-react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'

const SendMoney = () => {
  const recentRecipients = [
    { name: 'Rahul Sharma', upi: 'rahul@okhdfcbank', avatar: 'RS' },
    { name: 'Priya Patel', upi: 'priya@oksbi', avatar: 'PP' },
    { name: 'Amit Kumar', upi: 'amit@paytm', avatar: 'AK' },
    { name: 'Sneha Reddy', upi: 'sneha@okicici', avatar: 'SR' },
  ]

  return (
    <div className="min-h-screen bg-gradient-dark pt-20">
      <Navbar type="dashboard" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">Send Money</h1>
          <p className="text-gray-400">Secure UPI transfers with real-time fraud protection</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="space-y-6">
                <Input
                  label="UPI ID or Phone Number"
                  icon={Search}
                  type="text"
                  placeholder="name@upi or +91 98765 43210"
                />
                
                <Input
                  label="Amount (₹)"
                  type="number"
                  placeholder="0.00"
                />

                <Input
                  label="Note (Optional)"
                  type="text"
                  placeholder="Add a note..."
                />

                <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-green-400" />
                  <p className="text-green-400 text-sm">
                    This transaction will be protected by AI fraud detection
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button className="flex-1">
                    Send Money <ArrowUpRight className="inline ml-2 w-5 h-5" />
                  </Button>
                  <Button variant="secondary">
                    <QrCode className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Quick Amounts */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Quick Amounts</h3>
              <div className="grid grid-cols-4 gap-3">
                {[100, 500, 1000, 2000].map((amount) => (
                  <button
                    key={amount}
                    className="p-3 bg-dark-600/50 border border-white/10 rounded-xl hover:bg-dark-500 transition-colors font-medium"
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Recipients */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Recent Recipients</h3>
              <div className="space-y-3">
                {recentRecipients.map((recipient, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center gap-3 p-3 bg-dark-600/30 rounded-xl hover:bg-dark-600/50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                      {recipient.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{recipient.name}</p>
                      <p className="text-xs text-gray-400">{recipient.upi}</p>
                    </div>
                    <Clock className="w-4 h-4 text-gray-500" />
                  </button>
                ))}
              </div>
            </Card>

            {/* Security Info */}
            <Card className="bg-gradient-primary/20 border-primary-500/30">
              <h3 className="text-lg font-semibold mb-3 gradient-text">Security Features</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  Real-time fraud analysis
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  Device verification
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  Location-based checks
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  Behavioral pattern analysis
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SendMoney
