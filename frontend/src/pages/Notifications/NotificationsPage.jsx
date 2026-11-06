import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Bell, Trash2, CheckCircle2, Inbox } from 'lucide-react'
import Card from '../../components/Card'
import { notificationFilters, notificationsList, notificationSummary, notificationTypeLabels, notificationTypeStyles } from '../../data/notificationsMockData'

const NotificationBadge = ({ type }) => {
  const style = notificationTypeStyles[type] || notificationTypeStyles.SYSTEM
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${style.border} ${style.bg} text-xs ${style.text}`}>
      {notificationTypeLabels[type] || type}
    </span>
  )
}

const NotificationsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [notifications, setNotifications] = useState(notificationsList)
  const [selectedNotification, setSelectedNotification] = useState(null)

  const filteredNotifications = useMemo(() => {
    let items = [...notifications]
    const filterTypeMap = {
      'fraud-alert': 'FRAUD_ALERT',
      transaction: 'TRANSACTION',
      security: 'SECURITY',
      login: 'LOGIN',
      system: 'SYSTEM',
      promotion: 'PROMOTION'
    }

    if (activeFilter !== 'all') {
      if (activeFilter === 'unread') {
        items = items.filter((notification) => !notification.read)
      } else {
        const typeKey = filterTypeMap[activeFilter] || activeFilter.toUpperCase().replace(/-/g, '_')
        items = items.filter((notification) => notification.type === typeKey)
      }
    }

    if (search) {
      const query = search.toLowerCase()
      items = items.filter((notification) =>
        notification.title.toLowerCase().includes(query) ||
        notification.description.toLowerCase().includes(query) ||
        (notification.transactionId || '').toLowerCase().includes(query)
      )
    }
    return items
  }, [activeFilter, search, notifications])

  const handleMarkRead = (id) => {
    setNotifications((prev) => prev.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    ))
  }

  const handleMarkUnread = (id) => {
    setNotifications((prev) => prev.map((notification) =>
      notification.id === id ? { ...notification, read: false } : notification
    ))
  }

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
    if (selectedNotification?.id === id) {
      setSelectedNotification(null)
    }
  }

  const handleClearAll = () => {
    setNotifications([])
    setSelectedNotification(null)
  }

  const notificationSummaryCards = [
    { title: 'All Notifications', value: notificationSummary.all },
    { title: 'Unread', value: notificationSummary.unread },
    { title: 'Fraud Alerts', value: notificationSummary.fraudAlerts },
    { title: 'Transaction Alerts', value: notificationSummary.transactionAlerts },
    { title: 'Security Alerts', value: notificationSummary.securityAlerts }
  ]

  return (
    <div className="min-h-screen bg-dark-900 p-4 lg:p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[.3em] text-primary-400 mb-2">Notifications</p>
            <h1 className="text-3xl lg:text-4xl font-bold text-white">Notification Center</h1>
            <p className="mt-2 text-gray-400 max-w-2xl">Track alerts, security notices, fraud signals, and transaction messages in one operational control center.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white hover:bg-white/10 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark All Read
            </button>
            <button
              onClick={handleClearAll}
              className="inline-flex items-center gap-2 px-4 py-3 bg-red-500/15 border border-red-500/30 rounded-xl text-sm text-red-300 hover:bg-red-500/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 mb-6">
          {notificationSummaryCards.map((card) => (
            <Card key={card.title} className="p-5 border border-white/10">
              <p className="text-sm text-gray-400 uppercase tracking-[.25em] mb-3">{card.title}</p>
              <p className="text-3xl font-semibold text-white">{card.value}</p>
            </Card>
          ))}
        </div>

        <Card className="mb-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            <div className="xl:col-span-3">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by title, description, transaction ID..."
                    className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white text-sm outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                  {notificationFilters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeFilter === filter.id ? 'bg-primary-500 text-white' : 'bg-dark-800 border border-white/10 text-gray-300 hover:bg-white/5'}`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="xl:col-span-1 flex items-center justify-end">
              <button
                onClick={() => setSearch('')}
                className="inline-flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white hover:bg-white/10 transition-colors"
              >
                <Bell className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7">
            <Card className="p-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-white">Notifications</p>
                  <p className="text-sm text-gray-400">{filteredNotifications.length} items found</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveFilter('unread')}
                    className="px-4 py-2 rounded-xl bg-white/5 text-sm text-white hover:bg-white/10"
                  >
                    Unread Only
                  </button>
                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-sm text-white hover:bg-white/10"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>

              {filteredNotifications.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  <p className="text-xl font-semibold text-white mb-3">No notifications found</p>
                  <p className="max-w-lg mx-auto">Try changing your filter or search query to locate relevant alerts and messages.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => {
                    const style = notificationTypeStyles[notification.type] || notificationTypeStyles.SYSTEM
                    return (
                      <div key={notification.id} className={`bg-dark-800/80 border ${style.border} ${style.bg} rounded-3xl p-4`}>
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-3xl bg-white/5">
                              <Bell className={`w-5 h-5 ${style.text}`} />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h3 className="text-white font-semibold">{notification.title}</h3>
                                <NotificationBadge type={notification.type} />
                              </div>
                              <p className="text-gray-300">{notification.description}</p>
                              {notification.transactionId && (
                                <p className="text-gray-400 text-sm mt-2">Transaction ID: <span className="text-white">{notification.transactionId}</span></p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-start gap-3 sm:items-end">
                            <span className="text-xs text-gray-500">{notification.timestamp}</span>
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => setSelectedNotification(notification)}
                                className="px-4 py-2 rounded-xl bg-primary-500/15 text-primary-300 text-sm hover:bg-primary-500/25"
                              >
                                View Details
                              </button>
                              {notification.read ? (
                                <button
                                  onClick={() => handleMarkUnread(notification.id)}
                                  className="px-4 py-2 rounded-xl bg-white/5 text-sm text-white hover:bg-white/10"
                                >
                                  Mark Unread
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleMarkRead(notification.id)}
                                  className="px-4 py-2 rounded-xl bg-white/5 text-sm text-white hover:bg-white/10"
                                >
                                  Mark Read
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(notification.id)}
                                className="px-4 py-2 rounded-xl bg-red-500/15 text-red-300 text-sm hover:bg-red-500/20"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </Card>
          </div>
          <div className="xl:col-span-5">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-lg font-semibold text-white">Notification Details</p>
                  <p className="text-sm text-gray-400">Open a notification to see the full alert message and recommended actions.</p>
                </div>
                <Inbox className="w-5 h-5 text-primary-400" />
              </div>
              {selectedNotification ? (
                <div className="space-y-4">
                  <div className="bg-dark-900/80 border border-white/10 rounded-3xl p-5">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-400 uppercase tracking-[.25em] mb-2">{notificationTypeLabels[selectedNotification.type] || selectedNotification.type}</p>
                        <h2 className="text-2xl font-semibold text-white">{selectedNotification.title}</h2>
                      </div>
                      <span className="text-sm text-gray-500">{selectedNotification.timestamp}</span>
                    </div>
                    <p className="text-gray-300">{selectedNotification.description}</p>
                    {selectedNotification.transactionId && (
                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="bg-dark-800/70 rounded-3xl p-4 border border-white/10">
                          <p className="text-sm text-gray-400">Transaction ID</p>
                          <p className="text-white font-semibold">{selectedNotification.transactionId}</p>
                        </div>
                        <div className="bg-dark-800/70 rounded-3xl p-4 border border-white/10">
                          <p className="text-sm text-gray-400">Priority</p>
                          <p className="text-white font-semibold">{selectedNotification.priority}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {selectedNotification.type === 'FRAUD_ALERT' && (
                    <div className="bg-dark-900/80 border border-white/10 rounded-3xl p-5">
                      <p className="text-sm text-gray-400 uppercase tracking-[.25em] mb-4">Fraud Alert Details</p>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="bg-dark-800/70 rounded-3xl p-4">
                          <p className="text-sm text-gray-400">Risk Score</p>
                          <p className="text-white font-semibold">{selectedNotification.riskScore}%</p>
                        </div>
                        <div className="bg-dark-800/70 rounded-3xl p-4">
                          <p className="text-sm text-gray-400">Fraud Probability</p>
                          <p className="text-white font-semibold">{selectedNotification.fraudProbability}%</p>
                        </div>
                        <div className="bg-dark-800/70 rounded-3xl p-4">
                          <p className="text-sm text-gray-400">Risk Level</p>
                          <p className="text-white font-semibold">{selectedNotification.riskLevel}</p>
                        </div>
                        <div className="bg-dark-800/70 rounded-3xl p-4">
                          <p className="text-sm text-gray-400">Reason</p>
                          <p className="text-white font-semibold">{selectedNotification.reason}</p>
                        </div>
                      </div>
                      <div className="mt-5 flex flex-wrap gap-3">
                        <button className="px-5 py-3 rounded-xl bg-gradient-primary text-white text-sm">View Transaction</button>
                        <button className="px-5 py-3 rounded-xl bg-white/5 text-white text-sm hover:bg-white/10">Review Fraud</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                  <p className="text-lg font-semibold text-white mb-2">Select a notification</p>
                  <p className="max-w-sm">Notifications opened here will show full message details, transaction context, and recommended actions.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default NotificationsPage
