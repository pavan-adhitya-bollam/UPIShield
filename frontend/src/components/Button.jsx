import { motion } from 'framer-motion'

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-300'
  
  const variants = {
    primary: 'bg-gradient-primary text-white shadow-lg shadow-primary-500/25 hover:opacity-90',
    secondary: 'bg-dark-600 text-white border border-white/10 hover:bg-dark-500',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25 hover:opacity-90',
    ghost: 'bg-transparent text-gray-300 hover:text-white hover:bg-white/5',
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button
