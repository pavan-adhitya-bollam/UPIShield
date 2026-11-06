import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Shield, Zap, Lock, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Card from '../components/Card'

const LandingPage = () => {
  const features = [
    {
      icon: Shield,
      title: 'AI-Powered Detection',
      description: 'Advanced machine learning algorithms analyze transaction patterns in real-time to detect fraudulent activities.',
    },
    {
      icon: Zap,
      title: 'Instant Protection',
      description: 'Get immediate alerts and automatic blocking of suspicious transactions before they complete.',
    },
    {
      icon: Lock,
      title: 'Bank-Grade Security',
      description: 'Enterprise-level encryption and security protocols to keep your financial data safe.',
    },
    {
      icon: TrendingUp,
      title: 'Smart Analytics',
      description: 'Detailed insights and analytics to help you understand your spending patterns and risk factors.',
    },
  ]

  const stats = [
    { value: '~94%', label: 'Test Accuracy' },
    { value: '< 1s', label: 'Response Time' },
    { value: '50K+', label: 'Protected Users' },
    { value: '₹100Cr+', label: 'Fraud Prevented' },
  ]

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navbar type="landing" />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="gradient-text">Intelligent UPI</span>
              <br />
              <span className="text-white">Fraud Detection</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Protect your digital payments with AI-powered real-time fraud detection. 
              Stay secure, stay confident.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg">Get Started Free</Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg">Login</Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          >
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <h3 className="text-3xl font-bold gradient-text">{stat.value}</h3>
                <p className="text-gray-400 mt-2">{stat.label}</p>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Powerful Features</span>
            </h2>
            <p className="text-gray-400 text-lg">Everything you need to stay protected</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <div className="p-3 bg-gradient-primary rounded-xl w-fit mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="gradient-text">How It Works</span>
            </h2>
            <p className="text-gray-400 text-lg">Simple 3-step process to get protected</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Connect Your UPI', desc: 'Link your UPI accounts securely with our platform' },
              { step: '02', title: 'AI Analysis', desc: 'Our AI analyzes every transaction in real-time' },
              { step: '03', title: 'Stay Protected', desc: 'Get instant alerts and automatic fraud blocking' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-6xl font-bold gradient-text mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Simple Pricing</span>
            </h2>
            <p className="text-gray-400 text-lg">Start securely with the tools you need</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Personal', price: 'Free', detail: 'Core transaction protection and risk insights.' },
              { name: 'Protected', price: '₹99/mo', detail: 'Advanced monitoring and detailed analytics.' },
              { name: 'Business', price: 'Custom', detail: 'Operational visibility for growing payment teams.' }
            ].map((plan) => (
              <Card key={plan.name} className="text-center">
                <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                <p className="text-3xl font-bold gradient-text mt-4">{plan.price}</p>
                <p className="text-gray-400 mt-3">{plan.detail}</p>
                <Link to="/register">
                  <Button variant="secondary" className="mt-6">Get Started</Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center bg-gradient-primary/20 border-primary-500/30">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Protected?</h2>
            <p className="text-gray-400 text-lg mb-8">
              Join thousands of users who trust UPI Shield for their digital payments
            </p>
            <Link to="/register">
              <Button size="lg">Start Free Trial <ArrowRight className="inline ml-2 w-5 h-5" /></Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 UPI Shield. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
