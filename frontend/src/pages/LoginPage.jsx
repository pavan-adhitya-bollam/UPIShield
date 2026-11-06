import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4">
      <Navbar type="landing" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md pt-20"
      >
        <Card>
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-primary rounded-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h2>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          <form className="space-y-6">
            <Input
              label="Email Address"
              icon={Mail}
              type="email"
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              icon={Lock}
              type="password"
              placeholder="••••••••"
            />
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 text-gray-400">
                <input type="checkbox" className="rounded" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-primary-400 hover:text-primary-300">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full">
              Sign In <ArrowRight className="inline ml-2 w-5 h-5" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default LoginPage
