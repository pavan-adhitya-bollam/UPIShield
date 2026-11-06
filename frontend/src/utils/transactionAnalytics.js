const statusMap = {
  SUCCESS: 'Completed',
  BLOCKED: 'Blocked',
  FAILED: 'Failed',
  CANCELLED: 'Failed',
  PENDING: 'Pending',
  PROCESSING: 'Pending'
}

const colors = {
  LOW: '#10b981',
  MEDIUM: '#f59e0b',
  HIGH: '#f97316',
  CRITICAL: '#ef4444'
}

export const normalizeTransaction = (transaction = {}) => {
  const transactionTime = transaction.transactionTime || transaction.createdAt
  const amount = Number(transaction.amount || 0)
  const fraudProbability = Number(transaction.fraudProbability || 0)
  const probabilityPercent = fraudProbability <= 1
    ? Math.round(fraudProbability * 100)
    : Math.round(fraudProbability)

  return {
    ...transaction,
    id: transaction.transactionId,
    sender: transaction.sender?.name || transaction.senderUpi || '-',
    senderUpi: transaction.senderUpi || transaction.sender?.upiId || '-',
    receiver: transaction.receiver?.name || transaction.receiverUpi || '-',
    receiverUpi: transaction.receiverUpi || transaction.receiver?.upiId || '-',
    amount,
    charges: 0,
    totalAmount: amount,
    transactionType: transaction.transactionType || '-',
    transactionTime,
    date: transactionTime ? new Date(transactionTime).toLocaleDateString() : '-',
    time: transactionTime
      ? new Date(transactionTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '-',
    status: statusMap[transaction.status] || transaction.status || 'Pending',
    riskLevel: transaction.riskLevel || 'LOW',
    assessmentStatus: transaction.assessmentStatus || 'COMPLETED',
    predictionProvider: transaction.predictionProvider || transaction.provider || 'NONE',
    assessmentMessage: transaction.assessmentStatus === 'INSUFFICIENT_TRANSACTION_HISTORY'
      ? 'New Account – No Previous Transaction History. Behavioural Risk Assessment Not Available.'
      : '',
    riskScore: Number(transaction.riskScore || probabilityPercent),
    fraudProbability: probabilityPercent,
    paymentStatus: transaction.paymentStatus || (transaction.status === 'SUCCESS' ? 'Success' : 'Failed'),
    predictionStatus: transaction.predictionStatus === 'FRAUD' || transaction.riskLevel === 'HIGH' || transaction.riskLevel === 'CRITICAL' || probabilityPercent >= 50
      ? 'Fraud'
      : 'Genuine',
    referenceNumber: transaction.referenceNumber || '-',
    purpose: transaction.purpose || 'Optional',
    location: transaction.locationInfo?.city || '-',
    device: transaction.deviceInfo?.deviceName || '-',
    confidenceScore: Number(transaction.predictionConfidence || 0)
  }
}

const monthKey = (date) => date.toLocaleString('en-US', { month: 'short', year: 'numeric' })

export const deriveTransactionAnalytics = (rawTransactions = []) => {
  const transactions = rawTransactions
    .map(normalizeTransaction)
    .sort((left, right) => new Date(right.transactionTime || 0) - new Date(left.transactionTime || 0))
  const completedTransactions = transactions.filter((transaction) => transaction.status === 'Completed')
  const successfulTransactions = completedTransactions.length
  const failedTransactions = transactions.filter((transaction) => ['Failed', 'Blocked'].includes(transaction.status)).length
  const modelPredictedFraud = transactions.filter((transaction) => (
    transaction.riskLevel === 'HIGH' ||
    transaction.riskLevel === 'CRITICAL' ||
    transaction.fraudProbability >= 50
  )).length
  const totalAmount = transactions.reduce((total, transaction) => total + transaction.amount, 0)
  const averageRiskScore = transactions.length
    ? transactions.reduce((total, transaction) => total + transaction.riskScore, 0) / transactions.length
    : 0
  const today = new Date().toDateString()
  const todayTransactions = transactions.filter((transaction) => (
    transaction.transactionTime && new Date(transaction.transactionTime).toDateString() === today
  )).length

  const riskDistribution = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((level) => ({
    name: level,
    value: transactions.filter((transaction) => transaction.riskLevel === level).length,
    color: colors[level]
  })).filter((entry) => entry.value > 0)

  const fraudVsGenuine = [
    { name: 'Model-predicted genuine', value: transactions.length - modelPredictedFraud, color: '#10b981' },
    { name: 'Model-predicted fraud', value: modelPredictedFraud, color: '#ef4444' }
  ].filter((entry) => entry.value > 0)

  const monthly = new Map()
  const daily = new Map()
  const categories = new Map()
  const typeCounts = new Map()
  const locations = new Map()
  const hourCounts = new Map()
  transactions.forEach((transaction) => {
    if (transaction.transactionTime) {
      const date = new Date(transaction.transactionTime)
      const key = monthKey(date)
      const current = monthly.get(key) || { month: key, transactions: 0, amount: 0, timestamp: date.getTime() }
      current.transactions += 1
      current.amount += transaction.amount
      monthly.set(key, current)

      const dayKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const dailyValue = daily.get(dayKey) || { day: dayKey, transactions: 0, amount: 0, timestamp: date.getTime() }
      dailyValue.transactions += 1
      dailyValue.amount += transaction.amount
      daily.set(dayKey, dailyValue)

      const hourKey = `${String(date.getHours()).padStart(2, '0')}:00`
      const hourValue = hourCounts.get(hourKey) || { period: hourKey, transactions: 0, fraud: 0 }
      hourValue.transactions += 1
      if (transaction.riskLevel === 'HIGH' || transaction.riskLevel === 'CRITICAL' || transaction.fraudProbability >= 50) hourValue.fraud += 1
      hourCounts.set(hourKey, hourValue)
    }
    const category = transaction.merchantCategory || transaction.transactionType || 'Other'
    categories.set(category, (categories.get(category) || 0) + transaction.amount)
    typeCounts.set(transaction.transactionType || 'Other', (typeCounts.get(transaction.transactionType || 'Other') || 0) + 1)
    const location = transaction.location || 'Unknown'
    const locationValue = locations.get(location) || { name: location, transactions: 0, fraudTransactions: 0 }
    locationValue.transactions += 1
    if (transaction.riskLevel === 'HIGH' || transaction.riskLevel === 'CRITICAL' || transaction.fraudProbability >= 50) locationValue.fraudTransactions += 1
    locations.set(location, locationValue)
  })

  return {
    transactions,
    recentTransactions: transactions.slice(0, 8),
    totalTransactions: transactions.length,
    totalAmount,
    successfulTransactions,
    failedTransactions,
    fraudulentTransactions: modelPredictedFraud,
    todayTransactions,
    averageAmount: transactions.length ? Math.round(totalAmount / transactions.length) : 0,
    averageRiskScore,
    riskDistribution,
    fraudVsGenuine,
    dailyTransactionsData: [...daily.values()].sort((left, right) => left.timestamp - right.timestamp),
    monthlyTransactionData: [...monthly.values()].sort((left, right) => left.timestamp - right.timestamp),
    spendingCategoriesData: [...categories.entries()].map(([category, amount]) => ({ category, amount })),
    transactionCategoriesData: [...categories.entries()].map(([category, amount]) => ({ category, amount, count: transactions.filter((transaction) => (transaction.merchantCategory || transaction.transactionType || 'Other') === category).length })),
    successVsFailedData: [
      { name: 'Successful', value: successfulTransactions, color: '#10b981' },
      { name: 'Failed', value: failedTransactions, color: '#ef4444' }
    ].filter((entry) => entry.value > 0),
    fraudTrendData: [...monthly.values()].sort((left, right) => left.timestamp - right.timestamp).map((entry) => ({
      month: entry.month,
      fraud: transactions.filter((transaction) => transaction.transactionTime && monthKey(new Date(transaction.transactionTime)) === entry.month && (transaction.riskLevel === 'HIGH' || transaction.riskLevel === 'CRITICAL' || transaction.fraudProbability >= 50)).length,
      genuine: transactions.filter((transaction) => transaction.transactionTime && monthKey(new Date(transaction.transactionTime)) === entry.month && transaction.riskLevel !== 'HIGH' && transaction.riskLevel !== 'CRITICAL' && transaction.fraudProbability < 50).length
    })),
    fraudByHour: [...hourCounts.values()].sort((left, right) => left.period.localeCompare(right.period)),
    typeRiskIndicators: [...typeCounts.entries()].map(([type, count], index) => ({ id: type, rank: index + 1, title: type, detail: `${count} transaction${count === 1 ? '' : 's'}` })),
    locationAnalytics: {
      topLocations: [...locations.values()].map((location) => ({ ...location, fraudRate: `${location.transactions ? ((location.fraudTransactions / location.transactions) * 100).toFixed(1) : '0.0'}%` })).sort((left, right) => right.transactions - left.transactions),
      topFraudLocations: [...locations.values()].map((location) => ({ ...location, fraudRate: `${location.transactions ? ((location.fraudTransactions / location.transactions) * 100).toFixed(1) : '0.0'}%` })).sort((left, right) => right.fraudTransactions - left.fraudTransactions)
    },
    behavioralAnalytics: [
      { id: 'average-risk', title: 'Average risk score', value: `${averageRiskScore.toFixed(1)}%`, description: 'Average model risk score across the current user transaction set.', note: 'Calculated from persisted predictions.' },
      { id: 'fraud-rate', title: 'Model-predicted fraud rate', value: `${transactions.length ? ((modelPredictedFraud / transactions.length) * 100).toFixed(1) : '0.0'}%`, description: 'Share of transactions classified as high-risk by the model.', note: 'Calculated from persisted predictions.' }
    ]
  }
}

export const emptyTransactionAnalytics = deriveTransactionAnalytics([])
