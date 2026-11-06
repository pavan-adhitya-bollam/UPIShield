import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Shield, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4 py-20">
      <Navbar type="landing" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-primary rounded-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold gradient-text mb-2">Create Account</h2>
            <p className="text-gray-400">Start protecting your UPI transactions</p>
          </div>

          <form className="space-y-5">
            <Input
              label="Full Name"
              icon={User}
              type="text"
              placeholder="John Doe"
            />
            <Input
              label="Email Address"
              icon={Mail}
              type="email"
              placeholder="you@example.com"
            />
            <Input
              label="Phone Number"
              icon={Phone}
              type="tel"
              placeholder="+91 98765 43210"
            />
            <Input
              label="Password"
              icon={Lock}
              type="password"
              placeholder="••••••••"
            />
            <Input
              label="Confirm Password"
              icon={Lock}
              type="password"
              placeholder="••••••••"
            />
            
            <label className="flex items-start space-x-2 text-sm text-gray-400">
              <input type="checkbox" className="rounded mt-1" />
              <span>
                I agree to the{' '}
                <a href="#" className="text-primary-400 hover:text-primary-300">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-400 hover:text-primary-300">
                  Privacy Policy
                </a>
              </span>
            </label>

            <Button type="submit" className="w-full">
              Create Account <ArrowRight className="inline ml-2 w-5 h-5" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default RegisterPage
