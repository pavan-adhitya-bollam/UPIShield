import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Shield, Menu, X } from 'lucide-react'
import { useState } from 'react'
import Button from './Button'

const Navbar = ({ type = 'landing' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navLinks = {
    landing: [
      { name: 'Features', href: '#features' },
      { name: 'How it Works', href: '#how-it-works' },
      { name: 'Pricing', href: '#pricing' },
    ],
    dashboard: [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Send Money', href: '/send-money' },
      { name: 'Transactions', href: '/transactions' },
      { name: 'Profile', href: '/profile' },
    ],
  }

  const links = navLinks[type] || navLinks.landing
  const getLandingHref = (href) => location.pathname === '/' ? href : `/${href}`

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-0 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">UPI Shield</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {type === 'landing' ? (
              <>
                {links.map((link) => (
                  <a
                    key={link.name}
                    href={getLandingHref(link.href)}
                    className="nav-link"
                  >
                    {link.name}
                  </a>
                ))}
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary">Get Started</Button>
                </Link>
              </>
            ) : (
              <>
                {links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`nav-link ${location.pathname === link.href ? 'nav-link-active' : ''}`}
                  >
                    {link.name}
                  </Link>
                ))}
                <Button variant="danger" size="sm">Logout</Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden glass-card border-0 border-t border-white/10"
        >
          <div className="px-4 py-4 space-y-3">
            {links.map((link) => (
              <a
                key={link.name}
                href={getLandingHref(link.href)}
                className="block py-2 nav-link"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            {type === 'landing' && (
              <div className="pt-4 space-y-2">
                <Link to="/login" className="block">
                  <Button variant="secondary" className="w-full">Login</Button>
                </Link>
                <Link to="/register" className="block">
                  <Button variant="primary" className="w-full">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}

export default Navbar
