import api from './authService'

// Transaction Service - Real API calls to backend
export const transactionService = {
  // Create the transaction only after MPIN authorization
  sendMoney: async (transactionData) => {
    try {
      const response = await api.post('/transactions/send', transactionData)
      return response.data
    } catch (error) {
      console.error('Send money error:', error)
      throw error
    }
  },

  assessTransaction: async (transactionData) => {
    const response = await api.post('/transactions/assess', transactionData)
    return response.data
  },

  createMpin: async (mpin) => {
    const response = await api.post('/transactions/create-mpin', { mpin })
    return response.data
  },

  verifyMpin: async (mpin) => {
    try {
      const response = await api.post('/transactions/verify-mpin', { mpin })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get transaction history
  getTransactionHistory: async (filters = {}) => {
    try {
      const response = await api.get('/transactions/history', { params: filters })
      return response.data
    } catch (error) {
      console.error('Get transaction history error:', error)
      throw error
    }
  },

  getAllTransactionHistory: async () => {
    const pageSize = 100
    let page = 1
    let totalPages = 1
    const transactions = []

    while (page <= totalPages) {
      const response = await api.get('/transactions/history', {
        params: { page, limit: pageSize, sortBy: 'transactionTime', sortOrder: 'desc' }
      })
      const result = response.data
      transactions.push(...(result.data || []))
      totalPages = result.pagination?.totalPages || 1
      page += 1
    }

    return transactions
  },

  // Get transaction details
  getTransactionDetails: async (transactionId) => {
    try {
      const response = await api.get(`/transactions/${transactionId}`)
      return response.data
    } catch (error) {
      console.error('Get transaction details error:', error)
      throw error
    }
  },

  // Cancel transaction
  cancelTransaction: async (transactionId) => {
    try {
      const response = await api.put(`/transactions/${transactionId}/cancel`)
      return response.data
    } catch (error) {
      console.error('Cancel transaction error:', error)
      throw error
    }
  },

  // Export transactions as CSV
  exportCsv: async (filters = {}) => {
    try {
      const response = await api.get('/transactions/export/csv', { 
        params: filters,
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      console.error('Export CSV error:', error)
      throw error
    }
  }
}

export default transactionService
