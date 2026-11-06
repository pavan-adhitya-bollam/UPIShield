import { motion } from 'framer-motion'
import { HelpCircle, MessageCircle, Mail, Phone, FileText, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import Card from '../Card'
import { faqData } from '../../data/settingsMockData'
import { useState } from 'react'

const HelpSupport = ({ onReportIssue, onChatSupport, onEmailSupport, onCallSupport }) => {
  const [expandedFaq, setExpandedFaq] = useState(null)

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-bold text-white">Help & Support</h2>
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <button
            onClick={onChatSupport}
            className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <div className="p-3 bg-primary-500/20 rounded-lg">
              <MessageCircle className="w-5 h-5 text-primary-400" />
            </div>
            <div className="text-left">
              <p className="text-white font-medium">Chat Support</p>
              <p className="text-xs text-gray-400">Live chat with support</p>
            </div>
          </button>

          <button
            onClick={onEmailSupport}
            className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <div className="p-3 bg-accent-500/20 rounded-lg">
              <Mail className="w-5 h-5 text-accent-400" />
            </div>
            <div className="text-left">
              <p className="text-white font-medium">Email Support</p>
              <p className="text-xs text-gray-400">support@upifraud.com</p>
            </div>
          </button>

          <button
            onClick={onCallSupport}
            className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Phone className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-left">
              <p className="text-white font-medium">Call Support</p>
              <p className="text-xs text-gray-400">1800-123-4567</p>
            </div>
          </button>

          <button
            onClick={onReportIssue}
            className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <div className="p-3 bg-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-left">
              <p className="text-white font-medium">Report Issue</p>
              <p className="text-xs text-gray-400">Report a problem</p>
            </div>
          </button>
        </div>

        {/* FAQs */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {faqData.map((faq) => (
              <div
                key={faq.id}
                className="p-4 bg-white/5 rounded-lg"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <p className="text-white font-medium pr-4">{faq.question}</p>
                  {expandedFaq === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === faq.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-white/10"
                  >
                    <p className="text-sm text-gray-400">{faq.answer}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Legal Links */}
        <div className="space-y-3">
          <button className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors w-full">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-left flex-1">
              <p className="text-white font-medium">Terms & Conditions</p>
              <p className="text-xs text-gray-400">Read our terms of service</p>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors w-full">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-left flex-1">
              <p className="text-white font-medium">Privacy Policy</p>
              <p className="text-xs text-gray-400">Learn about our privacy practices</p>
            </div>
          </button>
        </div>
      </Card>

      {/* Support Hours */}
      <Card>
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-white mb-2">Support Hours</p>
            <p className="text-xs text-gray-400 mb-1">
              <span className="text-white">Chat Support:</span> 24/7
            </p>
            <p className="text-xs text-gray-400 mb-1">
              <span className="text-white">Phone Support:</span> Mon-Fri, 9 AM - 9 PM IST
            </p>
            <p className="text-xs text-gray-400">
              <span className="text-white">Email Support:</span> Response within 24 hours
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default HelpSupport
