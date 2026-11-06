import { motion } from 'framer-motion'
import { User, Clock, ArrowRight } from 'lucide-react'
import Card from '../Card'

const RecentBeneficiaries = ({ beneficiaries = [], onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-primary-400" />
            Recent Beneficiaries
          </h3>
          <span className="text-sm text-gray-400">{beneficiaries.length}</span>
        </div>

        <div className="space-y-3">
          {beneficiaries.length === 0 ? (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No recent beneficiaries</p>
            </div>
          ) : (
            beneficiaries.map((beneficiary, index) => (
              <motion.button
                key={beneficiary.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelect && onSelect(beneficiary)}
                className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary-500/30 transition-all duration-200 text-left group"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-medium text-sm">{beneficiary.avatar}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{beneficiary.name}</p>
                    <p className="text-gray-400 text-xs truncate">{beneficiary.upiId}</p>
                  </div>

                  {/* Last Paid */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-gray-400 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {beneficiary.lastPaid}
                    </p>
                    <p className="text-primary-400 text-xs font-medium">₹{beneficiary.amount.toLocaleString()}</p>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-primary-400 transition-colors flex-shrink-0" />
                </div>
              </motion.button>
            ))
          )}
        </div>

        {beneficiaries.length > 0 && (
          <button className="w-full mt-4 text-sm text-primary-400 hover:text-primary-300 transition-colors">
            View All Beneficiaries
          </button>
        )}
      </Card>
    </motion.div>
  )
}

export default RecentBeneficiaries
