import { motion } from 'framer-motion'

const Card = ({ children, className = '', hover = false, ...props }) => {
  const baseStyles = 'glass-card p-6'
  const hoverStyles = hover ? 'glass-card-hover' : ''
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${baseStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card
