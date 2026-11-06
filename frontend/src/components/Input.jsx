import { motion } from 'framer-motion'

const Input = ({ label, icon: Icon, className = '', ...props }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-300">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
        )}
        <motion.input
          whileFocus={{ scale: 1.01 }}
          className={`input-field ${Icon ? 'pl-12' : ''} ${className}`}
          {...props}
        />
      </div>
    </div>
  )
}

export default Input
